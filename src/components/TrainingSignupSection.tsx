import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Status = "idle" | "loading" | "success" | "duplicate" | "error";

const CITIES = [
  { value: "paris", label: "Paris (June 2026 pilot)" },
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "beijing", label: "Beijing" },
  { value: "jakarta", label: "Jakarta" },
  { value: "bengaluru", label: "Bengaluru" },
];

const INTENTS = [
  { value: "join", label: "Join the training" },
  { value: "sponsor", label: "Sponsor the training" },
  { value: "both", label: "Both — join and sponsor" },
];

const TrainingSignupSection = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [intent, setIntent] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase.from("training_signups").insert({
      full_name: fullName.trim(),
      email: email.trim(),
      city,
      intent,
      message: message.trim() || null,
    });

    if (error) {
      if (error.message.toLowerCase().includes("duplicate")) {
        setStatus("duplicate");
      } else {
        setStatus("error");
      }
      return;
    }

    setStatus("success");
  };

  return (
    <section id="training-signup" className="section-padding">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-4"
          >
            Join The Movement
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4"
          >
            Reserve Your Spot — Next AI Training Cohorts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Three intensive days. Zero to working AI project. Choose your city — or sponsor a future hub.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8"
        >
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-xl mb-2">
                Thank you — we'll be in touch within 48 hours.
              </h3>
              <p className="text-sm text-muted-foreground">
                We've received your registration and will follow up soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={city} onValueChange={setCity} required>
                  <SelectTrigger id="city" className="w-full">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Intent</Label>
                <RadioGroup value={intent} onValueChange={setIntent} required className="space-y-2">
                  {INTENTS.map((opt) => (
                    <div key={opt.value} className="flex items-center gap-3">
                      <RadioGroupItem value={opt.value} id={`intent-${opt.value}`} />
                      <Label htmlFor={`intent-${opt.value}`} className="cursor-pointer font-normal">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message <span className="text-muted-foreground">(optional)</span></Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about yourself, your goals, or your sponsorship interest"
                  rows={4}
                />
              </div>

              {status === "duplicate" && (
                <p className="text-sm text-amber-600">
                  You've already signed up — we'll be in touch soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-destructive">
                  Something went wrong, please try again.
                </p>
              )}

              <Button
                type="submit"
                disabled={status === "loading" || !city || !intent}
                className="w-full"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting…
                  </>
                ) : (
                  "Reserve My Spot"
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TrainingSignupSection;
