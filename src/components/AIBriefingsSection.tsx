import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Category = "tech" | "security" | "society";

type Briefing = {
  id: string;
  category: Category;
  title: string;
  summary: string | null;
  source_name: string | null;
  source_url: string | null;
  image_url: string | null;
  published_date: string | null;
  created_at: string | null;
};

const CATEGORY_META: Record<Category, { label: string; classes: string }> = {
  tech: {
    label: "TECH",
    classes: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  },
  security: {
    label: "SECURITY",
    classes: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  },
  society: {
    label: "SOCIETY",
    classes: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  },
};

const CATEGORIES: Category[] = ["tech", "security", "society"];

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const CategoryBadge = ({ category }: { category: Category }) => {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider ${meta.classes}`}
    >
      {meta.label}
    </span>
  );
};

const SkeletonCard = () => (
  <div className="rounded-2xl border border-border bg-card p-6 animate-pulse">
    <div className="h-6 w-20 bg-muted rounded-full mb-4" />
    <div className="aspect-video w-full bg-muted rounded-xl mb-4" />
    <div className="h-5 w-5/6 bg-muted rounded mb-2" />
    <div className="h-5 w-3/4 bg-muted rounded mb-4" />
    <div className="h-3 w-full bg-muted rounded mb-1.5" />
    <div className="h-3 w-full bg-muted rounded mb-1.5" />
    <div className="h-3 w-2/3 bg-muted rounded" />
  </div>
);

const PlaceholderCard = ({ category }: { category: Category }) => (
  <div className="rounded-2xl border border-border bg-card p-6 flex flex-col h-full">
    <div className="mb-4">
      <CategoryBadge category={category} />
    </div>
    <h3 className="font-heading font-bold text-xl text-foreground mb-2">
      Briefing coming soon
    </h3>
    <p className="text-sm text-muted-foreground leading-relaxed">
      Curated content will appear here shortly.
    </p>
  </div>
);

const BriefingCard = ({ briefing }: { briefing: Briefing }) => {
  const card = (
    <div className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full">
      {briefing.image_url && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={briefing.image_url}
            alt={briefing.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <CategoryBadge category={briefing.category} />
        </div>
        <h3
          className="font-heading font-bold text-xl text-foreground mb-2 leading-snug overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {briefing.title}
        </h3>
        {briefing.summary && (
          <p
            className="text-sm text-muted-foreground leading-relaxed mb-5 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {briefing.summary}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
          <span className="truncate max-w-[60%]">{briefing.source_name}</span>
          <span>{formatDate(briefing.published_date || briefing.created_at)}</span>
        </div>
      </div>
    </div>
  );

  if (!briefing.source_url) return card;

  return (
    <a
      href={briefing.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl"
    >
      {card}
    </a>
  );
};

const AIBriefingsSection = () => {
  const [byCategory, setByCategory] = useState<Record<Category, Briefing | null>>({
    tech: null,
    security: null,
    society: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          CATEGORIES.map((cat) =>
            supabase
              .from("ai_briefings")
              .select("*")
              .eq("category", cat)
              .order("published_date", { ascending: false })
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle()
          )
        );
        if (cancelled) return;
        const next: Record<Category, Briefing | null> = { tech: null, security: null, society: null };
        CATEGORIES.forEach((cat, i) => {
          const { data, error } = results[i];
          if (!error && data) next[cat] = data as Briefing;
        });
        setByCategory(next);
      } catch {
        // silent fallback to placeholders
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="briefings" className="section-padding bg-background">
      <div className="container mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 text-center">
          Stay Informed
        </p>
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6 text-center">
          Latest AI Briefings
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
          Curated civic AI intelligence — updated continuously.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? CATEGORIES.map((c) => <SkeletonCard key={c} />)
            : CATEGORIES.map((cat, i) => {
                const briefing = byCategory[cat];
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="h-full"
                  >
                    {briefing ? (
                      <BriefingCard briefing={briefing} />
                    ) : (
                      <PlaceholderCard category={cat} />
                    )}
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default AIBriefingsSection;
