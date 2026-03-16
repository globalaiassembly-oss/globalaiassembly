import logoIcon from "@/assets/logo-icon.png";

const Footer = () => (
  <footer className="bg-hero-dark py-16 px-6">
    <div className="container mx-auto max-w-4xl text-center">
      <img src={logoIcon} alt="" className="w-10 h-10 mx-auto mb-4" />
      <h3 className="font-heading font-bold text-xl text-primary-foreground mb-2">
        Global AI Assembly
      </h3>
      <p className="text-primary-foreground/60 text-sm font-medium mb-8 italic">
        We Democratize AI All Around the World
      </p>
      <a
        href="https://shaigexp.lemonsqueezy.com/buy/d4c60ad5-b5c2-44e2-8c44-637717e179b9"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Get Started
      </a>
      <p className="text-primary-foreground/30 text-xs mt-10">
        © {new Date().getFullYear()} Global AI Assembly. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
