// Supabase Configuration
// REPLACE these with your actual Supabase project URL and anon key
let url = 'YOUR_SUPABASE_URL';
let key = 'YOUR_SUPABASE_ANON_KEY';

try {
  url = import.meta.env.VITE_SUPABASE_URL || url;
  key = import.meta.env.VITE_SUPABASE_ANON_KEY || key;
} catch (e) {
  // If not running via Vite, import.meta.env is undefined
}

export const SUPABASE_URL = url;
export const SUPABASE_ANON_KEY = key;
