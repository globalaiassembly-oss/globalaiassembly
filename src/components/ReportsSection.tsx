import { motion } from "framer-motion";
import { ShieldCheck, Briefcase, Leaf } from "lucide-react";

const reports = [
  {
    icon: ShieldCheck,
    title: "AI Safety and Trust",
    regions: "Europe, North America, Asia-Pacific",
    desc: "Citizens are concerned about AI safety, urging greater transparency and clear regulations to protect public trust.",
  },
  {
    icon: Briefcase,
    title: "AI and Job Displacement",
    regions: "Africa, South America, Europe",
    desc: "Public concerns center on AI-driven job loss, with calls for governments to invest in reskilling programs to help workers adapt.",
  },
  {
    icon: Leaf,
    title: "AI for Climate Action",
    regions: "Europe, Asia-Pacific, Africa",
    desc: "In climate-vulnerable regions, there is strong support for using AI to tackle environmental challenges.",
  },
];

const ReportsSection = () => (
  <section id="reports" className="section-padding bg-secondary/50">
    <div className="container mx-auto max-w-6xl">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 text-center"
      >
        Key Findings
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-16 text-center"
      >
        Assembly's Reports
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {reports.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="glass-card p-8 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
              <r.icon className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{r.title}</h3>
            <p className="text-xs font-medium text-primary mb-4">{r.regions}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ReportsSection;
