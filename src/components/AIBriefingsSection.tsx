import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type NewsItem = {
  id: string;
  title: string;
  summary: string | null;
  topics: string[] | null;
  source_url: string | null;
  published_at: string | null;
  created_at?: string | null;
};

const getDomain = (url: string | null) => {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const relativeTime = (iso: string | null) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  const mo = Math.round(d / 30);
  return `${mo} month${mo === 1 ? "" : "s"} ago`;
};

const SkeletonCard = () => (
  <div className="rounded-2xl border border-border bg-card p-6 animate-pulse h-full">
    <div className="h-5 w-5/6 bg-muted rounded mb-2" />
    <div className="h-5 w-3/4 bg-muted rounded mb-4" />
    <div className="h-3 w-full bg-muted rounded mb-1.5" />
    <div className="h-3 w-full bg-muted rounded mb-1.5" />
    <div className="h-3 w-2/3 bg-muted rounded" />
  </div>
);

const Card = ({ item }: { item: NewsItem }) => (
  <a
    href={item.source_url ?? "#"}
    target="_blank"
    rel="noopener noreferrer"
    className="block h-full focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl"
  >
    <div className="group rounded-2xl border border-border bg-card p-6 flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <h3 className="font-heading font-bold text-lg text-foreground mb-3 leading-snug line-clamp-2">
        {item.title}
      </h3>
      {item.summary && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
          {item.summary}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
        <span className="truncate max-w-[60%]">{getDomain(item.source_url)}</span>
        <span>{relativeTime(item.published_at)}</span>
      </div>
    </div>
  </a>
);

const AIBriefingsSection = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await supabase.functions.invoke("fetch-ai-news", { body: {} });
      } catch {
        // ignore
      }
      const { data } = await supabase
        .from("ai_news")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(6);
      const { data: newest } = await supabase
        .from("ai_news")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) {
        setItems((data ?? []) as NewsItem[]);
        setLastRefresh((newest as { created_at?: string } | null)?.created_at ?? null);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return (
    <section id="briefings" className="section-padding bg-background">
      <div className="container mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 text-center">
          Stay Informed
        </p>
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4 text-center">
          Latest AI Briefings
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-12">
          Updated weekly{lastRefresh ? ` · Last refresh: ${relativeTime(lastRefresh)}` : ""}
        </p>

        {!loading && items.length === 0 ? (
          <p className="text-center text-muted-foreground">
            News loading — please refresh in a moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [0, 1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
              : items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="h-full"
                  >
                    <Card item={item} />
                  </motion.div>
                ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AIBriefingsSection;
