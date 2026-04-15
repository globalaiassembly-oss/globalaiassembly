import { motion } from "framer-motion";
import { Newspaper, TrendingUp, Users, Building2 } from "lucide-react";

const highlights = [
  { icon: TrendingUp, text: "Major AI developments & frontier updates" },
  { icon: Users, text: "Public opinion insights from global citizens" },
  { icon: Building2, text: "Recommendations for governments, companies, IOs & NGOs" },
];

const CivicReportSection = () => (
  <section id="newsletter" className="section-padding bg-secondary/50">
    <div className="container mx-auto max-w-5xl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-4"
          >
            Subscribe
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6"
          >
            Bi-Weekly Civic AI Report
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground leading-relaxed mb-8"
          >
            Get a recurring briefing combining the most important AI developments, citizen perspectives, and actionable recommendations — delivered straight to your inbox every two weeks.
          </motion.p>
          <ul className="space-y-4">
            {highlights.map((h, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <h.icon className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="text-sm text-foreground">{h.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">The Civic AI Brief</h3>
              <p className="text-xs text-muted-foreground">Free · Bi-weekly · Open-source</p>
            </div>
          </div>
          <div className="space-y-4">
            <a
              href="https://globalaiassembly.substack.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity text-center"
            >
              Subscribe to the Brief
            </a>
            <p className="text-xs text-muted-foreground text-center">
              Free · No spam · Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CivicReportSection;
