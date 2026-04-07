import { motion } from "framer-motion";
import { BookOpen, MessageSquare, FileText } from "lucide-react";

const pillars = [
  {
    icon: BookOpen,
    title: "AI Literacy — Global AI Academy",
    desc: "Short, practical, results-driven AI academies for global citizens. We help revolutionize outdated education systems that are too long, too theoretical, and not adapted to the AI era, future jobs, and fast-changing skills.",
    extra: (
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Regional Education Hubs</p>
        <div className="flex flex-wrap gap-2">
          {["AfricA-I", "EuropA-I", "AsiA-I", "AmericA-I", "AustraliA-I"].map((hub) => (
            <span key={hub} className="text-xs font-medium bg-accent/60 text-accent-foreground px-3 py-1.5 rounded-full">
              {hub}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: MessageSquare,
    title: "Public Consultation",
    desc: "Collect and amplify public opinion on AI through structured, democratic consultation — so the people most affected by AI have a real voice in how it's built and governed.",
    extra: null,
  },
  {
    icon: FileText,
    title: "Citizen-Facing AI Reports",
    desc: "Publish quarterly, transparent, AI-generated reports that translate public input into actionable recommendations for policymakers and leading AI companies worldwide.",
    extra: null,
  },
];

const PillarsSection = () => (
  <section id="pillars" className="section-padding bg-secondary/50">
    <div className="container mx-auto max-w-6xl">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 text-center"
      >
        Our Framework
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-16 text-center"
      >
        The 3 Pillars
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="glass-card p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <p.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Pillar {i + 1}
              </span>
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground mb-3">{p.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            {p.extra}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PillarsSection;
