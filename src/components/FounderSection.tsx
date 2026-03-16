import { motion } from "framer-motion";
import founderImg from "@/assets/founder.jpg";

const FounderSection = () =>
<section id="founder" className="section-padding bg-background">
    <div className="container mx-auto max-w-4xl text-center">
      <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
      
        Leadership
      </motion.p>
      <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-16">
      
        Founder & CEO
      </motion.h2>

      <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card p-10 max-w-md mx-auto">
      
        <img
        src={founderImg}
        alt="Féliana Citradewi"
        className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-primary/20" />
      
        <h3 className="font-heading font-bold text-xl text-foreground mb-1">
          Féliana Citradewi
        </h3>
        <p className="text-primary font-semibold text-sm mb-3">Founder & CEO</p>
        <p className="text-muted-foreground text-sm">ENA/INSP · Sciences Po · Sorbonne  
MIT · HEC · Oxford
      </p>
      </motion.div>
    </div>
  </section>;


export default FounderSection;