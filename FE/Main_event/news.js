// 1. Khai báo danh mục (đảm bảo biến này tồn tại trước khi dùng)
// 1. Thêm đoạn import này vào ngay đầu file news.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://qvnnnhamgdfzsschakkw.supabase.co/';
// DÙNG ANON KEY, KHÔNG DÙNG SERVICE ROLE KEY!
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bm5uaGFtZ2RmenNzY2hha2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzA5NjIsImV4cCI6MjA5NjA0Njk2Mn0.83MF7CSVTV60SJCZ7qh21B4c0B7f-P0ueoSx5mUh2B4'; 
const supabase = createClient(supabaseUrl, supabaseKey);
const categories = ["All", "Trading", "Logistics", "Industrial"]; 

let allNewsData = []; 
let isDataLoaded = false; 

// 2. Hàm khởi tạo chính
async function init() {
    if (isDataLoaded) return;
    
    // Kiểm tra xem supabase đã được import/khởi tạo chưa
    if (typeof supabase === 'undefined') {
        console.error("Supabase chưa được khởi tạo!");
        return;
    }

    renderFilters();
    await fetchNewsFromSupabase();
}

async function fetchNewsFromSupabase() {
    const grid = document.getElementById('news-grid');
    if (!grid) {
        console.error("Không tìm thấy phần tử có ID 'news-grid'!");
        return; 
    }
    
    try {
        const { data, error } = await supabase
            .from('news_articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allNewsData = data || [];
        isDataLoaded = true;
        renderNews(allNewsData);
    } catch (err) {
        console.error("Lỗi khi tải dữ liệu từ Supabase:", err);
        document.getElementById('news-grid').innerHTML = '<p>Có lỗi xảy ra khi tải dữ liệu.</p>';
    }
}

function renderFilters() {
    const filterContainer = document.getElementById('news-filters');
    if (!filterContainer) return;

    filterContainer.innerHTML = categories.map(cat => 
        `<button class="filter-btn" data-category="${cat}">${cat}</button>`
    ).join('');

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            filterNews(e.target.getAttribute('data-category'));
        });
    });
}

function renderNews(articles) {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    if (!articles || articles.length === 0) {
        grid.innerHTML = '<p>No articles found.</p>';
        return;
    }

    grid.innerHTML = articles.map(art => `
        <div class="card news-card">
            ${art.image_url ? `<img src="${art.image_url}" alt="${art.title}" class="news-thumbnail" style="width:100%; height:200px; object-fit:cover; border-radius: 8px 8px 0 0;">` : ''}
            
            <div class="news-card-content">
                <span class="news-date">${art.created_at ? art.created_at.split('T')[0] : 'N/A'}</span>
                <h3 class="news-title">${art.title}</h3>
                <p class="news-excerpt">${art.content ? art.content.substring(0, 100) : '...'}</p>
                <a href="news-detail.html?slug=${art.slug}" class="read-more">Read More →</a>
            </div>
        </div>
    `).join('');
}
function filterNews(category) {
    if (category === "All") {
        renderNews(allNewsData);
    } else {
        const filtered = allNewsData.filter(art => art.category === category);
        renderNews(filtered);
    }
}

// 3. Kích hoạt chương trình
init();