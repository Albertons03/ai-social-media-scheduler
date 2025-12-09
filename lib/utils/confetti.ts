import confetti from "canvas-confetti";

export function triggerConfetti(platform?: "tiktok" | "linkedin" | "twitter") {
  const colors = platform
    ? getPlatformColors(platform)
    : ["#6366f1", "#8b5cf6", "#ec4899"];

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

function getPlatformColors(platform: "tiktok" | "linkedin" | "twitter") {
  switch (platform) {
    case "tiktok":
      return ["#FE2C55", "#25F4EE", "#000000"];
    case "linkedin":
      return ["#0077B5", "#0A66C2", "#004182"];
    case "twitter":
      return ["#000000", "#1DA1F2", "#14171A"];
    default:
      return ["#6366f1", "#8b5cf6", "#ec4899"];
  }
}
