import { motion } from "framer-motion";
import { ShieldAlert, Landmark, Brain, GraduationCap } from "lucide-react";

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

const AIBriefingsSection = () => (
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
        className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16"
      >
        Curated civic AI intelligence across the topics that matter most to global citizens.
      </motion.p>
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
    </div>
  </section>
);

export default AIBriefingsSection;
