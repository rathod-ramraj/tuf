import { useCalendar } from "@/context/CalendarContext";
import { getSeasonalImage } from "@/core/seasonalImages";
import { extractDominantColor, applyThemeColors } from "@/core/colorExtractor";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function SeasonalHero() {
  const { currentMonth } = useCalendar();
  const monthIndex = currentMonth.getMonth();
  const imgSrc = getSeasonalImage(monthIndex);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loadedSrc, setLoadedSrc] = useState("");

  const runExtraction = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.complete || img.naturalWidth === 0) return;
    extractDominantColor(img)
      .then(applyThemeColors)
      .catch(() => {});
  }, []);

  // Re-extract when the source changes and loads
  const handleLoad = useCallback(() => {
    setLoadedSrc(imgSrc);
    runExtraction();
  }, [imgSrc, runExtraction]);

  // Also re-extract if month changes but image was cached (no new load event)
  useEffect(() => {
    if (loadedSrc === imgSrc) {
      runExtraction();
    }
  }, [imgSrc, loadedSrc, runExtraction]);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.img
          key={imgSrc}
          ref={imgRef}
          src={imgSrc}
          alt="Seasonal hero"
          className="absolute inset-0 w-full h-full object-cover"
          crossOrigin="anonymous"
          onLoad={handleLoad}
          width={960}
          height={1080}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/80" />
    </div>
  );
}
