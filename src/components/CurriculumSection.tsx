import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const CurriculumSection = () => (
  <section id="curriculum" className="section-padding">
    <div className="container mx-auto max-w-4xl text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-sm font-semibold uppercase tracking-widest text-primary mb-4"
      >
        Programs
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6"
      >
        Five Programs. One Mission.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10"
      >
        From a 3-day sprint to a 12-week founder quarter — plus a custom corporate track. Full
        curriculum coming soon. Download our program brochure for early access details.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-5"
      >
        <Button asChild size="lg" className="gap-2">
          <a
            href="/Global-AI-Assembly-Curriculum-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-5 h-5" />
            Download Program Brochure
          </a>
        </Button>

        <a
          href="#training-signup"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Or reserve your spot for the Paris pilot →
        </a>
      </motion.div>
    </div>
  </section>
);

export default CurriculumSection;
