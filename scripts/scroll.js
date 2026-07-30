/* ==========================================================
   Happy Bells — Scroll Engine
   Initializes Lenis smooth inertia scrolling and manages
   IntersectionObserver scroll triggers for reveals and section transitions.
   ========================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll if available
    let lenis;
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing curve
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1.0,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    }

    // 2. Header Glass Shrink / Elevation on Scroll
    const headerInner = document.querySelector('.header-inner');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        headerInner.style.padding = '8px 20px';
        headerInner.style.background = 'rgba(255, 255, 255, 0.78)';
        headerInner.style.boxShadow = '0 10px 30px rgba(62, 44, 65, 0.12)';
      } else {
        headerInner.style.padding = '12px 24px';
        headerInner.style.background = 'rgba(255, 255, 255, 0.6)';
        headerInner.style.boxShadow = 'var(--glass-shadow)';
      }
    });

    // 3. Scroll Reveal IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.15,
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after revealing for optimal performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => revealObserver.observe(el));

    // 4. Sakura Flower Bloom Observer Trigger
    const bloomVisual = document.querySelector('.bloom-visual-wrap');
    if (bloomVisual) {
      const bloomObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bloomVisual.classList.add('in-view');
          }
        });
      }, { threshold: 0.3 });

      bloomObserver.observe(bloomVisual);
    }

    // 5. Scroll-based Photo Tear Clip-Path Progress
    const heroSection = document.querySelector('.hero-section');
    const topTearLayer = document.querySelector('.tear-layer-top');

    if (heroSection && topTearLayer) {
      window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        const heroHeight = heroSection.offsetHeight;

        if (scrollPos <= heroHeight) {
          const progress = Math.min(1, scrollPos / (heroHeight * 0.6));
          // Gradually tear top photo reveal layer as user scrolls hero
          if (progress > 0.05) {
            const cutY = 100 - (progress * 60); // 100% down to 40%
            topTearLayer.style.clipPath = `polygon(0 0, 100% 0, 100% ${cutY}%, 75% ${cutY + 8}%, 50% ${cutY - 4}%, 25% ${cutY + 6}%, 0 ${cutY}%)`;
          } else {
            topTearLayer.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
          }
        }
      });
    }
  });
})();
