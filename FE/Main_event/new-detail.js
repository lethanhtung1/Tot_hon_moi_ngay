// THAY DÒNG NÀY:
// import { createClient } from '@supabase/supabase-js';

// BẰNG DÒNG NÀY:
import { supabase } from './supabaseClient.js';
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