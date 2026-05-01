import { useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, TrendingUp, Users, Building2, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const highlights = [
  { icon: TrendingUp, text: "Major AI developments & frontier updates" },
  { icon: Users, text: "Public opinion insights from global citizens" },
  { icon: Building2, text: "Recommendations for governments, companies, IOs & NGOs" },
];

const CivicReportSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    const { error } = await supabase.from("subscribers").insert({ email: email.trim(), active: true });
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <section id="newsletter" className="section-padding bg-secondary/50">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
              Subscribe
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Bi-Weekly Civic AI Report
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-muted-foreground leading-relaxed mb-8">
              Get a recurring briefing combining the most important AI developments, citizen perspectives, and actionable recommendations — delivered straight to your inbox every two weeks.
            </motion.p>
            <ul className="space-y-4">
              {highlights.map((h, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 + i * 0.1 }} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <h.icon className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <span className="text-sm text-foreground">{h.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">The Civic AI Brief</h3>
                <p className="text-xs text-muted-foreground">Free · Bi-weekly · Open-source</p>
              </div>
            </div>

            {status === "success" ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <p className="font-heading font-semibold text-foreground mb-1">You're subscribed.</p>
                <p className="text-xs text-muted-foreground">Look out for the next Civic AI Brief in your inbox.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  maxLength={255}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                  Subscribe to the Brief
                </button>
                {status === "error" && <p className="text-xs text-destructive">{errorMsg}</p>}
                <p className="text-xs text-muted-foreground text-center">Free · No spam · Unsubscribe anytime.</p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CivicReportSection;
