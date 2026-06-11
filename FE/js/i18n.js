// SILVIET i18n (Internationalization) System
// Supports English (en) and Vietnamese (vi)
// Translations embedded to avoid CORS issues with file:// protocol

const i18n = {
  currentLang: 'en',

  // Embedded translations
  translationsLoaded: {},

  // Fetch translations
  async loadTranslations(lang) {
    if (this.translationsLoaded[lang]) return true;
    const isAdmin = window.location.pathname.includes('/admin/');
    const basePaths = isAdmin
      ? ['../locales', '/locales', './locales']
      : ['./locales', '/locales'];

    for (const base of basePaths) {
      try {
        const response = await fetch(`${base}/${lang}.json`);
        if (!response.ok) continue;
        this.translationsLoaded[lang] = await response.json();
        return true;
      } catch (error) {
        // try next path
      }
    }

    console.error(`Failed to load translations for ${lang} from paths: ${basePaths.join(', ')}`);
    return false;
  },

  // Initialize the language system
  async init() {
    this.currentLang = localStorage.getItem('i18n_lang') || 'en';
    await this.loadTranslations(this.currentLang);
    this.updateLanguageSwitcher();
    this.translatePage();
    // Dispatch event to notify that i18n is initialized and ready
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: this.currentLang } }));
  },

  // Set language and update page
  async setLanguage(lang) {
    const success = await this.loadTranslations(lang);
    if (success) {
      this.currentLang = lang;
      localStorage.setItem('i18n_lang', lang);
      this.updateLanguageSwitcher();
      this.translatePage();

      document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
  },

  // Translate string based on key
  t(key) {
    const keys = key.split('.');
    let translation = this.translationsLoaded[this.currentLang];

    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return translation;
  },

  // Translate entire page
  translatePage() {
    // Standard data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation !== key) {
        // Handle input placeholders and text separately
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    // Handle separate placeholder attribute if exists
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation !== key) {
        el.placeholder = translation;
      }
    });

    // Handle title attributes
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      const translation = this.t(key);
      if (translation !== key) {
        el.title = translation;
      }
    });

    // Auto-translation based on IDs (fallback for untagged elements)
    this.autoFallbackTranslation();
  },

  // Automatically translate elements whose IDs match translation keys
  autoFallbackTranslation() {
    const translatableTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'LI', 'LABEL'];

    document.querySelectorAll('[id]').forEach((el) => {
      if (!translatableTags.includes(el.tagName)) return;
      if (el.hasAttribute('data-i18n')) return;

      const id = el.id;
      const key = id
        .replace(/([a-z])([A-Z])/g, '$1.$2')
        .replace(/[_-]/g, '.')
        .toLowerCase();

      const translation = this.t(key);
      if (translation !== key) {
        el.textContent = translation;
      }
    });
  },

  // Update language switcher UI
  updateLanguageSwitcher() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach((btn) => {
      const lang = btn.getAttribute('data-lang');
      const isActive = lang === this.currentLang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  },

  // Toggle between languages
  toggleLanguage() {
    const newLang = this.currentLang === 'en' ? 'vi' : 'en';
    this.setLanguage(newLang);
  },
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();

  // Add click handlers for language switcher buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (btn) {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      i18n.setLanguage(lang);
    }
  });
});

// Export for global access
window.i18n = i18n;
