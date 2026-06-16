import { supabase } from '../Main_event/supabaseClient.js';

async function fetchAndRenderServices() {
    const container = document.getElementById('services-container');
    
    try {
        // Thay đổi: Xóa .eq('category', 'logistics') để lấy tất cả
        const { data: services, error } = await supabase
            .from('services')
            .select('*'); 

        if (error) throw error;

        container.innerHTML = '';

        if (!services || services.length === 0) {
            container.innerHTML = '<p>No services found.</p>';
            return;
        }

  services.forEach(service => {
    const serviceCard = document.createElement('div');
    serviceCard.className = 'service-card'; // Class này CSS đã có rồi
    
    // Cấu trúc này khớp với file CSS bạn đã gửi
    serviceCard.innerHTML = `
        <div class="service-card-image">
            <img src="${service.image_url || './image/silviet-logo.png'}" alt="${service.title}">
            <div class="service-card-overlay"></div>
            <div class="service-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            </div>
        </div>
        <div class="service-card-body">
            <h3 class="service-title">${service.title}</h3>
            <p class="service-description">${service.description ? service.description.substring(0, 100) : ''}...</p>
            <a href="service-detail.html?id=${service.id}" class="service-cta">
                Read More 
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </a>
        </div>
    `;
    container.appendChild(serviceCard);
});
    } catch (err) {
        console.error('Lỗi khi fetch toàn bộ dịch vụ:', err);
        container.innerHTML = '<p>Error loading services. Please check console.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchAndRenderServices);