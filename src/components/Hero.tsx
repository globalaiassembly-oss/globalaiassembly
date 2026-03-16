import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-dark">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-50" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-hero-dark/50 via-hero-dark/30 to-hero-dark" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-8">
          
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm text-primary font-medium">
            A Democratic Forum for AI Governance
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-primary-foreground leading-tight max-w-5xl mx-auto mb-8">
          
          Global AI Assembly
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-4 italic">
          
          "The world will not be destroyed by those who do evil, but by those who watch them without doing anything."
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-sm text-primary-foreground/50 mb-10">
          
          — Albert Einstein
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <a
            href="https://shaigexp.lemonsqueezy.com/buy/d4c60ad5-b5c2-44e2-8c44-637717e179b9"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded-lg text-base font-semibold hover:opacity-90 transition-opacity">
            
            Get Started
          </a>
          <a

            className="border border-primary-foreground/20 text-primary-foreground px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-primary-foreground/5 transition-colors" href="https://globalaiassembly.lovable.app">
            
            Learn More
          </a>
        </motion.div>
      </div>
    </section>);

};

export default Hero;