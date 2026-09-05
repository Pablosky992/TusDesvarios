import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zqhuqqufvvftkfeoqfqs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxaHVxcXVmdnZmdGtmZW9xZnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDUzNDcsImV4cCI6MjEwNDEyMTM0N30.3xG3KAqZLFf66JeCbka4AXricitIMM-pLA2tKungEuA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
