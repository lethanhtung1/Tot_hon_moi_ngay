import { supabase } from './supabaseClient.js';

// 1. Thư viện icon tập trung
const iconLibrary = {
    'gateways': `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 65 L80 65 L75 80 L25 80 Z" fill="#E0F2FE" stroke="#0284C7" stroke-width="2"></path><rect x="35" y="45" width="30" height="20" fill="white" stroke="#0284C7" stroke-width="2"></rect><rect x="40" y="30" width="10" height="15" fill="white" stroke="#0284C7" stroke-width="2"></rect><circle cx="45" cy="20" r="3" fill="#94A3B8"></circle><circle cx="50" cy="15" r="4" fill="#94A3B8"></circle><path d="M10 85 Q 25 95 50 85 T 90 85" fill="none" stroke="#BAE6FD" stroke-width="2"></path></svg>`,
    'ftas': `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="30" fill="white" stroke="#0284C7" stroke-width="2"></circle><path d="M50 20 C 65 20 65 80 50 80 C 35 80 35 20 50 20 Z" fill="none" stroke="#0284C7" stroke-width="2"></path><line x1="20" y1="50" x2="80" y2="50" stroke="#0284C7" stroke-width="2"></line><rect x="45" y="35" width="30" height="20" rx="2" fill="white" stroke="#F59E0B" stroke-width="2"></rect><line x1="50" y1="42" x2="70" y2="42" stroke="#F59E0B" stroke-width="2"></line><line x1="50" y1="48" x2="65" y2="48" stroke="#F59E0B" stroke-width="2"></line><circle cx="30" cy="65" r="8" fill="#E0F2FE" stroke="#0284C7" stroke-width="2"></circle><circle cx="70" cy="65" r="8" fill="#E0F2FE" stroke="#0284C7" stroke-width="2"></circle></svg>`,
    'countries': `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25 40 C 35 30, 45 50, 35 70 C 25 90, 15 50, 25 40 Z" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"></path><path d="M50 20 C 70 10, 80 40, 60 50 C 40 60, 30 30, 50 20 Z" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"></path><path d="M75 50 C 85 40, 95 60, 85 80 C 75 100, 65 60, 75 50 Z" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"></path><circle cx="35" cy="45" r="3" fill="#EF4444"></circle><line x1="35" y1="45" x2="35" y2="30" stroke="#EF4444" stroke-width="2"></line><polygon points="35,30 45,35 35,40" fill="#EF4444"></polygon></svg>`,
    'speed': `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 70 L40 60 L60 40 L80 20" fill="none" stroke="#0284C7" stroke-width="3"></path><circle cx="20" cy="70" r="4" fill="white" stroke="#0284C7" stroke-width="2"></circle><circle cx="40" cy="60" r="4" fill="white" stroke="#0284C7" stroke-width="2"></circle><circle cx="60" cy="40" r="4" fill="white" stroke="#0284C7" stroke-width="2"></circle><circle cx="80" cy="20" r="4" fill="white" stroke="#0284C7" stroke-width="2"></circle><path d="M75 20 L85 20 L80 15 Z" fill="#0284C7"></path><rect x="70" y="10" width="25" height="15" rx="7.5" fill="#0EA5E9"></rect><text x="82.5" y="20.5" fill="white" font-size="8" font-weight="bold" text-anchor="middle" font-family="sans-serif">+40%</text><path d="M20 80 Q 50 90 80 80" fill="none" stroke="#E0F2FE" stroke-width="8" stroke-linecap="round"></path></svg>`
};

async function loadMarketData() {
    try {
        const [marketRes, logisticsRes, metricsRes] = await Promise.all([
            supabase.from('market_overview').select('*'),
            supabase.from('logistics_services').select('*'),
            supabase.from('market_metrics').select('*')
        ]);

        if (marketRes.error) throw marketRes.error;
        if (logisticsRes.error) throw logisticsRes.error;
        if (metricsRes.error) throw metricsRes.error;

        renderMarketOverview(marketRes.data);
        renderLogistics(logisticsRes.data);
        renderMetrics(metricsRes.data);

    } catch (error) {
        console.error('Lỗi khi fetch dữ liệu:', error);
    }
}

function renderMarketOverview(data) {
    const container = document.getElementById('market-grid'); 
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="market-card">
            <h3>${item.category_title}</h3>
            <p>${item.subtitle}</p>
        </div>
    `).join('');
}

function renderLogistics(data) {
    const container = document.getElementById('logistics-container');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="logistics-card">
            <div class="logistics-content">
                <h4 class="logistics-title">${item.title}</h4>
                <p class="logistics-desc">${item.description}</p>
                <span class="logistics-highlight">${item.highlight}</span>
            </div>
        </div>
    `).join('');
}

function renderMetrics(data) {
    const container = document.getElementById('metrics-container');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="metric-item reveal active">
            <div class="metric-icon">
                ${iconLibrary[item.icon_type] || ''}
            </div>
            <div class="metric-value">
                <span class="counter">${item.value}</span>
            </div>
            <div class="metric-label">${item.label}</div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadMarketData);