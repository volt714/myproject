import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cjnvnurdnghioijajpkw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbnZudXJkbmdoaW9pamFqcGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MjAxMTcsImV4cCI6MjA2NjQ5NjExN30.Tj_bbIxU6x5HSfH2LxdtnkufVr442ND3C3qiEn821Ao';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
