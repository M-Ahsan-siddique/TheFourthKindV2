/**
 * THE FOURTH KIND — CELESTIAL REVEAL ENGINE
 * Pure Vanilla JS, Zero Dependencies, Hardware Accelerated
 * Staggered Cosmic Blur + Fade + Upward Glide on Scroll
 */

(function () {
  'use strict';

  // Split title text into individual animated characters
  function splitTitleChars(element) {
    if (!element || element.dataset.splitDone) return;
    element.dataset.splitDone = 'true';

    const text = element.textContent.trim();
    element.textContent = '';
    element.classList.add('reveal-text-container');

    const words = text.split(' ');
    let globalCharIndex = 0;

    words.forEach((word, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'reveal-word-wrapper';
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';

      for (let i = 0; i < word.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = 'reveal-char';
        charSpan.textContent = word[i];
        charSpan.style.transitionDelay = `${globalCharIndex * 0.045}s`;
        wordSpan.appendChild(charSpan);
        globalCharIndex++;
      }

      element.appendChild(wordSpan);

      if (wIdx < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'reveal-space';
        spaceSpan.innerHTML = '&nbsp;';
        element.appendChild(spaceSpan);
      }
    });
  }

  // Split quote text into individual animated words
  function splitQuoteWords(element) {
    if (!element || element.dataset.splitDone) return;
    element.dataset.splitDone = 'true';

    const text = element.textContent.trim();
    element.textContent = '';
    element.classList.add('reveal-text-container');

    const words = text.split(/\s+/);
    words.forEach((word, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'reveal-word';
      wordSpan.textContent = word;
      wordSpan.style.transitionDelay = `${0.1 + wIdx * 0.05}s`;
      element.appendChild(wordSpan);

      if (wIdx < words.length - 1) {
        const space = document.createTextNode(' ');
        element.appendChild(space);
      }
    });
  }

  // Initialize and observe elements
  function initCelestialReveals() {
    // 1. Prepare Titles for letter-by-letter reveal
    document.querySelectorAll('.section-title, .shop-title').forEach(splitTitleChars);

    // 2. Prepare Vision Quotes for word-by-word reveal
    document.querySelectorAll('.vision-quote').forEach(splitQuoteWords);

    // 3. Stagger cards
    document.querySelectorAll('.products-grid .product-card, .minimal-coffee-grid .coffee-card-minimal, .shop-container .product-card').forEach((card, idx) => {
      card.classList.add('reveal-card');
      card.style.transitionDelay = `${idx * 0.15}s`;
    });

    document.querySelectorAll('.origins-grid .origin-card').forEach((card, idx) => {
      card.classList.add('reveal-card');
      card.style.transitionDelay = `${idx * 0.15}s`;
    });

    // 4. Mark eyebrows and descriptions
    document.querySelectorAll('.section-eyebrow').forEach((el) => el.classList.add('reveal-eyebrow'));
    document.querySelectorAll('.section-desc, .shop-subtitle').forEach((el) => el.classList.add('reveal-desc'));
    document.querySelectorAll('.vision-sub').forEach((el) => el.classList.add('reveal-sub'));

    // 5. Direct viewport reveal check (supports zoom in/out, resize, reload)
    function triggerAllVisible() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const targets = document.querySelectorAll(
        '.section-header, .shop-header, .our-coffee-header, .vision-container, .products-grid, .minimal-coffee-grid, .origins-grid'
      );
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= vh + 50) {
          el.classList.add('revealed');
        }
      });
    }

    // 6. Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe section headers
    document.querySelectorAll('.section-header, .shop-header, .our-coffee-header').forEach((el) => revealObserver.observe(el));

    // Observe vision containers
    document.querySelectorAll('.vision-container').forEach((el) => revealObserver.observe(el));

    // Observe products grid, minimal grid & origins grid
    document.querySelectorAll('.products-grid, .minimal-coffee-grid, .origins-grid').forEach((el) => revealObserver.observe(el));

    // Run visibility check immediately and on window events
    triggerAllVisible();
    setTimeout(triggerAllVisible, 150);
    setTimeout(triggerAllVisible, 500);

    window.addEventListener('scroll', triggerAllVisible, { passive: true });
    window.addEventListener('resize', triggerAllVisible, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCelestialReveals);
  } else {
    initCelestialReveals();
  }
})();
