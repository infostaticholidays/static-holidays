import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://bkxqcaffqqikykskptgp.supabase.co";

const supabaseAnonKey =
  "PASTE_YOUR_ANON_PUBLIC_KEY_HERE";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
