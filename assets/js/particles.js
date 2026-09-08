/**
 * THE FOURTH KIND — COSMIC STARFIELD ENGINE
 * Dynamic proportional resizing & elegant cinematic starfield
 */

(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  const PARTICLE_COUNT = 60; // Sparse, elegant, uncluttered like the original

  function createParticle(w, h) {
    const curW = w || width || window.innerWidth;
    const curH = h || height || window.innerHeight;
    return {
      x: Math.random() * curW,
      y: Math.random() * (curH * 0.72), // Distributed across upper cosmic sky
      size: Math.random() * 1.3 + 0.4, // Subtle pinpricks (0.4px - 1.7px)
      baseAlpha: Math.random() * 0.5 + 0.25,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      speedX: (Math.random() - 0.5) * 0.06,
      speedY: -(Math.random() * 0.1 + 0.03) // Gentle upward drift
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(width, height));
    }
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const newWidth = rect.width || window.innerWidth;
    const newHeight = rect.height || window.innerHeight;

    if (width > 0 && height > 0 && particles.length > 0) {
      // Proportionally re-distribute stars across new screen dimensions
      const scaleX = newWidth / width;
      const scaleY = newHeight / height;
      particles.forEach((p) => {
        p.x = p.x * scaleX;
        p.y = p.y * scaleY;
      });
    }

    width = newWidth;
    height = newHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    if (particles.length === 0) {
      initParticles();
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around smoothly across current width/height
      if (p.y < -5) {
        p.y = height * 0.72 + 5;
        p.x = Math.random() * width;
      }
      if (p.x < -5) p.x = width + 5;
      if (p.x > width + 5) p.x = -5;

      p.twinklePhase += p.twinkleSpeed;
      const alpha = Math.max(0.1, Math.min(0.85, p.baseAlpha + Math.sin(p.twinklePhase) * 0.25));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    ctx.restore();
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
