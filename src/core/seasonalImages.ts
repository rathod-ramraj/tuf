/**
 * Maps each month (0-indexed) to a high-quality Unsplash image URL
 * that reflects the season. Images are served at 1200px width for performance.
 */
const SEASONAL_IMAGES: Record<number, string> = {
  0: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1200&auto=format&fit=crop&q=80", // Jan — snowy forest
  1: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=1200&auto=format&fit=crop&q=80", // Feb — frost & winter light
  2: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1200&auto=format&fit=crop&q=80", // Mar — early spring blossoms
  3: "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=1200&auto=format&fit=crop&q=80", // Apr — cherry blossoms
  4: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=1200&auto=format&fit=crop&q=80", // May — green meadow
  5: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80", // Jun — sunny beach
  6: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop&q=80", // Jul — golden summer
  7: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&auto=format&fit=crop&q=80", // Aug — sunflowers
  8: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80", // Sep — early autumn
  9: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80", // Oct — fall foliage
  10: "https://images.unsplash.com/photo-1510749605878-5d0e0e5a4875?w=1200&auto=format&fit=crop&q=80", // Nov — misty autumn
  11: "https://images.unsplash.com/photo-1482442120256-9c03866de390?w=1200&auto=format&fit=crop&q=80", // Dec — cozy winter
};

export function getSeasonalImage(month: number): string {
  return SEASONAL_IMAGES[month] ?? SEASONAL_IMAGES[0];
}
