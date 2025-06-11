import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase credentials
const SUPABASE_URL = "https://jljhoeckswnxzjbzpmex.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsamhvZWNrc3dueHpqYnpwbWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MTMzMDcsImV4cCI6MjA2NTE4OTMwN30.V1A2lGGznTUGrZhE3XLeeREOrYChl--wOPIUHjoxJ_A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);