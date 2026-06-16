import { supabase } from '../Main_event/supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initContactForm();
    initFabMenu();
    initNewsSystem();
});

// 1. Navigation & UI
function initNavbar() {
    const toggle = document.querySelector('.navbar-toggle');
    const nav = document.querySelector('.navbar-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const expanded = nav.classList.toggle('active');
        toggle.setAttribute('aria-expanded', expanded);
    });

    // Close on click outside or Escape
    document.addEventListener('click', (e) => { if (!e.target.closest('.navbar')) nav.classList.remove('active'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') nav.classList.remove('active'); });
}

// 2. Animations (Scroll & Reveal)
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    
    // Auto-add reveal for common cards
    ['.section-header', '.feature-card', '.industry-card', '.news-card'].forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add('reveal');
            el.style.animationDelay = `${i * 0.1}s`;
            observer.observe(el);
        });
    });
}

// 3. News System (Home & Detail)
async function initNewsSystem() {
    // Trang chủ
    const newsGrid = document.querySelector('.news-grid');
    if (newsGrid) {
        try {
            const { data } = await supabase.from('news_articles').select('*').order('created_at', { ascending: false });
            newsGrid.innerHTML = data.map(art => `
                <article class="card news-card">
                    <img src="${art.image_url || './image/silviet-logo.png'}" alt="${art.title}" class="news-card-image">
                    <span class="news-card-meta">${art.created_at?.split('T')[0]}</span>
                    <h3 class="news-card-title">${art.title}</h3>
                    <p class="news-card-excerpt">${art.content?.substring(0, 80)}...</p>
                    <a href="news-detail.html?slug=${art.slug}" class="news-card-link">Read more →</a>
                </article>
            `).join('');
        } catch (e) { console.error("News Load Error:", e); }
    }

    // Trang chi tiết
    const titleEl = document.querySelector('#article-title');
    const contentEl = document.querySelector('#article-content');
    if (titleEl && contentEl) {
        const slug = new URLSearchParams(window.location.search).get('slug');
        if (slug) {
            const { data } = await supabase.from('news_articles').select('*').eq('slug', slug).single();
            if (data) {
                titleEl.textContent = data.title;
                contentEl.innerHTML = data.content;
            }
        }
    }
}

// 4. Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        try {
            const formData = {
                first_name: form.querySelector('#fullName').value.split(' ')[0],
                email: form.querySelector('#email').value,
                phone: form.querySelector('#phone').value,
                message: form.querySelector('#message').value
            };
            await supabase.from('contacts').insert([formData]);
            alert('Thank you! Message sent.');
            form.reset();
        } catch (e) { alert('Error sending message.'); }
        finally { btn.disabled = false; btn.textContent = 'Send'; }
    });
}

// 5. Floating Action Button
function initFabMenu() {
    const fab = document.querySelector('.fab-container');
    const btn = document.querySelector('.fab-main-btn');
    if (!fab || !btn) return;
    btn.addEventListener('click', (e) => { e.stopPropagation(); fab.classList.toggle('active'); });
    document.addEventListener('click', () => fab.classList.remove('active'));
}