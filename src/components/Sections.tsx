import { motion } from "framer-motion";
import { Shield, Users, Globe, Scale, Leaf } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

const MissionSection = () =>
<section id="mission" className="section-padding bg-background">
    <div className="container mx-auto max-w-4xl text-center">
      <motion.p {...fadeUp} className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
        Mission
      </motion.p>
      <motion.h2 {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
        Our Mission
      </motion.h2>
      <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-muted-foreground leading-relaxed">The mission of the Global AI Assembly is to educate and empower citizens to take an active role in AI and collect public opinion for the AI alignment process, ensuring that its development is driven by values of democracy, safety, and justice and benefit to global citizens.
      </motion.p>
    </div>
  </section>;


const objectives = [
{
  icon: Users,
  title: "Citizen Engagement",
  desc: "Promote public participation in AI safety, alignment, and development, ensuring transparency and accountability."
},
{
  icon: Shield,
  title: "Public Education",
  desc: "Equip citizens to understand AI's risks and potential, enabling informed advocacy for ethical development."
},
{
  icon: Globe,
  title: "Global Collaboration",
  desc: "Collaborate to create a just and inclusive global AI governance framework."
},
{
  icon: Scale,
  title: "Social & Economic Justice",
  desc: "Ensure AI reduces inequalities by guiding its development with fairness, transparency, and equity."
},
{
  icon: Leaf,
  title: "Sustainability",
  desc: "Guide AI development to promote ecological sustainability and address climate change for future generations."
}];


const ObjectivesSection = () =>
<section id="objectives" className="section-padding bg-secondary/50">
    <div className="container mx-auto max-w-6xl">
      <motion.p {...fadeUp} className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 text-center">
        Objectives
      </motion.p>
      <motion.h2 {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-16 text-center">
        Key Objectives
      </motion.h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {objectives.map((obj, i) =>
      <motion.div
        key={obj.title}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        className="glass-card p-8 hover:shadow-lg hover:shadow-primary/5 transition-shadow">
        
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
              <obj.icon className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground mb-3">{obj.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{obj.desc}</p>
          </motion.div>
      )}
      </div>
    </div>
  </section>;


const WhySection = () =>
<section className="section-padding bg-background">
    <div className="container mx-auto max-w-4xl text-center">
      <motion.p {...fadeUp} className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
        Why
      </motion.p>
      <motion.h2 {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
        Why The Global AI Assembly
      </motion.h2>
      <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-muted-foreground leading-relaxed mb-6">
        Right now, AI development is largely driven by a small group of powerful interests — governments, corporations, and technologists.
      </motion.p>
      <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg text-muted-foreground leading-relaxed">
        The <span className="font-semibold text-foreground">Global AI Assembly</span> aims to <span className="text-primary font-semibold">change</span> that by <span className="text-primary font-semibold">giving a voice to the people</span> who will be most affected: citizens from all backgrounds, everywhere in the world.
      </motion.p>
    </div>
  </section>;


const VisionSection = () =>
<section id="vision" className="section-padding bg-hero-dark">
    <div className="container mx-auto max-w-4xl text-center">
      <motion.p {...fadeUp} className="text-sm font-semibold uppercase tracking-widest text-hero-glow mb-4">
        Vision
      </motion.p>
      <motion.h2 {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground mb-6">
        Our Vision for the Future
      </motion.h2>
      <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-primary-foreground/70 leading-relaxed">
        We envision a future where AI is democratically governed, serving all of humanity. Through the Global AI Assembly, we aim to align AI with human rights, sustainability, and social justice. By involving citizens, promoting transparency, and fostering global collaboration, AI can become a positive force — if we take an active role in shaping its governance now.
      </motion.p>
    </div>
  </section>;


export { MissionSection, ObjectivesSection, WhySection, VisionSection };