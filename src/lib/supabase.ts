import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://bkxqcaffqqikykskptgp.supabase.co";

const supabaseAnonKey =
  "YOUR_ANON_PUBLIC_KEY_HERE";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
