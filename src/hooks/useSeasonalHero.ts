import { extractDominantColor, applyThemeColors } from "@/core/colorExtractor";
import { parseMonthKeyToDate } from "@/utils/calendarDateUtils";
import { getRandomHeroImage as pickHeroPath } from "@/utils/seasonalHeroUtils";
import { format } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseSeasonalHeroResult {
  currentHeroPath: string;
  shuffle: () => void;
  monthKey: string;
  imageRef: React.RefObject<HTMLImageElement | null>;
  /** Pass to `<img onLoad>` to re-tint CSS variables from the photo. */
  onImageLoad: () => void;
}

/**
 * Local seasonal hero: random image per month, reshuffle on demand, sync hero tint from image.
 *
 * @param currentMonth - Calendar month from context.
 */
export function useSeasonalHero(currentMonth: Date): UseSeasonalHeroResult {
  const imageRef = useRef<HTMLImageElement>(null);
  const monthKey = format(currentMonth, "yyyy-MM");
  const [currentHeroPath, setCurrentHeroPath] = useState(() => pickHeroPath(currentMonth));
  const skipMonthEffectOnce = useRef(true);

  useEffect(() => {
    if (skipMonthEffectOnce.current) {
      skipMonthEffectOnce.current = false;
      return;
    }
    const anchor = parseMonthKeyToDate(monthKey, new Date());
    setCurrentHeroPath(pickHeroPath(anchor));
  }, [monthKey]);

  const onImageLoad = useCallback(() => {
    const img = imageRef.current;
    if (!img?.complete || img.naturalWidth === 0) return;
    extractDominantColor(img)
      .then(applyThemeColors)
      .catch(() => {});
  }, []);

  const shuffle = useCallback(() => {
    setCurrentHeroPath(pickHeroPath(currentMonth));
  }, [currentMonth]);

  return { currentHeroPath, shuffle, monthKey, imageRef, onImageLoad };
}
