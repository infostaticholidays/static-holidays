import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://bkxqcaffqqikykskptgp.supabase.co";

const supabaseAnonKey =
  "PASTE_YOUR_ANON_KEY_HERE";

console.log("URL:", supabaseUrl);
console.log("KEY START:", supabaseAnonKey.substring(0, 20));

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
