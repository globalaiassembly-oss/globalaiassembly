// Supabase Edge Function: fetch-ai-news (simplified)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CACHE_DAYS = 7;

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

    // Cache check: skip GNews if any row younger than 7 days
    const { data: latest } = await supabase
      .from("ai_news")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const ageMs = latest?.created_at
      ? Date.now() - new Date(latest.created_at).getTime()
      : Infinity;
    const fresh = ageMs < CACHE_DAYS * 24 * 60 * 60 * 1000;

    if (!fresh && gnewsKey) {
      const url = new URL("https://gnews.io/api/v4/search");
      url.searchParams.set("q", "artificial intelligence");
      url.searchParams.set("lang", "en");
      url.searchParams.set("sortby", "publishedAt");
      url.searchParams.set("max", "12");
      url.searchParams.set("apikey", gnewsKey);

      const res = await fetch(url.toString());
      if (res.ok) {
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
          await supabase.from("ai_news").insert({
            title: a.title,
            summary: a.description,
            topics: ["AI"],
            source_url: a.url,
            published_at: a.publishedAt,
          });
        }
      }
    }

    const { data: all } = await supabase
      .from("ai_news")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(12);

    return new Response(
      JSON.stringify({ cached: fresh, count: all?.length ?? 0, articles: all ?? [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
