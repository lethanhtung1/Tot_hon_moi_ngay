// Ví dụ với Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://qvnnhamgdfzsschakkw.supabase.co';
// DÙNG ANON KEY, KHÔNG DÙNG SERVICE ROLE KEY!
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bm5uaGFtZ2RmenNzY2hha2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzA5NjIsImV4cCI6MjA5NjA0Njk2Mn0.83MF7CSVTV60SJCZ7qh21B4c0B7f-P0ueoSx5mUh2B4'; 
const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Supabase client:", supabase); 


// Các hàm khác như loadHomeNews hay addEventListener nằm phía dưới...
document.addEventListener('DOMContentLoaded', function () {
  // Mobile navigation toggle
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarNav = document.querySelector('.navbar-nav');

  if (navbarToggle && navbarNav) {
    navbarToggle.addEventListener('click', function () {
      navbarNav.classList.toggle('active');

      // Toggle aria-expanded for accessibility
      const isExpanded = navbarNav.classList.contains('active');
      navbarToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.navbar')) {
        navbarNav.classList.remove('active');
        navbarToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navbarNav.classList.contains('active')) {
        navbarNav.classList.remove('active');
        navbarToggle.setAttribute('aria-expanded', 'false');
        navbarToggle.focus();
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Close mobile menu after navigation
        if (navbarNav && navbarNav.classList.contains('active')) {
          navbarNav.classList.remove('active');
          navbarToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Active navigation highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav a');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // Form validation and API submission (if contact form exists)
// 1. Khởi tạo Supabase Client (Đặt ở ngoài hàm nếu bạn muốn dùng chung)


const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // --- Validation giữ nguyên như cũ ---
    const requiredFields = contactForm.querySelectorAll('[required]');
    let isValid = true;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });

    const emailField = contactForm.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailField.value)) {
        isValid = false;
        emailField.classList.add('error');
      }
    }

    if (!isValid) {
      showFormMessage('Please fill in all required fields correctly.', 'error');
      return;
    }

    // --- Prepare form data ---
    const fullName = contactForm.querySelector('#fullName').value.trim();
    const nameParts = fullName.split(' ').filter(Boolean);
    
    const formData = {
      first_name: nameParts[0] || 'Unknown',
      last_name: nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'N/A',
      email: contactForm.querySelector('#email').value.trim(),
      phone: contactForm.querySelector('#phone').value.trim(),
      company: contactForm.querySelector('#company').value.trim() || null,
      inquiry_type: contactForm.querySelector('#inquiry').value,
      message: contactForm.querySelector('#message').value.trim()
    };

    // --- Gửi dữ liệu lên Supabase ---
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const { error } = await supabase
        .from('contacts') // Đảm bảo bảng trong Supabase tên là 'contacts'
        .insert([formData]);

      if (error) throw error;

      showFormMessage('Thank you! Your message has been sent.', 'success');
      contactForm.reset();
    } catch (error) {
      console.error('Supabase Error:', error);
      showFormMessage('Unable to send message. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // --- Helper function (Giữ nguyên) ---
  function showFormMessage(message, type) {
    const existingMsg = contactForm.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();

    const msgElement = document.createElement('div');
    msgElement.className = `form-message form-message-${type}`;
    msgElement.textContent = message;
    msgElement.style.cssText = `
      padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; text-align: center; font-weight: 500;
      ${type === 'success' ? 'background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;' : 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'}
    `;
    contactForm.insertBefore(msgElement, contactForm.firstChild);
    setTimeout(() => { msgElement.remove(); }, 5000);
  }
}

  // Intersection Observer for scroll animations  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with reveal class
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });

  // Floating Action Button (FAB) Toggle
  const fabContainer = document.querySelector('.fab-container');
  const fabMainBtn = document.querySelector('.fab-main-btn');

  if (fabContainer && fabMainBtn) {
    fabMainBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      fabContainer.classList.toggle('active');
    });

    // Close FAB when clicking anywhere else
    document.addEventListener('click', function (e) {
      if (!fabContainer.contains(e.target)) {
        fabContainer.classList.remove('active');
      }
    });

    // Close FAB on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        fabContainer.classList.remove('active');
      }
    });
  }

  // Auto-add reveal class to common elements for animation
  const animateSelectors = [
    '.section-header',
    '.feature-card',
    '.industry-card',
    '.news-card',
    '.stat-card',
    '.card-section'
  ];

  animateSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
      }
    });
  });
  // Dynamic News for Home Page
