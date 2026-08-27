/**
 * THE FOURTH KIND — COSMIC STARFIELD ENGINE
 * Subtle, gentle, cinematic space particles
 */

(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  const PARTICLE_COUNT = 55; // Sparse, elegant, uncluttered like the original

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = rect.height || window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    if (particles.length === 0) {
      initParticles();
    }
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * (height * 0.75), // Concentrate in upper cosmic sky
      size: Math.random() * 1.2 + 0.5, // Tiny, subtle pinpricks (0.5px - 1.7px)
      baseAlpha: Math.random() * 0.5 + 0.2, // Subtle transparency
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      speedX: (Math.random() - 0.5) * 0.08,
      speedY: -(Math.random() * 0.12 + 0.04) // Very slow, graceful upward drift
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around smoothly
      if (p.y < -5) {
        p.y = height * 0.75 + 5;
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

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
