// products.js


// Cấu hình Supabase (Hãy thay bằng key thật của bạn)
const supabaseUrl = 'https://qvnnhamgdfzsschakkw.supabase.co';
// DÙNG ANON KEY, KHÔNG DÙNG SERVICE ROLE KEY!
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bm5uaGFtZ2RmenNzY2hha2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzA5NjIsImV4cCI6MjA5NjA0Njk2Mn0.83MF7CSVTV60SJCZ7qh21B4c0B7f-P0ueoSx5mUh2B4'; 
const supabase = createClient(supabaseUrl, supabaseKey);


// Hàm lấy dữ liệu từ Supabase và render vào giao diện
async function renderPortfolioItems() {
    const subcatLists = document.querySelectorAll('.portfolio-subcats[data-portfolio-key]');
    
    // Hiển thị trạng thái đang tải
    subcatLists.forEach(list => list.innerHTML = '<li>Đang tải...</li>');

    try {
        // Lấy tất cả sản phẩm từ bảng 'products'
        const { data: products, error } = await supabase
            .from('products')
            .select('category, product_name');

        if (error) throw error;

        // Xử lý nhóm dữ liệu theo danh mục
        const portfolioData = products.reduce((acc, p) => {
            if (!acc[p.category]) acc[p.category] = [];
            acc[p.category].push(p.product_name);
            return acc;
        }, {});

        // Render vào các thẻ HTML tương ứng
        subcatLists.forEach(list => {
            const key = list.getAttribute('data-portfolio-key');
            const items = portfolioData[key];

            if (items) {
                list.innerHTML = items.map(item => `<li>${item}</li>`).join('');
            } else {
                list.innerHTML = '<li>Không có sản phẩm</li>';
            }
        });
    } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        subcatLists.forEach(list => list.innerHTML = '<li>Lỗi tải dữ liệu</li>');
    }
}

// Khởi chạy
document.addEventListener('DOMContentLoaded', () => {
    renderPortfolioItems();
});