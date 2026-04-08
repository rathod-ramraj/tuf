import { WEEKDAY_LABELS } from "@/core/dateEngine";
import { RangeHighlighter } from "@/features/DateSelection/RangeHighlighter";
import { CalButton } from "@/shared/ui/Button";
import { Heading, Label } from "@/shared/ui/Typography";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { addDays, subDays, format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useCalendarView } from "./useCalendarView";
import { useCalendar } from "@/context/CalendarContext";

const gridVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 80 : -80,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" as const },
  }),
};

export function CalendarGrid() {
  const { days, monthLabel, goNext, goPrev } = useCalendarView();
  const gridRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState(0);
  const [monthKey, setMonthKey] = useState(monthLabel);

  const handlePrev = () => {
    setDirection(-1);
    goPrev();
    setMonthKey(monthLabel + "_prev_" + Date.now());
  };

  const handleNext = () => {
    setDirection(1);
    goNext();
    setMonthKey(monthLabel + "_next_" + Date.now());
  };

  const focusDate = useCallback((date: Date) => {
    const el = gridRef.current?.querySelector(
      `[data-date="${date.toISOString()}"]`
    ) as HTMLElement | null;
    el?.focus();
  }, []);

  const handleKeyNav = useCallback(
    (e: React.KeyboardEvent, current: Date) => {
      let next: Date | null = null;
      switch (e.key) {
        case "ArrowRight": next = addDays(current, 1); break;
        case "ArrowLeft": next = subDays(current, 1); break;
        case "ArrowDown": next = addDays(current, 7); break;
        case "ArrowUp": next = subDays(current, 7); break;
        default: return;
      }
      e.preventDefault();
      focusDate(next);
    },
    [focusDate]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <CalButton onClick={handlePrev} aria-label="Previous month">
          <ChevronLeft className="h-5 w-5" />
        </CalButton>
        <Heading aria-live="polite" aria-atomic="true">{monthLabel}</Heading>
        <CalButton onClick={handleNext} aria-label="Next month">
          <ChevronRight className="h-5 w-5" />
        </CalButton>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-0" role="row" aria-label="Days of the week">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} role="columnheader" className="flex items-center justify-center h-8">
            <Label>{d}</Label>
          </div>
        ))}
      </div>

      {/* Animated day grid */}
      <div className="relative overflow-hidden min-h-[280px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={monthKey}
            custom={direction}
            variants={gridVariants}
            initial="enter"
            animate="center"
            exit="exit"
            ref={gridRef}
            role="grid"
            aria-label={`Calendar for ${monthLabel}`}
            className="grid grid-cols-7 gap-y-1 place-items-center"
          >
            {days.map((day, i) => (
              <RangeHighlighter
                key={day.date.toISOString()}
                day={day}
                tabIndex={i === 0 ? 0 : -1}
                onKeyNav={handleKeyNav}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Screen reader live region for selection announcements */}
      <SelectionAnnouncer />
    </div>
  );
}

function SelectionAnnouncer() {
  const { rangeStart, rangeEnd } = useCalendar();

  let announcement = "";
  if (rangeStart && rangeEnd) {
    announcement = `Selected range: ${format(rangeStart, "MMMM d")} to ${format(rangeEnd, "MMMM d, yyyy")}`;
  } else if (rangeStart) {
    announcement = `Start date selected: ${format(rangeStart, "MMMM d, yyyy")}. Select an end date.`;
  }

  return (
    <div className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
      {announcement}
    </div>
  );
}
