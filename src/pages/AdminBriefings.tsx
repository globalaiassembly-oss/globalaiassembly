import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { Loader2, LogOut, Play, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Briefing = {
  id: string;
  category: string;
  title: string;
  source_name: string | null;
  source_url: string | null;
  published_date: string | null;
  created_at: string | null;
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-sm"
      >
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Admin Login</h1>
        <p className="text-sm text-muted-foreground mb-6">Briefings management</p>
        <label className="block text-xs font-semibold text-foreground mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <label className="block text-xs font-semibold text-foreground mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="text-xs text-destructive mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign in
        </button>
      </form>
    </div>
  );
};

const AdminBriefings = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<unknown>(null);
  const [runError, setRunError] = useState("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadBriefings = async () => {
    setLoadingList(true);
    const { data } = await supabase
      .from("ai_briefings")
      .select("id, category, title, source_name, source_url, published_date, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    setBriefings((data as Briefing[]) || []);
    setLoadingList(false);
  };

  useEffect(() => {
    if (session) loadBriefings();
  }, [session]);

  const handleRun = async () => {
    setRunning(true);
    setRunError("");
    setRunResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-daily-briefings", {
        body: {},
      });
      if (error) throw error;
      setRunResult(data);
      await loadBriefings();
    } catch (err) {
      setRunError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("ai_briefings").delete().eq("id", id);
    if (!error) setBriefings((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <LoginForm />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">Briefings Admin</h1>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-10 space-y-10">
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-heading font-bold text-xl text-foreground mb-2">Run Daily Fetch</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Manually invoke the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">fetch-daily-briefings</code> Edge Function.
          </p>
          <button
            onClick={handleRun}
            disabled={running}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run fetch now
          </button>

          {runError && (
            <pre className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs overflow-auto">
              {runError}
            </pre>
          )}
          {runResult !== null && (
            <pre className="mt-4 p-3 rounded-lg bg-muted text-foreground text-xs overflow-auto">
              {JSON.stringify(runResult, null, 2)}
            </pre>
          )}
        </section>

        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-xl text-foreground">Recent Briefings</h2>
            <button
              onClick={loadBriefings}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Refresh
            </button>
          </div>

          {loadingList ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : briefings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No briefings yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {briefings.map((b) => (
                <div key={b.id} className="py-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-primary">
                        {b.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {b.published_date
                          ? new Date(b.published_date).toLocaleDateString()
                          : b.created_at
                          ? new Date(b.created_at).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground truncate">{b.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {b.source_name}{" "}
                      {b.source_url && (
                        <a
                          href={b.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline ml-1"
                        >
                          open
                        </a>
                      )}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label="Delete briefing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this briefing?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The briefing will be removed permanently.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(b.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminBriefings;
