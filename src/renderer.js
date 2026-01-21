const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('start');
const controls = document.getElementById('controls');
const animationTypeSelect = document.getElementById('animationType');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let analyser, dataArray, audioCtx;
let hue = 0;
let rotation = 0;
let animationType = 'psychedelic';
let particles = [];
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let interactiveParticles = [];

// Event listener para troca de animação
animationTypeSelect.addEventListener('change', (e) => {
  animationType = e.target.value;
  if (animationType === 'particles') {
    initParticles();
  } else if (animationType === 'interactive') {
    initInteractiveParticles();
  }
});

// Rastreia posição do mouse
canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Inicializa partículas
function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1
    });
  }
}

// Inicializa partículas interativas
function initInteractiveParticles() {
  interactiveParticles = [];
  for (let i = 0; i < 150; i++) {
    interactiveParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseX: Math.random() * canvas.width,
      baseY: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
      size: Math.random() * 2 + 1,
      mass: Math.random() * 2 + 1,
      friction: 0.95
    });
  }
}

btn.onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        sampleRate: 44100
      },
      video: false
    });

    audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    dataArray = new Uint8Array(analyser.fftSize);
    source.connect(analyser);

    btn.remove();
    controls.style.display = 'block';
    initParticles();
    initInteractiveParticles();
    animate();
  } catch (error) {
    console.error('Erro ao capturar áudio:', error);
    alert('Erro ao capturar áudio: ' + error.message);
  }
};

function animate() {
  requestAnimationFrame(animate);

  analyser.getByteTimeDomainData(dataArray);
  hue = (hue + 1) % 360;

  switch (animationType) {
    case 'psychedelic':
      animatePsychedelic();
      break;
    case 'waveform':
      animateWaveform();
      break;
    case 'circular':
      animateCircular();
      break;
    case 'bars':
      animateBars();
      break;
    case 'particles':
      animateParticles();
      break;
    case 'interactive':
      animateInteractiveParticles();
      break;
  }
}

// Animação Psicodélica (original)
function animatePsychedelic() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  rotation += 0.002;

  const layers = 6;
  for (let layer = 0; layer < layers; layer++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * layer) / layers);

    const layerHue = (hue + layer * 60) % 360;
    ctx.strokeStyle = `hsla(${layerHue}, 100%, 50%, 0.6)`;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = `hsl(${layerHue}, 100%, 50%)`;

    ctx.beginPath();
    for (let i = 0; i < dataArray.length; i++) {
      const angle = (i / dataArray.length) * Math.PI * 2;
      const amplitude = (dataArray[i] - 128) * 2;
      const radius = 150 + amplitude;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = `hsla(${(layerHue + 180) % 360}, 100%, 50%, 0.4)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < dataArray.length; i++) {
      const angle = (i / dataArray.length) * Math.PI * 2;
      const amplitude = (dataArray[i] - 128) * 1.5;
      const radius = 80 - amplitude;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
  ctx.restore();
}

// Animação Onda Linear
function animateWaveform() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.shadowBlur = 15;
  ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
  ctx.beginPath();

  const slice = canvas.width / dataArray.length;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const y = (dataArray[i] / 128.0) * (canvas.height / 2);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += slice;
  }

  ctx.stroke();
  ctx.shadowBlur = 0;
}

// Animação Circular Simples
function animateCircular() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.lineWidth = 3;
  ctx.shadowBlur = 25;
  ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
  ctx.beginPath();

  for (let i = 0; i < dataArray.length; i++) {
    const angle = (i / dataArray.length) * Math.PI * 2;
    const amplitude = (dataArray[i] - 128) * 2.5;
    const radius = 200 + amplitude;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.stroke();
  ctx.restore();
  ctx.shadowBlur = 0;
}

// Animação Barras de Frequência
function animateBars() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / dataArray.length;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = (dataArray[i] / 128.0) * (canvas.height / 2);
    const barHue = (hue + (i / dataArray.length) * 360) % 360;

    ctx.fillStyle = `hsl(${barHue}, 100%, 50%)`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth;
  }
}

// Animação Partículas
function animateParticles() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calcula amplitude média do áudio
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += Math.abs(dataArray[i] - 128);
  }
  const avgAmplitude = sum / dataArray.length;

  particles.forEach((particle, index) => {
    // Atualiza posição
    particle.x += particle.vx * (1 + avgAmplitude / 20);
    particle.y += particle.vy * (1 + avgAmplitude / 20);

    // Bounce nas bordas
    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

    // Mantém dentro da tela
    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
    particle.y = Math.max(0, Math.min(canvas.height, particle.y));

    // Desenha partícula
    const particleHue = (hue + index * 3) % 360;
    ctx.fillStyle = `hsla(${particleHue}, 100%, 50%, 0.8)`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsl(${particleHue}, 100%, 50%)`;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * (1 + avgAmplitude / 50), 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.shadowBlur = 0;
}

// Animação Partículas Interativas
function animateInteractiveParticles() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calcula amplitude média do áudio
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += Math.abs(dataArray[i] - 128);
  }
  const avgAmplitude = sum / dataArray.length;

  interactiveParticles.forEach((particle, index) => {
    // Calcula distância do mouse
    const dx = mouseX - particle.x;
    const dy = mouseY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 200;

    // Força de repulsão/atração baseada no áudio
    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      const angle = Math.atan2(dy, dx);

      // Repulsão quando há som alto
      if (avgAmplitude > 10) {
        particle.vx -= Math.cos(angle) * force * (avgAmplitude / 10);
        particle.vy -= Math.sin(angle) * force * (avgAmplitude / 10);
      } else {
        // Leve atração quando quieto
        particle.vx += Math.cos(angle) * force * 0.5;
        particle.vy += Math.sin(angle) * force * 0.5;
      }
    }

    // Força de retorno à posição base
    const returnForce = 0.05;
    particle.vx += (particle.baseX - particle.x) * returnForce;
    particle.vy += (particle.baseY - particle.y) * returnForce;

    // Aplica fricção
    particle.vx *= particle.friction;
    particle.vy *= particle.friction;

    // Atualiza posição
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Desenha conexões entre partículas próximas
    interactiveParticles.forEach((otherParticle, otherIndex) => {
      if (otherIndex > index) {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const opacity = (1 - dist / 100) * 0.5;
          const lineHue = (hue + index * 2) % 360;
          ctx.strokeStyle = `hsla(${lineHue}, 100%, 50%, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      }
    });

    // Desenha partícula
    const particleHue = (hue + index * 2) % 360;
    const size = particle.size * (1 + avgAmplitude / 30);

    // Glow baseado na proximidade do mouse
    const glowIntensity = distance < maxDistance ? (1 - distance / maxDistance) * 30 : 5;
    ctx.shadowBlur = glowIntensity;
    ctx.shadowColor = `hsl(${particleHue}, 100%, 50%)`;

    ctx.fillStyle = `hsla(${particleHue}, 100%, 50%, 0.9)`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    ctx.fill();

    // Desenha anel externo quando mouse está próximo
    if (distance < maxDistance && avgAmplitude > 5) {
      ctx.strokeStyle = `hsla(${particleHue}, 100%, 50%, ${0.5 * (1 - distance / maxDistance)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size + avgAmplitude / 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  ctx.shadowBlur = 0;
}

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (animationType === 'particles' && particles.length > 0) {
    initParticles();
  }
  if (animationType === 'interactive' && interactiveParticles.length > 0) {
    initInteractiveParticles();
  }
};
