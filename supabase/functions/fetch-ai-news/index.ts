// Supabase Edge Function: fetch-ai-news
// Deploy this in your Supabase dashboard. Add GNEWS_API_KEY as a secret.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Category = "TECH" | "SECURITY" | "SOCIETY";

const QUERIES: { category: Category; q: string }[] = [
  { category: "TECH", q: "AI safety regulation" },
  { category: "SECURITY", q: "AI governance security" },
  { category: "SOCIETY", q: "AI ethics society jobs" },
];

const FALLBACK_QUERIES: { category: Category; q: string }[] = [
  { category: "TECH", q: "OpenAI Anthropic Google AI" },
  { category: "TECH", q: "AI startup launch" },
];

const ALLOWED_DOMAINS = new Set([
  "techcrunch.com",
  "theverge.com",
  "wired.com",
  "arstechnica.com",
  "reuters.com",
  "bloomberg.com",
  "ft.com",
  "economist.com",
  "nytimes.com",
  "theguardian.com",
  "bbc.com",
  "bbc.co.uk",
  "npr.org",
  "washingtonpost.com",
  "wsj.com",
  "technologyreview.com",
  "mit.edu",
  "nature.com",
  "science.org",
  "ieee.org",
  "axios.com",
  "theinformation.com",
  "semafor.com",
  "restofworld.org",
  "lemonde.fr",
  "lefigaro.fr",
]);

const CACHE_HOURS = 6;

function domainOf(url: string): string | null {
  try {
    const h = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return h;
  } catch {
    return null;
  }
}

function isAllowedDomain(url: string): boolean {
  const d = domainOf(url);
  if (!d) return false;
  if (ALLOWED_DOMAINS.has(d)) return true;
  // allow subdomains like www.bbc.co.uk -> already stripped, plus e.g. edition.cnn — not in list
  for (const allowed of ALLOWED_DOMAINS) {
    if (d.endsWith("." + allowed)) return true;
  }
  return false;
}

async function urlIsLive(url: string): Promise<boolean> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 3000);
  try {
    const res = await fetch(url, { method: "HEAD", signal: ctrl.signal, redirect: "follow" });
    return res.status === 200;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

type GNewsArticle = {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
};

async function fetchGNews(q: string, key: string): Promise<GNewsArticle[]> {
  const url = new URL("https://gnews.io/api/v4/search");
  url.searchParams.set("q", q);
  url.searchParams.set("lang", "en");
  url.searchParams.set("sortby", "publishedAt");
  url.searchParams.set("max", "10");
  url.searchParams.set("apikey", key);
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const json = await res.json();
  return (json.articles ?? []) as GNewsArticle[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
      Deno.env.get("SUPABASE_ANON_KEY")!;
    const gnewsKey = Deno.env.get("GNEWS_API_KEY");

    const supabase = createClient(supabaseUrl, serviceKey);

    // Cache check
    const { data: latest } = await supabase
      .from("ai_news")
      .select("created_at, published_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const newest = latest?.created_at ?? latest?.published_at;
    const ageMs = newest ? Date.now() - new Date(newest).getTime() : Infinity;
    const fresh = ageMs < CACHE_HOURS * 60 * 60 * 1000;

    if (fresh || !gnewsKey) {
      const { data: cached } = await supabase
        .from("ai_news")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(30);
      return new Response(
        JSON.stringify({ cached: true, count: cached?.length ?? 0, articles: cached ?? [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Collect candidates per category
    const collected: { category: Category; a: GNewsArticle }[] = [];

    for (const { category, q } of QUERIES) {
      const arts = await fetchGNews(q, gnewsKey);
      for (const a of arts) collected.push({ category, a });
    }

    // Filter by allowed domain
    let filtered = collected.filter(
      ({ a }) => a.url && a.title && isAllowedDomain(a.url),
    );

    // If too few, expand with fallback queries
    if (filtered.length < 6) {
      for (const { category, q } of FALLBACK_QUERIES) {
        const arts = await fetchGNews(q, gnewsKey);
        for (const a of arts) {
          if (a.url && a.title && isAllowedDomain(a.url)) {
            filtered.push({ category, a });
          }
        }
        if (filtered.length >= 6) break;
      }
    }

    // Dedupe by url
    const seen = new Set<string>();
    filtered = filtered.filter(({ a }) => {
      if (seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    });

    // Verify each URL is live (HEAD, 3s timeout) — in parallel
    const liveChecks = await Promise.all(
      filtered.map(async (item) => ((await urlIsLive(item.a.url)) ? item : null)),
    );
    const live = liveChecks.filter((x): x is { category: Category; a: GNewsArticle } => x !== null);

    // Insert (skip already-existing source_urls)
    let inserted = 0;
    for (const { category, a } of live) {
      const { data: exists } = await supabase
        .from("ai_news")
        .select("id")
        .eq("source_url", a.url)
        .maybeSingle();
      if (exists) continue;
      const { error } = await supabase.from("ai_news").insert({
        title: a.title,
        summary: a.description,
        topics: [category],
        source_url: a.url,
        published_at: a.publishedAt,
      });
      if (!error) inserted++;
    }

    const { data: all } = await supabase
      .from("ai_news")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(30);

    return new Response(
      JSON.stringify({ cached: false, inserted, count: all?.length ?? 0, articles: all ?? [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
