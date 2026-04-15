import logoIcon from "@/assets/logo-icon.png";

const Footer = () =>
<footer className="bg-hero-dark py-16 px-6">
    <div className="container mx-auto max-w-4xl text-center">
      <img src={logoIcon} alt="" className="w-10 h-10 mx-auto mb-4" />
      <h3 className="font-heading font-bold text-xl text-primary-foreground mb-2">
        Global AI Assembly
      </h3>
      <p className="text-primary-foreground/50 text-sm mb-8">
        We Democratize AI All Around the World
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
        <a
          href="https://calendly.com/globalaiassembly/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          Book a Call
        </a>
        <a
          href="https://globalaiassembly.substack.com/subscribe"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-primary-foreground/20 text-primary-foreground px-8 py-3 rounded-lg text-sm font-semibold hover:bg-primary-foreground/5 transition-colors">
          Subscribe to the Brief
        </a>
      </div>
      <p className="text-primary-foreground/30 text-xs mt-10">
        © {new Date().getFullYear()} Global AI Assembly. All rights reserved.
      </p>
    </div>
  </footer>;


export default Footer;