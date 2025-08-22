import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lyxkrdyronkxpfbkxmmr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eGtyZHlyb25reHBmYmt4bW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDI3NDAsImV4cCI6MjA3MTM3ODc0MH0.S-qCA6fX2YUkxwUF104VrYMbFhl4gLminai9AmxrkCg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);