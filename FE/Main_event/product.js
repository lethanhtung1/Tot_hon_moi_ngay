// products.js
import { supabase } from './supabaseClient.js';

async function fetchAndRenderPortfolio() {
    const grid = document.getElementById('dynamic-portfolio-grid');
    if (!grid) return;

    try {
        // Sử dụng cú pháp select với bảng con (Supabase sẽ tự join dựa trên khóa ngoại)
        // Lưu ý: Tên bảng con 'product_applications' phải khớp với tên trong DB
        const { data: categories, error } = await supabase
            .from('categories')
            .select(`
                id, 
                name, 
                product_applications (
                    id, 
                    name, 
                    slug
                )
            `); 

        if (error) throw error;

        grid.innerHTML = categories.map(cat => `
            <div class="card portfolio-card">
                <div class="portfolio-card-header">
                    <h3 class="portfolio-name">${cat.name}</h3>
                </div>
                
                <!-- Hiển thị danh sách sản phẩm con -->
                <ul class="sub-product-list">
                    ${(cat.product_applications || []).map(app => `
                        <li>
                            <a href="product_detail.html?slug=${app.slug}">
                                &gt; ${app.name}
                            </a>
                        </li>
                    `).join('')}
                </ul>

                <a href="contact.html" class="portfolio-link">
                    <span>Request Quote</span>
                    <span class="chevron">&gt;</span>
                </a>
            </div>
        `).join('');

    } catch (err) {
        console.error("Lỗi khi fetch danh mục:", err);
    }
}

// Chạy khi DOM load xong
document.addEventListener('DOMContentLoaded', fetchAndRenderPortfolio);