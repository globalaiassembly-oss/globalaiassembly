import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Landmark,
  Brain,
  GraduationCap,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type NewsItem = {
  id: string | number;
  title: string;
  summary: string | null;
  topics: string[] | null;
  source_url: string | null;
  published_at: string | null;
};

const categories = [
  {
    icon: ShieldAlert,
    label: "AI Safety",
    title: "Safety & Alignment",
    desc: "Tracking the latest developments in AI safety research, alignment breakthroughs, and risk mitigation strategies worldwide.",
  },
  {
    icon: Landmark,
    label: "Sovereignty & Policy",
    title: "Sovereignty & Policy",
    desc: "How nations and international organizations are shaping AI governance, regulation, and digital sovereignty frameworks.",
  },
  {
    icon: Brain,
    label: "AGI / Frontier AI",
    title: "AGI & Frontier AI",
    desc: "Monitoring progress toward artificial general intelligence and the societal implications of frontier AI systems.",
  },
  {
    icon: GraduationCap,
    label: "AI Education & Future of Work",
    title: "Education & Future of Work",
    desc: "How AI is transforming education, labor markets, and the skills needed for tomorrow's economy.",
  },
];

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const matchesCategory = (item: NewsItem, label: string) => {
  if (label === "All") return true;
  const topics = (item.topics || []).map((t) => t.toLowerCase());
  return topics.includes(label.toLowerCase());
};

const AIBriefingsSection = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true); setFetchError(null); console.log("[AIBriefings] Fetching from ai_news..."); console.log("[AIBriefings] Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      try {
        const { data, error } = await supabase
          .from("ai_news")
          .select("id, title, summary, topics, source_url, published_at")
          .order("published_at", { ascending: false })
          .limit(8);
        if (error) throw error;
        console.log("[AIBriefings] Response — data:", data, "error:", error); if (isMounted) setItems((data as NewsItem[]) || []);
      } catch (err) {
        console.error("[AIBriefings] Fetch failed:", err); if (isMounted) { setFetchError(err instanceof Error ? err.message : String(err)); setItems([]); }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = items.filter((it) => matchesCategory(it, activeFilter));
  const showFallback = false;

  return (
    <section id="briefings" className="section-padding bg-background">
      <div className="container mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 text-center"
        >
          Stay Informed
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6 text-center"
        >
          Latest AI Briefings
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10"
        >
          Curated civic AI intelligence across the topics that matter most to global citizens.
        </motion.p>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[{ label: "All", icon: null }, ...categories.map((c) => ({ label: c.label, icon: c.icon }))].map(
            (tab, i) => {
              const Icon = tab.icon as React.ComponentType<{ className?: string }> | null;
              const isActive = activeFilter === tab.label;
              return (
                <motion.button
                  key={tab.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveFilter(tab.label)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-accent"
                  }`}
                >
                  {Icon ? <Icon className="w-4 h-4" /> : null}
                  {tab.label}
                </motion.button>
              );
            }
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card p-6 flex flex-col">
                <Skeleton className="w-11 h-11 rounded-xl mb-4" />
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-5/6 mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {fetchError && (<p className="text-center text-xs text-destructive mb-4 italic">Could not load briefings: {fetchError}</p>)} {/* Fallback: static "Coming soon" cards when table is empty */}
        {showFallback && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-6 flex flex-col hover:shadow-lg hover:shadow-primary/5 transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <cat.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{cat.label}</span>
                <h3 className="font-heading font-semibold text-base text-foreground mb-2">{cat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{cat.desc}</p>
                <span className="text-xs text-muted-foreground/60 mt-4 italic">Coming soon</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Real news cards */}
        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card p-6 flex flex-col hover:shadow-lg hover:shadow-primary/5 transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <Brain className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-base text-foreground mb-2 line-clamp-2">
                  {item.title}
                </h3>
                {item.summary ? (
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-4">
                    {item.summary}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}
                {item.topics && item.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {item.topics.slice(0, 3).map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.published_at)}
                  </span>
                  {item.source_url && (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Source
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground text-sm italic">
                {items.length === 0 ? "No news yet — check back soon." : "No briefings match this filter."}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AIBriefingsSection;
