import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Question =
  | { type: "choice"; question: string; options: string[] }
  | { type: "open"; question: string };

const questions: Question[] = [
  {
    type: "choice",
    question: "How concerned are you about the risks of advanced AI (AGI)?",
    options: ["Not concerned", "Slightly concerned", "Moderately concerned", "Very concerned", "Extremely concerned"],
  },
  {
    type: "choice",
    question: "Who should primarily govern the development of AI?",
    options: ["National governments", "International bodies (UN, etc.)", "Independent multi-stakeholder assemblies", "AI companies themselves", "Citizens via democratic processes"],
  },
  {
    type: "choice",
    question: "Should there be a global treaty regulating frontier AI models?",
    options: ["Yes, urgently", "Yes, eventually", "Unsure", "No, slows innovation", "No, not needed"],
  },
  {
    type: "choice",
    question: "How important is AI sovereignty for your country?",
    options: ["Critical", "Very important", "Somewhat important", "Not very important", "Not important"],
  },
  {
    type: "choice",
    question: "Should AI literacy be mandatory in school curricula?",
    options: ["Yes, from primary school", "Yes, from secondary school", "Yes, only at university", "Only as an elective", "No"],
  },
  {
    type: "choice",
    question: "Do you trust AI companies to self-regulate safely?",
    options: ["Fully trust", "Mostly trust", "Neutral", "Mostly distrust", "Fully distrust"],
  },
  {
    type: "choice",
    question: "How should AI-generated content be labeled?",
    options: ["Mandatory clear labels everywhere", "Mandatory only for media/news", "Voluntary labels", "Watermarking only", "No labeling needed"],
  },
  {
    type: "choice",
    question: "What is the highest priority for AI policy today?",
    options: ["Safety & alignment", "Privacy & data rights", "Economic & job impacts", "Equity & access", "Environmental impact"],
  },
  {
    type: "choice",
    question: "Should citizens have a direct vote on major AI deployment decisions?",
    options: ["Yes, always", "Yes, for high-risk systems", "Through elected representatives only", "Through expert panels only", "No"],
  },
  {
    type: "open",
    question: "In your own words: what is the most important thing leaders should know about AI from a citizen's perspective?",
  },
];

const PublicVoiceSection = () => {
  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = questions[step];
  const total = questions.length;
  const isLast = step === total - 1;
  const canNext = answers[step]?.trim().length > 0;

  const setAnswer = (val: string) => {
    const next = [...answers];
    next[step] = val;
    setAnswers(next);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const rows = questions.map((q, i) => ({
        session_id: sessionId,
        question_index: i,
        answer: answers[i],
        is_open: q.type === "open",
      }));
      const { error: insErr } = await supabase.from("survey_responses").insert(rows);
      if (insErr) throw insErr;
      if (email.trim()) {
        await supabase.from("subscribers").insert({ email: email.trim(), active: true });
      }
      setDone(true);
    } catch (e: any) {
      setError(e.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="public-voice" className="section-padding bg-hero-dark">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-6"
          >
            <MessageCircle className="w-7 h-7 text-primary" />
          </motion.div>
          <p className="text-sm font-semibold uppercase tracking-widest text-hero-glow mb-4">Your Voice Matters</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground mb-4">Public Voice on AI</h2>
          <p className="text-base md:text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Share your perspective on AI governance, safety, and the future. Your input shapes our civic AI reports and policy recommendations.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6"
              >
                <CheckCircle2 className="w-9 h-9 text-primary" />
              </motion.div>
              <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-3">Thank you for your voice.</h3>
              <p className="text-primary-foreground/70">
                Your answers will inform our next civic AI report. Together we are building a more democratic AI future.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-hero-glow">
                  Question {step + 1} of {total}
                </span>
                <div className="flex-1 mx-4 h-1 bg-primary/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / total) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-heading font-semibold text-primary-foreground mb-6">
                {current.question}
              </h3>

              {current.type === "choice" ? (
                <div className="space-y-2 mb-6">
                  {current.options.map((opt) => {
                    const selected = answers[step] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setAnswer(opt)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                          selected
                            ? "border-primary bg-primary/15 text-primary-foreground"
                            : "border-primary/20 bg-primary/5 text-primary-foreground/80 hover:bg-primary/10"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={answers[step]}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={5}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 rounded-lg bg-primary/5 border border-primary/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-primary mb-6"
                />
              )}

              {isLast && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-hero-glow mb-2">
                    Email (optional) — get our bi-weekly brief
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-primary/5 border border-primary/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0 || submitting}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground/70 hover:text-primary-foreground disabled:opacity-30"
                >
                  Back
                </button>
                {isLast ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canNext || submitting}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Submit responses
                  </button>
                ) : (
                  <button
                    onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
                    disabled={!canNext}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Next
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PublicVoiceSection;
