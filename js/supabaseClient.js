import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Initialize Supabase client using CDN
// This relies on <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> in the HTML

if (typeof supabase === 'undefined') {
  console.error("Supabase library not loaded. Please include the CDN script.");
}

export const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
