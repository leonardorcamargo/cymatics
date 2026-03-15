/* ── lucide icons ── */
lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });

/* ── animated background canvas ── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], hue = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    const count = Math.min(120, Math.floor((W * H) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .6,
        vy: (Math.random() - .5) * .6,
        r: Math.random() * 2 + .5,
        hue: Math.random() * 360,
      });
    }
  }

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, W, H);

    hue = (hue + .15) % 360;

    /* radial rings */
    for (let i = 0; i < 4; i++) {
      const r = 80 + i * 60 + Math.sin(Date.now() / 2000 + i) * 20;
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${(hue + i * 60) % 360},100%,60%,0.06)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* particles + connections */
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      p.hue = (p.hue + .3) % 360;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,70%,0.7)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `hsla(${p.hue},100%,60%,${(1 - dist / 120) * 0.12})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  draw();
  window.addEventListener('resize', () => { resize(); initParticles(); });
})();
