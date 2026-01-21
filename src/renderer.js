const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('start');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let analyser, dataArray, audioCtx;

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
    animate();
  } catch (error) {
    console.error('Erro ao capturar áudio:', error);
    alert('Erro ao capturar áudio: ' + error.message);
  }
};

function animate() {
  requestAnimationFrame(animate);

  analyser.getByteTimeDomainData(dataArray);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
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
}

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
