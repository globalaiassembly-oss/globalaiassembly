import { motion } from "framer-motion";
import logoIcon from "@/assets/logo-icon.png";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b">
      
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="#" className="flex items-center gap-2">
          <img src={logoIcon} alt="Global AI Assembly" className="w-8 h-8" />
          <span className="font-heading font-bold text-lg text-foreground">
            Global AI Assembly
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {["Mission", "Objectives", "Vision", "Reports", "Founder"].map((item) =>
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            
              {item}
            </a>
          )}
        </div>
        <a

          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity" href="https://calendly.com/globalaiassembly/30min">
          
          Join Our Community
        </a>
      </div>
    </motion.nav>);

};

export default Navbar;