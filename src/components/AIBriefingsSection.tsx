import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Category = "TECH" | "SECURITY" | "SOCIETY";

type NewsItem = {
  id: string;
  title: string;
  summary: string | null;
  topics: string[] | null;
  source_url: string | null;
  published_at: string | null;
  created_at?: string | null;
};

const CATEGORY_META: Record<Category, { label: string; classes: string }> = {
  TECH: { label: "TECH", classes: "bg-blue-100 text-blue-700 ring-1 ring-blue-200" },
  SECURITY: { label: "SECURITY", classes: "bg-amber-100 text-amber-800 ring-1 ring-amber-200" },
  SOCIETY: { label: "SOCIETY", classes: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200" },
};

const CATEGORIES: Category[] = ["TECH", "SECURITY", "SOCIETY"];

const getCategory = (item: NewsItem): Category => {
  const t = (item.topics ?? []).join(" ").toUpperCase();
  if (t.includes("SECURITY") || t.includes("SAFETY") || t.includes("FRONTIER") || t.includes("AGI")) return "SECURITY";
  if (t.includes("SOCIETY") || t.includes("EDUCATION") || t.includes("WORK") || t.includes("ETHICS") || t.includes("JOBS")) return "SOCIETY";
  if (t.includes("TECH") || t.includes("SOVEREIGNTY") || t.includes("POLICY") || t.includes("REGULATION")) return "TECH";
  return "TECH";
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

const Badge = ({ category }: { category: Category }) => {
  const m = CATEGORY_META[category];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider ${m.classes}`}>
      {m.label}
    </span>
  );
};

const SkeletonCard = () => (
  <div className="rounded-2xl border border-border bg-card p-6 animate-pulse h-full">
    <div className="h-6 w-20 bg-muted rounded-full mb-4" />
    <div className="h-5 w-5/6 bg-muted rounded mb-2" />
    <div className="h-5 w-3/4 bg-muted rounded mb-4" />
    <div className="h-3 w-full bg-muted rounded mb-1.5" />
    <div className="h-3 w-full bg-muted rounded mb-1.5" />
    <div className="h-3 w-2/3 bg-muted rounded" />
  </div>
);

const Card = ({ item }: { item: NewsItem }) => {
  const cat = getCategory(item);
  const inner = (
    <div className="group rounded-2xl border border-border bg-card p-6 flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-3"><Badge category={cat} /></div>
      <h3
        className="font-heading font-bold text-xl text-foreground mb-2 leading-snug overflow-hidden"
        style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
      >
        {item.title}
      </h3>
      {item.summary && (
        <p
          className="text-sm text-muted-foreground leading-relaxed mb-5 overflow-hidden"
          style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
        >
          {item.summary}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
        <span className="truncate max-w-[60%]">{getDomain(item.source_url)}</span>
        <span>{relativeTime(item.published_at)}</span>
      </div>
    </div>
  );
  if (!item.source_url) return inner;
  return (
    <a
      href={item.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl"
    >
      {inner}
    </a>
  );
};

const AIBriefingsSection = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadFromDb = async () => {
      const picks: NewsItem[] = [];
      for (const cat of CATEGORIES) {
        const { data } = await supabase
          .from("ai_news")
          .select("*")
          .contains("topics", [cat])
          .order("published_at", { ascending: false })
          .limit(2);
        if (data) picks.push(...(data as NewsItem[]));
      }
      // Fallback: if strict category filter returned nothing, classify
      // recent articles by their existing topics so the section is never empty.
      if (picks.length === 0) {
        const { data: recent } = await supabase
          .from("ai_news")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(30);
        if (recent) {
          const buckets: Record<Category, NewsItem[]> = { TECH: [], SECURITY: [], SOCIETY: [] };
          for (const r of recent as NewsItem[]) {
            const c = getCategory(r);
            if (buckets[c].length < 2) buckets[c].push(r);
          }
          picks.push(...buckets.TECH, ...buckets.SECURITY, ...buckets.SOCIETY);
        }
      }
      const { data: newest } = await supabase
        .from("ai_news")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) {
        setItems(picks);
        setLastRefresh((newest as { created_at?: string } | null)?.created_at ?? null);
      }
    };

    (async () => {
      try {
        await supabase.functions.invoke("fetch-ai-news", { body: {} });
      } catch {
        // ignore — fall back to whatever's in DB
      }
      try {
        await loadFromDb();
      } finally {
        if (!cancelled) setLoading(false);
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
          Updated automatically{lastRefresh ? ` · Last refresh: ${relativeTime(lastRefresh)}` : ""}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
            : items.slice(0, 6).map((item, i) => (
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
      </div>
    </section>
  );
};

export default AIBriefingsSection;
