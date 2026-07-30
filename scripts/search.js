/* ==========================================================
   Happy Bells — Expandable Gift Box Search & Product Filter Engine
   Powers real-time instant search across products, categories,
   and contact information triggered by a floating Gift Box icon button.
   ========================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('global-search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const productCards = document.querySelectorAll('.product-card');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const noResultsEl = document.getElementById('no-search-results');
    const searchCountBadge = document.getElementById('search-count-badge');
    const contactSection = document.getElementById('contact-info-block');

    // Expandable Gift Box Search Elements
    const giftSearchWrapper = document.getElementById('floating-gift-search');
    const giftSearchBtn = document.getElementById('gift-search-trigger');
    const giftSearchPanel = document.getElementById('gift-search-panel');
    const giftSearchCloseBtn = document.getElementById('gift-search-close');

    if (!searchInput) return;

    let currentCategory = 'all';
    let currentSearchQuery = '';

    // Expand / Collapse Gift Box Search Panel
    if (giftSearchBtn && giftSearchPanel) {
      giftSearchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        giftSearchPanel.classList.add('active');
        if (giftSearchWrapper) giftSearchWrapper.classList.add('expanded');
        searchInput.focus();
      });

      if (giftSearchCloseBtn) {
        giftSearchCloseBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          giftSearchPanel.classList.remove('active');
          if (giftSearchWrapper) giftSearchWrapper.classList.remove('expanded');
        });
      }

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (giftSearchWrapper && !giftSearchWrapper.contains(e.target) && giftSearchPanel.classList.contains('active')) {
          giftSearchPanel.classList.remove('active');
          giftSearchWrapper.classList.remove('expanded');
        }
      });
    }

    // Main Filter Function
    function filterProducts() {
      const query = currentSearchQuery.toLowerCase().trim();
      let visibleCount = 0;

      productCards.forEach((card) => {
        const title = card.getAttribute('data-title')?.toLowerCase() || '';
        const category = card.getAttribute('data-category')?.toLowerCase() || '';
        const keywords = card.getAttribute('data-keywords')?.toLowerCase() || '';
        const description = card.textContent.toLowerCase();

        const matchesCategory = (currentCategory === 'all' || category.includes(currentCategory));
        const matchesQuery = !query || title.includes(query) || keywords.includes(query) || description.includes(query);

        if (matchesCategory && matchesQuery) {
          card.style.display = 'flex';
          card.classList.add('search-match');
          visibleCount++;
        } else {
          card.style.display = 'none';
          card.classList.remove('search-match');
        }
      });

      // Handle Contact Info Match when searching contact terms
      if (contactSection) {
        if (query.includes('contact') || query.includes('phone') || query.includes('whatsapp') || query.includes('instagram') || query.includes('number') || query.includes('90253')) {
          contactSection.classList.add('contact-search-highlight');
        } else {
          contactSection.classList.remove('contact-search-highlight');
        }
      }

      // Update count badge & no results view
      if (searchCountBadge) {
        searchCountBadge.textContent = `${visibleCount} Product${visibleCount !== 1 ? 's' : ''}`;
      }

      if (noResultsEl) {
        noResultsEl.style.display = (visibleCount === 0) ? 'block' : 'none';
      }

      // Show clear button when query exists
      if (searchClearBtn) {
        searchClearBtn.style.display = query ? 'flex' : 'none';
      }
    }

    // Input Event Listener
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      filterProducts();
    });

    // Clear Search Input
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchInput.value = '';
        currentSearchQuery = '';
        filterProducts();
        searchInput.focus();
      });
    }

    // Category Tabs Filter
    categoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-filter') || 'all';
        filterProducts();
      });
    });
  });
})();
