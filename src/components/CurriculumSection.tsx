import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Program = {
  emoji: string;
  name: string;
  duration: string;
  promise: string;
  audience: string;
  outcomes: [string, string, string];
  price: string;
  isCorporate?: boolean;
};

const programs: Program[] = [
  {
    emoji: "⚡",
    name: "AI Sprint",
    duration: "3 Days",
    promise: "Go from AI-curious to AI-capable in one long weekend.",
    audience: "Professionals, students, and career-switchers who want a fast, practical start.",
    outcomes: [
      "Build and deploy your first AI-powered tool",
      "Understand prompting, APIs, and automation basics",
      "Leave with a portfolio project and a clear next step",
    ],
    price: "From $297",
  },
  {
    emoji: "📅",
    name: "AI Week",
    duration: "1 Week",
    promise: "One focused week to build real AI skills you can use on Monday.",
    audience: "Busy professionals who want depth without a long commitment.",
    outcomes: [
      "Ship a working AI product by day 5",
      "Master prompt engineering and no-code AI stacks",
      "Get feedback from expert coaches and peers",
    ],
    price: "From $597",
  },
  {
    emoji: "🚀",
    name: "AI Accelerator",
    duration: "4 Weeks",
    promise: "A month-long deep dive that turns learners into confident AI builders.",
    audience: "Entrepreneurs, freelancers, and team leads ready to integrate AI into their work.",
    outcomes: [
      "Complete two end-to-end AI projects from ideation to launch",
      "Build an AI-enhanced workflow for your specific role or business",
      "Earn the Global AI Assembly Certificate of Completion",
    ],
    price: "From $997",
  },
  {
    emoji: "🎯",
    name: "AI Practitioner",
    duration: "8 Weeks",
    promise: "Eight weeks of structured training to become an AI Practitioner your team trusts.",
    audience: "Mid-career professionals and team leads who want to lead AI adoption at their org.",
    outcomes: [
      "Design and run AI pilots inside your organization",
      "Build a personal AI toolkit and a team playbook",
      "Graduate with a capstone project reviewed by industry mentors",
    ],
    price: "From $1,497",
  },
  {
    emoji: "🏆",
    name: "Founder Quarter",
    duration: "12 Weeks",
    promise: "The flagship 12-week program: go from idea to launched AI venture.",
    audience: "Aspiring founders, intrapreneurs, and senior practitioners ready to build something real.",
    outcomes: [
      "Launch a validated AI product or service by week 12",
      "Access weekly office hours with Global AI Assembly founders",
      "Join our alumni network and investor demo day",
    ],
    price: "From $2,997",
  },
  {
    emoji: "🏢",
    name: "Corporate AI Track",
    duration: "Custom",
    promise: "A fully tailored AI upskilling program designed around your organization’s goals.",
    audience: "Companies, government agencies, and NGOs looking to upskill teams at scale.",
    outcomes: [
      "Custom curriculum mapped to your industry and strategic objectives",
      "Dedicated coaches and live workshops for your team",
      "Measurable ROI framework with pre- and post-assessment",
    ],
    price: "Custom Pricing",
    isCorporate: true,
  },
];

const CurriculumSection = () => (
  <section id="curriculum" className="section-padding">
    <div className="container mx-auto max-w-6xl">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 text-center"
      >
        Programs
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6 text-center"
      >
        Five Programs. One Mission.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 text-lg"
      >
        From a 3-day sprint to a 12-week founder quarter — plus a custom track for organizations.
        Choose your level. Build something real.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program, i) => (
          <motion.div
            key={program.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`glass-card p-8 flex flex-col ${
              program.isCorporate ? "border border-primary/40 relative" : ""
            }`}
          >
            {program.isCorporate && (
              <div className="absolute -top-3 left-8">
                <Badge
                  variant="default"
                  className="bg-primary text-primary-foreground text-xs uppercase tracking-wider"
                >
                  Custom Track
                </Badge>
              </div>
            )}

            <div className="text-5xl mb-5">{program.emoji}</div>

            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-heading font-bold text-xl text-foreground leading-tight">
                {program.name}
              </h3>
              <Badge variant="secondary" className="shrink-0 mt-0.5">
                {program.duration}
              </Badge>
            </div>

            <p className="text-sm italic text-muted-foreground mb-4 leading-relaxed">
              {program.promise}
            </p>

            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">For:</span> {program.audience}
            </p>

            <ul className="space-y-2 mb-6 flex-1">
              {program.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-primary mt-0.5 shrink-0">✓</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>

            <p className="text-lg font-bold text-primary mb-5">{program.price}</p>

            <Button asChild className="w-full">
              <a href="#training-signup">Reserve your spot</a>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CurriculumSection;
