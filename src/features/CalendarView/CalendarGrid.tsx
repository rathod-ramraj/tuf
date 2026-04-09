import { WEEKDAY_LABELS } from "@/core/dateEngine";
import { useCalendar, useCalendarDispatch } from "@/context/CalendarContext";
import { RangeHighlighter } from "@/features/DateSelection/RangeHighlighter";
import { CalButton } from "@/shared/ui/Button";
import { Label } from "@/shared/ui/Typography";
import { cn } from "@/lib/utils";
import {
  calendarDayGridFlipVariants,
  calendarShellTransition,
  CALENDAR_FLIP_TRANSITION,
} from "@/features/CalendarView/calendarMotionConfig";
import { CalendarContextBanner } from "@/features/CalendarView/CalendarContextBanner";
import { SelectionAnnouncer } from "@/features/CalendarView/SelectionAnnouncer";
import { useCalendarGridKeyboard } from "@/hooks/useCalendarGridKeyboard";
import type { CalendarChromeViewState, CalendarFlipMotionCustom } from "@/types/calendar";
import { monthFlipDirection } from "@/utils/calendarDateUtils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useCalendarView } from "./useCalendarView";
import { useIsMobile } from "./useIsMobile";

const MONTH_LABELS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Main calendar chrome: month header, day grid with flip animation, month picker, a11y announcer.
 */
export function CalendarGrid() {
  const { currentMonth } = useCalendar();
  const dispatch = useCalendarDispatch();
  const { days, monthLabel, goNext, goPrev } = useCalendarView();
  const gridRef = useRef<HTMLDivElement>(null);
  const { handleKeyNav } = useCalendarGridKeyboard(gridRef);

  const [direction, setDirection] = useState(0);
  const [chromeView, setChromeView] = useState<CalendarChromeViewState>({ mode: "days" });

  const isMobile = useIsMobile();
  const monthFlipKey = format(currentMonth, "yyyy-MM");

  const flipMotionCustom = useMemo<CalendarFlipMotionCustom>(
    () => ({ direction, isMobile }),
    [direction, isMobile],
  );

  useEffect(() => {
    setChromeView((v) => (v.mode === "months" ? { ...v, year: currentMonth.getFullYear() } : v));
  }, [currentMonth]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    goPrev();
  }, [goPrev]);

  const handleNext = useCallback(() => {
    setDirection(1);
    goNext();
  }, [goNext]);

  const toggleViewMode = useCallback(() => {
    setChromeView((prev) =>
      prev.mode === "days"
        ? { mode: "months", year: currentMonth.getFullYear() }
        : { mode: "days" },
    );
  }, [currentMonth]);

  const handleSelectMonth = useCallback(
    (monthIndex: number) => {
      if (chromeView.mode !== "months") return;
      const nextMonth = new Date(chromeView.year, monthIndex, 1);
      const curAnchor = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      setDirection(monthFlipDirection(curAnchor, nextMonth));
      dispatch({ type: "SET_MONTH", payload: nextMonth });
      setChromeView({ mode: "days" });
    },
    [chromeView, currentMonth, dispatch],
  );

  const isMonthActive = useCallback(
    (monthIndex: number) =>
      chromeView.mode === "months" &&
      chromeView.year === currentMonth.getFullYear() &&
      monthIndex === currentMonth.getMonth(),
    [chromeView, currentMonth],
  );

  const handleClearHover = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DATE", payload: null });
  }, [dispatch]);

  const pickerYear = chromeView.mode === "months" ? chromeView.year : currentMonth.getFullYear();
  const setPickerYear = useCallback((updater: (y: number) => number) => {
    setChromeView((v) => (v.mode === "months" ? { ...v, year: updater(v.year) } : v));
  }, []);

  return (
    <div className="flex shrink-0 flex-col justify-start gap-3 sm:gap-4">
      <CalendarContextBanner />

      <div className="flex items-center justify-between gap-2">
        <CalButton
          onClick={handlePrev}
          disabled={chromeView.mode === "months"}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </CalButton>
        <button
          type="button"
          id="calendar-month-year-trigger"
          aria-expanded={chromeView.mode === "months"}
          aria-controls="calendar-month-picker"
          aria-haspopup="dialog"
          onClick={toggleViewMode}
          className={cn(
            "font-display text-2xl md:text-3xl text-foreground",
            "flex items-center gap-2 rounded-md px-3 py-1 transition-colors",
            "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
        >
          <span aria-live="polite" aria-atomic="true">
            {monthLabel}
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
              chromeView.mode === "months" && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        <CalButton
          onClick={handleNext}
          disabled={chromeView.mode === "months"}
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </CalButton>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {chromeView.mode === "days" ? (
          <motion.div
            key="calendar-days-shell"
            initial={calendarShellTransition.initial}
            animate={calendarShellTransition.animate}
            exit={calendarShellTransition.exit}
            className="flex flex-col gap-0 overflow-visible"
          >
            <div
              className="mb-2 grid grid-cols-7 gap-0"
              role="row"
              aria-label="Days of the week"
            >
              {WEEKDAY_LABELS.map((d) => (
                <div key={d} role="columnheader" className="flex h-7 items-center justify-center sm:h-8">
                  <Label className="text-xs sm:text-sm">{d}</Label>
                </div>
              ))}
            </div>

            <div
              className="relative min-h-fit w-full overflow-visible"
              style={{ perspective: 1000, perspectiveOrigin: "50% 50%" }}
            >
              <AnimatePresence initial={false} custom={flipMotionCustom}>
                <motion.div
                  key={monthFlipKey}
                  custom={flipMotionCustom}
                  variants={calendarDayGridFlipVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={CALENDAR_FLIP_TRANSITION}
                  ref={gridRef}
                  role="grid"
                  aria-label={`Calendar for ${monthLabel}`}
                  className="grid grid-cols-7 grid-rows-[repeat(6,auto)] place-items-center gap-y-0.5 [transform-style:preserve-3d] will-change-transform"
                  onMouseLeave={handleClearHover}
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
          </motion.div>
        ) : (
          <motion.div
            key="calendar-month-picker"
            id="calendar-month-picker"
            role="group"
            aria-labelledby="calendar-month-year-trigger"
            initial={calendarShellTransition.initial}
            animate={calendarShellTransition.animate}
            exit={calendarShellTransition.exit}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between gap-2">
              <CalButton
                type="button"
                onClick={() => setPickerYear((y) => y - 1)}
                aria-label={`Previous year, ${pickerYear - 1}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </CalButton>
              <p className="font-display text-lg font-semibold tabular-nums text-foreground md:text-xl">
                {pickerYear}
              </p>
              <CalButton
                type="button"
                onClick={() => setPickerYear((y) => y + 1)}
                aria-label={`Next year, ${pickerYear + 1}`}
              >
                <ChevronRight className="h-5 w-5" />
              </CalButton>
            </div>

            <div className="grid min-h-[280px] grid-cols-3 gap-3 md:gap-4">
              {MONTH_LABELS_SHORT.map((label, monthIndex) => {
                const active = isMonthActive(monthIndex);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSelectMonth(monthIndex)}
                    aria-pressed={active}
                    aria-label={`${label} ${pickerYear}`}
                    className={cn(
                      "h-12 rounded-xl border text-sm font-semibold transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "border-transparent bg-muted/30 text-foreground hover:border-border hover:bg-muted",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SelectionAnnouncer />
    </div>
  );
}
