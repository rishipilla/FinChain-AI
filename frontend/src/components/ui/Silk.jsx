import { useEffect, useRef } from 'react';

const parseHex = (hex) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255,
  ];
};

const colorToRgba = (rgb, alpha = 1) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

export default function Silk({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
  style,
  className,
}) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const colorRgb = useRef(parseHex(color));

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    const time = frameRef.current / 60;
    const rotationRad = (rotation * Math.PI) / 180;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotationRad);
    ctx.translate(-width / 2, -height / 2);

    ctx.fillStyle = colorToRgba(colorRgb.current, 0.08);
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1.6 * Math.max(1, scale);
    ctx.strokeStyle = colorToRgba(colorRgb.current, 0.18);
    ctx.shadowColor = colorToRgba(colorRgb.current, 0.24);
    ctx.shadowBlur = 24 * scale;

    const lineCount = 5;
    for (let line = 0; line < lineCount; line += 1) {
      const phase = time * speed * 0.8 + line * 1.2;
      const amplitude = height * 0.08 * scale * (1 + line * 0.08);
      const yOffset = height * (0.18 + (line / (lineCount - 1)) * 0.64);

      ctx.beginPath();
      for (let x = 0; x <= width; x += 14) {
        const noise = Math.sin(x * 0.013 + phase) * Math.cos(x * 0.008 - phase * 0.7);
        const drift = Math.sin(x * 0.021 + phase * 1.4) * amplitude * 0.5;
        const wave = Math.sin(x * 0.018 - phase * 0.9) * amplitude;
        const px = x;
        const py = yOffset + wave + drift * noiseIntensity;

        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = colorToRgba([255, 255, 255], 0.05);
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';

    if (noiseIntensity > 0) {
      const grainAmount = Math.min(1400, Math.max(400, width * noiseIntensity));
      ctx.fillStyle = colorToRgba([255, 255, 255], 0.02);
      for (let i = 0; i < grainAmount; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const alpha = Math.random() * 0.08 * noiseIntensity;
        ctx.fillStyle = colorToRgba([255, 255, 255], alpha);
        ctx.fillRect(x, y, 1, 1);
      }
    }

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const handleResize = () => resizeCanvas();
    resizeCanvas();
    window.addEventListener('resize', handleResize);

    let animationId;
    const render = () => {
      frameRef.current += 1;
      draw();
      animationId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationId);
    };
  }, [speed, scale, color, noiseIntensity, rotation]);

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
