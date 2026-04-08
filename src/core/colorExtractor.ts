export interface ExtractedTheme {
  h: number;
  s: number;
  l: number;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Extract dominant color from an image using Canvas sampling.
 */
export async function extractDominantColor(
  imgElement: HTMLImageElement
): Promise<ExtractedTheme> {
  const canvas = document.createElement("canvas");
  const size = 10;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(imgElement, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  let rTotal = 0, gTotal = 0, bTotal = 0;
  const pixelCount = size * size;
  for (let i = 0; i < data.length; i += 4) {
    rTotal += data[i];
    gTotal += data[i + 1];
    bTotal += data[i + 2];
  }

  const [h, s, l] = rgbToHsl(
    Math.round(rTotal / pixelCount),
    Math.round(gTotal / pixelCount),
    Math.round(bTotal / pixelCount)
  );
  return { h, s, l };
}

/**
 * Apply extracted theme to CSS variables.
 * Both start & end circles use the same primary color;
 * range background uses the primary at low opacity.
 */
export function applyThemeColors(theme: ExtractedTheme) {
  const root = document.documentElement;
  const { h, s, l } = theme;

  const vibrantS = Math.min(s + 15, 80);
  const vibrantL = Math.max(Math.min(l, 55), 40);

  // Primary color — used for both start and end date circles
  root.style.setProperty("--primary", `${h} ${vibrantS}% ${vibrantL}%`);
  root.style.setProperty("--cal-start", `${h} ${vibrantS}% ${vibrantL}%`);
  root.style.setProperty("--cal-end", `${h} ${vibrantS}% ${vibrantL}%`);
  root.style.setProperty("--ring", `${h} ${vibrantS}% ${vibrantL}%`);

  // Range background — same hue at low opacity
  root.style.setProperty("--cal-range-bg", `${h} ${vibrantS}% ${vibrantL}% / 0.12`);

  // Accent — complementary shift
  const compH = (h + 140) % 360;
  root.style.setProperty("--accent", `${compH} ${Math.max(vibrantS - 10, 20)}% ${vibrantL + 15}%`);
}
