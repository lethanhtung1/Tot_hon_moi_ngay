import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

        const supabaseUrl = 'https://qvnnnhamgdfzsschakkw.supabase.co/';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bm5uaGFtZ2RmenNzY2hha2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzA5NjIsImV4cCI6MjA5NjA0Njk2Mn0.83MF7CSVTV60SJCZ7qh21B4c0B7f-P0ueoSx5mUh2B4'; 
        const supabase = createClient(supabaseUrl, supabaseKey);

        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');

       async function loadData() {
        if (!slug) return;
        const { data } = await supabase
            .from('news_articles')
            .select('title, content, image_url')
            .eq('slug', slug)
            .single();

        if (data) {
            document.getElementById('article-title').innerText = data.title;
            document.getElementById('article-content').innerHTML = data.content;
            
            const img = document.getElementById('article-image');
            if (data.image_url) {
                img.src = data.image_url;
                img.style.display = 'block'; 
                // Nếu link ảnh bị lỗi, tự động ẩn khung ảnh
                img.onerror = function() { this.style.display = 'none'; };
            }
        }
    }
    loadData();