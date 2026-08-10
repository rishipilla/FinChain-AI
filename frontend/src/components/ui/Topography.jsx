import { useEffect, useRef } from 'react';

const parseHex = (hex) => {
  const value = hex.replace('#', '');
  const bigint = parseInt(value, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255,
  ];
};

const lerp = (a, b, t) => a + (b - a) * t;
const lerpColor = (a, b, t) => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];
const colorToString = (rgb, alpha = 1) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

export default function Topography({
  lowColor = '#5227FF',
  midColor = '#FF9FFC',
  highColor = '#FFFFFF',
  speed = 0.35,
  morphAmount = 3,
  morphSpeed = 0.05,
  bands = 2,
  thickness = 0.01,
  scale = 1,
  pixelSize = 1,
  glow = 0.5,
  colorMode = 'elevation',
  contrast = 3,
  brightness = 1,
  fillBands = false,
  opacity = 1,
  grain = false,
  grainIntensity = 0.05,
  mouseInteraction = false,
  mouseRadius = 0.3,
  mouseStrength = 0.4,
  style,
  className,
}) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const colors = useRef({
    low: parseHex(lowColor),
    mid: parseHex(midColor),
    high: parseHex(highColor),
  });

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
    const time = frameRef.current * morphSpeed;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.filter = `brightness(${brightness}) contrast(${contrast})`;

    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, colorToString(colors.current.low));
    bgGradient.addColorStop(0.5, colorToString(colors.current.mid));
    bgGradient.addColorStop(1, colorToString(colors.current.high));
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    for (let b = 0; b < bands; b += 1) {
      const bandT = bands === 1 ? 0 : b / (bands - 1);
      const bandY = height * (0.2 + 0.55 * bandT);
      const bandColor = colorMode === 'elevation'
        ? colorToString(lerpColor(colors.current.low, colors.current.high, bandT), 0.9)
        : colorToString(colors.current.mid, 0.9);

      ctx.beginPath();
      const lineWidth = Math.max(1, thickness * 40);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = bandColor;
      ctx.shadowColor = bandColor;
      ctx.shadowBlur = glow * 20;
      ctx.lineCap = 'round';

      const mouseOffsetX = (mouseRef.current.x - 0.5) * width * mouseStrength;
      const mouseOffsetY = (mouseRef.current.y - 0.5) * height * mouseStrength;
      const detail = Math.max(120, width / 2);
      const amplitude = height * 0.05 * scale * (1 + bandT);
      const phase = time * (1 + b * 0.15);

      for (let x = 0; x <= detail; x += 1) {
        const px = (x / detail) * width;
        const wave = Math.sin(px * 0.02 * (1 + bandT * 0.3) + phase * speed) * amplitude;
        const morph = Math.cos(px * 0.01 * morphAmount + phase) * amplitude * 0.3;
        const y = bandY + wave + morph + mouseOffsetY * (1 - bandT) + (px / width - 0.5) * mouseOffsetX * 0.2;

        if (x === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }

      if (fillBands) {
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = colorToString(lerpColor(colors.current.mid, colors.current.high, bandT), 0.15);
        ctx.fill();
      }

      ctx.stroke();
    }

    if (grain) {
      ctx.save();
      ctx.fillStyle = `rgba(255,255,255,${grainIntensity * 0.35})`;
      for (let i = 0; i < 220; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * (pixelSize * 1.5);
        ctx.fillRect(x, y, size, size);
      }
      ctx.restore();
    }

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const handleResize = () => resizeCanvas();
    const handlePointer = (event) => {
      if (!mouseInteraction) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
    };

    resizeCanvas();
    window.addEventListener('resize', handleResize);
    if (mouseInteraction) window.addEventListener('pointermove', handlePointer);

    let animationId;
    const render = () => {
      frameRef.current += 1;
      draw();
      animationId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointer);
      window.cancelAnimationFrame(animationId);
    };
  }, [speed, morphAmount, morphSpeed, bands, thickness, scale, pixelSize, glow, colorMode, contrast, brightness, fillBands, opacity, grain, grainIntensity, mouseInteraction, mouseRadius, mouseStrength]);

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
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
