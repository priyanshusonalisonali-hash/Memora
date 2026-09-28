import confetti from 'canvas-confetti';

export function fireBurst(x = 0.5, y = 0.6) {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { x, y },
    colors: ['#FF7144', '#FB7185', '#F59E0B', '#F43F5E', '#FBBF24'],
  });
}

export function fireCannons() {
  const end = Date.now() + 1.2 * 1000;
  const colors = ['#FF7144', '#FB7185', '#F43F5E', '#FDE047', '#A855F7'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export function startContinuousShower(): () => void {
  let active = true;
  const colors = ['#FF7144', '#FB7185', '#FBBF24', '#F43F5E', '#C084FC', '#38BDF8'];

  const interval = setInterval(() => {
    if (!active) return;
    confetti({
      particleCount: 8,
      startVelocity: 25,
      spread: 360,
      ticks: 80,
      origin: {
        x: Math.random(),
        y: Math.random() * 0.4,
      },
      colors,
      disableForReducedMotion: true,
    });
  }, 350);

  return () => {
    active = false;
    clearInterval(interval);
  };
}
