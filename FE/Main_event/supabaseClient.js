import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://qvnnnhamgdfzsschakkw.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bm5uaGFtZ2RmenNzY2hha2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzA5NjIsImV4cCI6MjA5NjA0Njk2Mn0.83MF7CSVTV60SJCZ7qh21B4c0B7f-P0ueoSx5mUh2B4';

export const supabase = createClient(supabaseUrl, supabaseKey);