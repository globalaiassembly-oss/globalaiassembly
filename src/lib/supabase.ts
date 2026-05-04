import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://ftirilaxsvwrgvpdpyqe.supabase.co";
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "sb_publishable_q0kcYmItZRn8hzap1u37hA_i2h9GWA0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
