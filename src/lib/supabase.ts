import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://bkxqcaffqqikykskptgp.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJreHFjYWZmcXFpa3lrc2twdGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTQwNzEsImV4cCI6MjA5NDc3MDA3MX0.RUi0sMzIaJpNhKqJT09Vl8sN2sflu_HgEUC9nVlbZ64";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
