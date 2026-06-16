import { supabase } from './supabaseClient.js';

async function fetchProductApplications() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
        console.error("Không tìm thấy slug trong URL");
        return;
    }

    try {
        const { data: apps, error } = await supabase
            .from('product_applications')
            .select('*')
            .eq('slug', slug); 

        if (error) throw error;

        const titleEl = document.getElementById('product-title');
        const descEl = document.getElementById('product-description');
        const imgContainer = document.getElementById('product-image-container');

        if (apps && apps.length > 0) {
            const app = apps[0];
            
            console.log("Dữ liệu sản phẩm:", app);

            // 1. Cập nhật Tiêu đề
            if (titleEl) titleEl.textContent = app.name;
            
            // 2. Cập nhật Ảnh
            const imageUrl = app.img_url || app.image_url; 
            
            if (imgContainer) {
                if (imageUrl) {
                    // Chèn thẻ img vào container
                    imgContainer.innerHTML = `<img src="${imageUrl}" alt="${app.name}" style="max-width: 400px; height: auto; border-radius: 8px; display: block; margin-bottom: 20px;">`;
                } else {
                    imgContainer.innerHTML = `<p style="color: #999;">Chưa có ảnh sản phẩm.</p>`;
                }
            }
            
            // 3. Cập nhật Mô tả
            if (descEl) descEl.innerHTML = `<p>${app.description || 'Không có mô tả.'}</p>`;
            
        } else {
            if (titleEl) titleEl.textContent = "Sản phẩm không tồn tại.";
        }

    } catch (err) {
        console.error("Lỗi khi fetch chi tiết sản phẩm:", err);
    }
}

// Đảm bảo DOM đã tải xong mới chạy
document.addEventListener('DOMContentLoaded', fetchProductApplications);