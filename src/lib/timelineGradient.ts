type RgbTuple = [number, number, number];

const TIMELINE_GRADIENT_STOPS = ["#06B6D4", "#3B82F6", "#A855F7"] as const;

const TIMELINE_LINE_GRADIENT = `linear-gradient(to bottom, transparent, ${TIMELINE_GRADIENT_STOPS.join(
  ", ",
)}, transparent)`;

const hexToRgb = (hex: string): RgbTuple => {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const getTimelineDotColor = (progress: number): string => {
  const clamped = Math.min(1, Math.max(0, progress));
  const segment = clamped * (TIMELINE_GRADIENT_STOPS.length - 1);
  const index = Math.min(
    TIMELINE_GRADIENT_STOPS.length - 2,
    Math.floor(segment),
  );
  const localProgress = segment - index;
  const [r1, g1, b1] = hexToRgb(TIMELINE_GRADIENT_STOPS[index]);
  const [r2, g2, b2] = hexToRgb(TIMELINE_GRADIENT_STOPS[index + 1]);
  const r = Math.round(r1 + (r2 - r1) * localProgress);
  const g = Math.round(g1 + (g2 - g1) * localProgress);
  const b = Math.round(b1 + (b2 - b1) * localProgress);
  return `rgb(${r}, ${g}, ${b})`;
};

const getTimelineProgress = (index: number, totalPosts: number): number =>
  totalPosts > 1 ? index / (totalPosts - 1) : 0;

export { TIMELINE_LINE_GRADIENT, getTimelineDotColor, getTimelineProgress };