async function loadHomeNews() {
    const newsSection = document.querySelector('#news');
    const newsGrid = document.querySelector('#news .news-grid');
    if (!newsGrid) return;

    // KHÔNG CẦN CẤU HÌNH API_BASE_URL NỮA
    
    // Helper giữ nguyên nhưng có thể đơn giản hóa logic ảnh
    const resolveImageUrl = (url) => {
        if (!url || url === 'assets/images/news_fallback.png') return 'assets/images/news_fallback.png';
        if (url.startsWith('http')) return url;
        // Nếu ảnh lưu trong Storage của Supabase, bạn có thể lấy public URL tại đây
        return url; 
    };

    try {
        // TRUY VẤN DỮ LIỆU TỪ SUPABASE
        const { data: articles, error } = await supabase
            .from('news') // Tên bảng của bạn trong Supabase
            .select('*')
            .eq('featured', true)
            .order('published_at', { ascending: false })
            .limit(12);

        if (error) throw error;

        if (articles && articles.length > 0) {
            const lang = window.i18n ? window.i18n.currentLang : 'en';
            
            // --- Phần logic Carousel giữ nguyên ---
            let container = newsSection.querySelector('.news-carousel-container');
            if (articles.length > 3) {
                if (!container) {
                    container = document.createElement('div');
                    container.className = 'news-carousel-container';
                    newsGrid.parentNode.insertBefore(container, newsGrid);
                    container.appendChild(newsGrid);
                }
                newsGrid.classList.add('carousel');
            } else {
                if (container) {
                    container.parentNode.insertBefore(newsGrid, container);
                    container.remove();
                }
                newsGrid.classList.remove('carousel');
            }

            // --- Render nội dung ---
            newsGrid.innerHTML = articles.map(article => {
                const title = typeof article.title === 'object' ? article.title[lang] : article.title;
                const excerpt = typeof article.excerpt === 'object' ? article.excerpt[lang] : (article.excerpt || '');
                const date = article.published_at ? new Date(article.published_at) : new Date(article.created_at);
                const formattedDate = date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { 
                    month: 'long', year: 'numeric' 
                });
                const imageUrl = resolveImageUrl(article.image_url || article.image);

                return `
                    <article class="card news-card reveal">
                      <div class="news-card-image" style="background-image: url('${imageUrl}'), url('assets/images/news_fallback.png'); background-size: cover; background-position: center;"></div>
                      <div class="news-card-content">
                        <span class="news-card-meta">${formattedDate}</span>
                        <h3 class="news-card-title">${escapeHtml(title)}</h3>
                        <p class="news-card-excerpt">${escapeHtml(excerpt)}</p>
                        <a href="/news/${article.slug}" class="news-card-link">
                          <span data-i18n="news.readMore">${lang === 'vi' ? 'Xem thêm' : 'Read More'}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </a>
                      </div>
                    </article>
                `;
            }).join('');

        // Handle Carousel Navigation
        if (articles.length > 3) {
            // Remove existing nav if any
            const existingNav = newsSection.querySelector('.carousel-nav');
            if (existingNav) existingNav.remove();

            const nav = document.createElement('div');
            nav.className = 'carousel-nav'; // Removed reveal class to avoid visibility issues with dynamic content
            
            // Calculate total pages (assuming 3 per page on desktop)
            const getItemsPerPage = () => {
                if (window.innerWidth <= 768) return 1;
                if (window.innerWidth <= 1024) return 2;
                return 3;
            };
            
            const renderDots = () => {
                const itemsPerPage = getItemsPerPage();
                const pages = Math.ceil(articles.length / itemsPerPage);
                if (pages <= 1) return '';
                
                return `<div class="carousel-dots">` + 
                    Array.from({ length: pages }).map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-page="${i}"></span>`).join('') + 
                    `</div>`;
            };

            nav.innerHTML = `
                <button class="carousel-btn prev" aria-label="Previous">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                ${renderDots()}
                <button class="carousel-btn next" aria-label="Next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            `;
            
            if (container) {
                container.appendChild(nav);
            } else {
                newsGrid.parentNode.appendChild(nav);
            }

            const prevBtn = nav.querySelector('.prev');
            const nextBtn = nav.querySelector('.next');
            
            const updateDots = () => {
                const dots = nav.querySelectorAll('.dot');
                if (!dots.length) return;
                const scrollLeft = newsGrid.scrollLeft;
                const pageWidth = newsGrid.offsetWidth;
                const currentPage = Math.round(scrollLeft / pageWidth);
                dots.forEach((dot, i) => dot.classList.toggle('active', i === currentPage));
            };

            newsGrid.addEventListener('scroll', updateDots);
           // Thay đoạn window.addEventListener('resize', ...) cũ bằng đoạn này:
window.addEventListener('resize', () => {
    // Chỉ cập nhật lại hiển thị, KHÔNG gọi lại loadHomeNews()
    const dotsContainer = nav.querySelector('.carousel-dots');
    if (dotsContainer) {
        dotsContainer.outerHTML = renderDots();
    }
});
            prevBtn.addEventListener('click', () => {
                newsGrid.scrollBy({ left: -newsGrid.offsetWidth, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                newsGrid.scrollBy({ left: newsGrid.offsetWidth, behavior: 'smooth' });
            });

            nav.addEventListener('click', (e) => {
                const dot = e.target.closest('.dot');
                if (dot) {
                    const page = parseInt(dot.dataset.page);
                    newsGrid.scrollTo({ left: page * newsGrid.offsetWidth, behavior: 'smooth' });
                }
            });
        }

        // Re-observe for reveal animations
        document.querySelectorAll('#news .news-card').forEach((el, index) => {
          el.style.animationDelay = `${index * 0.1}s`;
          observer.observe(el);
        });
      } else {
          // If no featured news, show a message or empty grid
          newsGrid.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1;">Stay tuned for our latest updates.</p>';
      }
    } catch (error) {
      console.error('Error loading home news:', error);
    }
  }

  // Helper for HTML escaping in main.js
  function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (document.querySelector('#news .news-grid')) {
    loadHomeNews();
    document.addEventListener('languageChanged', loadHomeNews);
  }

  // Fallback for reveal animations when ScrollReveal helper isn't present.
  // Without this, elements with the `.reveal` class stay at opacity: 0.
  if (!window.initScrollReveal) {
    window.initScrollReveal = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('active');
      });
    };
  }
  // Run once on page load so existing reveal elements become visible.
  window.initScrollReveal();
});
