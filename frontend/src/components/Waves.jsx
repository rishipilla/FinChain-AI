import { useRef, useEffect } from 'react';

const Waves = ({
  lineColor = '#ffffff',
  backgroundColor = 'rgba(255, 255, 255, 0.2)',
  waveSpeedX = 0.0125,
  waveSpeedY = 0.01,
  waveAmpX = 40,
  waveAmpY = 20,
  friction = 0.9,
  tension = 0.01,
  maxCursorMove = 120,
  xGap = 12,
  yGap = 36,
}) => {
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializePoints();
    };

    const initializePoints = () => {
      pointsRef.current = [];
      for (let y = 0; y < canvas.height; y += yGap) {
        for (let x = 0; x < canvas.width; x += xGap) {
          pointsRef.current.push({
            x,
            y,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    const handleMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const updatePoints = () => {
      const { x: cursorX, y: cursorY } = cursorRef.current;

      pointsRef.current.forEach((point) => {
        const dx = cursorX - point.x;
        const dy = cursorY - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxCursorMove) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / maxCursorMove) * 5;
          point.vx += Math.cos(angle) * force;
          point.vy += Math.sin(angle) * force;
        }

        const restX = point.ox + Math.sin(timeRef.current * waveSpeedX) * waveAmpX;
        const restY = point.oy + Math.cos(timeRef.current * waveSpeedY) * waveAmpY;

        point.vx += (restX - point.x) * tension;
        point.vy += (restY - point.y) * tension;

        point.vx *= friction;
        point.vy *= friction;

        point.x += point.vx;
        point.y += point.vy;
      });

      timeRef.current += 1;
    };

    const draw = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      for (let y = 0; y < canvas.height; y += yGap) {
        for (let x = 0; x < canvas.width; x += xGap) {
          const currentIndex = (y / yGap) * (canvas.width / xGap) + x / xGap;
          const point = pointsRef.current[Math.floor(currentIndex)];

          if (!point) continue;

          if (x + xGap < canvas.width) {
            const nextIndex = currentIndex + 1;
            const nextPoint = pointsRef.current[Math.floor(nextIndex)];
            if (nextPoint) {
              ctx.beginPath();
              ctx.moveTo(point.x, point.y);
              ctx.lineTo(nextPoint.x, nextPoint.y);
              ctx.stroke();
            }
          }

          if (y + yGap < canvas.height) {
            const nextIndex = currentIndex + canvas.width / xGap;
            const nextPoint = pointsRef.current[Math.floor(nextIndex)];
            if (nextPoint) {
              ctx.beginPath();
              ctx.moveTo(point.x, point.y);
              ctx.lineTo(nextPoint.x, nextPoint.y);
              ctx.stroke();
            }
          }
        }
      }
    };

    const animate = () => {
      updatePoints();
      draw();
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    lineColor,
    backgroundColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    friction,
    tension,
    maxCursorMove,
    xGap,
    yGap,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default Waves;
