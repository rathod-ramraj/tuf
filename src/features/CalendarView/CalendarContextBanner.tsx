import { useCalendarContextBanner } from "@/hooks/useCalendarContextBanner";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Holiday and reminder strip above the calendar chrome; visibility is data-driven.
 */
export function CalendarContextBanner() {
  const { lines, showBanner, motionKey } = useCalendarContextBanner();

  return (
    <AnimatePresence initial={false}>
      {showBanner && (
        <motion.div
          key={motionKey}
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/90 px-4 py-2.5 text-sm shadow-sm backdrop-blur-sm dark:bg-muted/40"
          >
            <span className="select-none text-lg leading-none" aria-hidden>
              {lines[0]!.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold tracking-tight text-foreground">{lines[0]!.text}</p>
              {lines.length > 1 && (
                <p className="text-xs font-medium tabular-nums text-muted-foreground">
                  +{lines.length - 1} more
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
