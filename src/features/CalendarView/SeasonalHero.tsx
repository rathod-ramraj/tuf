import { useCalendar } from "@/context/CalendarContext";
import { useSeasonalHero } from "@/hooks/useSeasonalHero";
import { getRandomHeroImage } from "@/utils/seasonalHeroUtils";
import { AnimatePresence, motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

export { getRandomHeroImage };

/**
 * Full-height seasonal photo beside the calendar; tints theme from dominant image color.
 */
export function SeasonalHero() {
  const { currentMonth } = useCalendar();
  const { currentHeroPath, shuffle, imageRef, onImageLoad } = useSeasonalHero(currentMonth);

  return (
    <div className="relative h-full min-h-[16rem] w-full flex-1 overflow-hidden bg-muted md:min-h-0">
      <AnimatePresence mode="wait" initial={false}>
        {currentHeroPath ? (
          <motion.img
            key={currentHeroPath}
            ref={imageRef}
            src={currentHeroPath}
            alt="Seasonal landscape hero"
            className="absolute inset-0 h-full w-full object-cover"
            width={800}
            height={1200}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onLoad={onImageLoad}
          />
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-[15] bg-gradient-to-b from-background/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/80" />

      <button
        type="button"
        onClick={shuffle}
        aria-label="Shuffle hero landscape for this month"
        className={cn(
          "absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full",
          "border border-white/25 bg-white/20 text-foreground shadow-md backdrop-blur-md",
          "transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          "dark:border-white/20 dark:bg-white/15 dark:hover:bg-white/25",
        )}
      >
        <Shuffle className="h-4 w-4 opacity-90" aria-hidden />
      </button>
    </div>
  );
}
