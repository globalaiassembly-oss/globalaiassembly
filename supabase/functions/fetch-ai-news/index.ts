// Supabase Edge Function: fetch-ai-news
// Deploy this in your Supabase dashboard. Add GNEWS_API_KEY as a secret.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const QUERIES: { category: "TECH" | "SECURITY" | "SOCIETY"; q: string }[] = [
  { category: "TECH", q: "AI safety regulation" },
  { category: "SECURITY", q: "AI governance security" },
  { category: "SOCIETY", q: "AI ethics society jobs" },
];

const CACHE_HOURS = 6;

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

    // Fetch fresh from GNews
    let inserted = 0;
    for (const { category, q } of QUERIES) {
      const url = new URL("https://gnews.io/api/v4/search");
      url.searchParams.set("q", q);
      url.searchParams.set("lang", "en");
      url.searchParams.set("sortby", "publishedAt");
      url.searchParams.set("max", "5");
      url.searchParams.set("apikey", gnewsKey);

      const res = await fetch(url.toString());
      if (!res.ok) continue;
      const json = await res.json();
      const articles = (json.articles ?? []) as Array<{
        title: string;
        description: string | null;
        url: string;
        publishedAt: string;
      }>;

      for (const a of articles) {
        if (!a.url || !a.title) continue;
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
