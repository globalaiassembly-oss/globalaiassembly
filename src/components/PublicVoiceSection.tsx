import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const PublicVoiceSection = () => (
  <section id="public-voice" className="section-padding bg-hero-dark">
    <div className="container mx-auto max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-6"
      >
        <MessageCircle className="w-7 h-7 text-primary" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-sm font-semibold uppercase tracking-widest text-hero-glow mb-4"
      >
        Your Voice Matters
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground mb-6"
      >
        Public Voice on AI
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-lg text-primary-foreground/70 leading-relaxed mb-8 max-w-2xl mx-auto"
      >
        Answer a short survey to share your perspective on AI development, safety, and governance. Your input directly shapes our civic AI reports and policy recommendations — helping build a more democratic AI future.
      </motion.p>
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        href="#survey"
        className="inline-block bg-primary text-primary-foreground px-8 py-3.5 rounded-lg text-base font-semibold hover:opacity-90 transition-opacity"
      >
        Take the 2-Minute Survey
      </motion.a>
    </div>
  </section>
);

export default PublicVoiceSection;
