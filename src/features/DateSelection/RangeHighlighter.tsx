import { cn } from "@/lib/utils";
import { isInRange, isRangeStart, isRangeEnd, type CalendarDay } from "@/core/dateEngine";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { loadNotes, loadReminders, reminderCoversDate } from "@/core/storageService";
import { getReminderColor } from "@/features/DateSelection/reminderColors";
import { isDateInNote } from "@/features/MemoNotes/useNotes";
import {
  useCalendar,
  useCalendarDispatch,
  CALENDAR_RANGE_ENDPOINT_CLASS,
} from "@/context/CalendarContext";
import { useDayMetadata } from "@/hooks/useDayMetadata";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { format, isSameDay, min, max } from "date-fns";

const NOTE_INDICATOR_PALETTE = [
  "bg-blue-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-purple-500",
] as const;

function noteIndicatorColorClass(noteId: string): string {
  let hash = 0;
  for (let i = 0; i < noteId.length; i++) {
    hash = (hash << 5) - hash + noteId.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % NOTE_INDICATOR_PALETTE.length;
  return NOTE_INDICATOR_PALETTE[idx];
}

export interface RangeHighlighterProps {
  day: CalendarDay;
  tabIndex: number;
  onKeyNav: (e: React.KeyboardEvent, date: Date) => void;
}

/**
 * One calendar cell: range styling, notes/reminders, tooltips, keyboard.
 */
export function RangeHighlighter({ day, tabIndex, onKeyNav }: RangeHighlighterProps) {
  const { rangeStart, rangeEnd, hoveredDate, focusedDate } = useCalendar();
  const dispatch = useCalendarDispatch();

  const [storageTick, setStorageTick] = useState(0);
  useEffect(() => {
    const bump = () => setStorageTick((v) => v + 1);
    window.addEventListener("cal-notes-changed", bump);
    window.addEventListener("cal-reminders-changed", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("cal-notes-changed", bump);
      window.removeEventListener("cal-reminders-changed", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const intersectingNotes = useMemo(() => {
    void storageTick;
    return loadNotes().filter((note) => isDateInNote(day.date, note));
  }, [day.date, storageTick]);

  const dayReminders = useMemo(() => {
    void storageTick;
    return loadReminders().filter((r) => reminderCoversDate(day.date, r));
  }, [day.date, storageTick]);

  const hasReminders = dayReminders.length > 0;
  const primaryReminder = dayReminders[0];
  const reminderPreset = primaryReminder ? getReminderColor(primaryReminder.id) : null;
  const multipleRemindersOnDay = dayReminders.length > 1;

  const showOverflow = intersectingNotes.length > 3;
  const visibleNotes = showOverflow ? intersectingNotes.slice(0, 2) : intersectingNotes;
  const overflowExtra = showOverflow ? intersectingNotes.length - 2 : 0;

  const visualBounds = useMemo(() => {
    if (!rangeStart) return { vStart: null as Date | null, vEnd: null as Date | null };
    if (rangeEnd) return { vStart: rangeStart, vEnd: rangeEnd };
    if (!hoveredDate) return { vStart: rangeStart, vEnd: null as Date | null };
    return {
      vStart: min([rangeStart, hoveredDate]),
      vEnd: max([rangeStart, hoveredDate]),
    };
  }, [rangeStart, rangeEnd, hoveredDate]);

  const { vStart, vEnd } = visualBounds;
  const isStart = !!(vStart && isRangeStart(day.date, vStart));
  const isEnd = !!(vEnd && isRangeEnd(day.date, vEnd));
  const inRange = !!(
    vStart &&
    vEnd &&
    isInRange(day.date, vStart, vEnd) &&
    !isStart &&
    !isEnd
  );

  const clickStart = !!(rangeStart && isRangeStart(day.date, rangeStart));
  const clickEnd = !!(rangeEnd && isRangeEnd(day.date, rangeEnd));
  const clickInRange = !!(
    rangeStart &&
    rangeEnd &&
    isInRange(day.date, rangeStart, rangeEnd) &&
    !clickStart &&
    !clickEnd
  );

  const isFocused = focusedDate && isSameDay(day.date, focusedDate);

  const { isWeekend, holidayName } = useDayMetadata(day);
  const isHoliday = holidayName !== null;
  const selected = isStart || isEnd || inRange;
  const canAccent = day.isCurrentMonth;

  const handleClick = useCallback(() => {
    if (rangeStart && rangeEnd && (clickStart || clickEnd || clickInRange)) {
      dispatch({ type: "FOCUS_DATE", payload: day.date });
    } else {
      dispatch({ type: "SELECT_DATE", payload: day.date });
    }
  }, [dispatch, day.date, rangeStart, rangeEnd, clickStart, clickEnd, clickInRange]);

  const handleMouseEnter = useCallback(() => {
    if (rangeStart && !rangeEnd) {
      dispatch({ type: "SET_HOVERED_DATE", payload: day.date });
    }
  }, [dispatch, rangeStart, rangeEnd, day.date]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      } else {
        onKeyNav(e, day.date);
      }
    },
    [handleClick, onKeyNav],
  );

  let ariaLabel = day.date.toDateString();
  if (isStart) ariaLabel += ", range start";
  if (isEnd) ariaLabel += ", range end";
  if (inRange) ariaLabel += ", in selected range";
  if (day.isToday) ariaLabel += ", today";
  if (isFocused) ariaLabel += ", currently focused for notes";
  if (intersectingNotes.length > 0) {
    ariaLabel += `, ${intersectingNotes.length} note${intersectingNotes.length === 1 ? "" : "s"}`;
  }
  if (hasReminders) {
    ariaLabel += `, ${dayReminders.length} reminder${dayReminders.length === 1 ? "" : "s"}`;
    if (multipleRemindersOnDay) {
      ariaLabel += ", multiple reminders on this day";
    }
  }
  if (holidayName) {
    ariaLabel += `, ${holidayName}`;
  } else if (isWeekend && canAccent) {
    ariaLabel += `, ${format(day.date, "EEEE")}`;
  }

  const cell = (
    <motion.button
      role="gridcell"
      aria-label={ariaLabel}
      aria-selected={isStart || isEnd || inRange}
      tabIndex={tabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      data-date={day.date.toISOString()}
      whileHover={{ scale: day.isCurrentMonth ? 1.15 : 1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        "relative flex items-center justify-center h-10 w-10 md:h-11 md:w-11 rounded-full text-sm font-body transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        intersectingNotes.length > 0 && "pb-2.5",
        !day.isCurrentMonth && "text-muted-foreground/40",
        day.isCurrentMonth && "cursor-pointer",
        day.isCurrentMonth &&
          !isHoliday &&
          !isWeekend &&
          !hasReminders &&
          "text-foreground",
        (isStart || isEnd) && CALENDAR_RANGE_ENDPOINT_CLASS,
        inRange && "bg-cal-range rounded-none",
        inRange && !isHoliday && !hasReminders && canAccent && "text-foreground",
        inRange && isHoliday && !hasReminders && canAccent && "text-rose-800 dark:text-rose-200",
        inRange && hasReminders && isHoliday && canAccent && reminderPreset && "text-rose-800 dark:text-rose-200",
        inRange && hasReminders && !isHoliday && canAccent && reminderPreset && reminderPreset.textOnRange,
        selected &&
          hasReminders &&
          canAccent &&
          reminderPreset &&
          cn(
            "z-[1] ring-2 ring-offset-background",
            reminderPreset.ringStrong,
            (isStart || isEnd) && "ring-offset-2",
            inRange && cn("ring-offset-[3px]", reminderPreset.insetLight, reminderPreset.insetDark),
          ),
        selected && !hasReminders && isHoliday && canAccent && "ring-2 ring-rose-400 ring-offset-2 ring-offset-background",
        !selected &&
          hasReminders &&
          canAccent &&
          reminderPreset &&
          !isHoliday &&
          !isWeekend &&
          cn(
            "ring-1",
            reminderPreset.ring,
            reminderPreset.text,
            reminderPreset.subtleBg,
            "transition-colors hover:brightness-[0.97] dark:hover:brightness-110",
          ),
        !selected &&
          hasReminders &&
          isHoliday &&
          canAccent &&
          reminderPreset &&
          cn(
            "ring-1",
            reminderPreset.ring,
            "text-rose-600 dark:text-rose-400",
            reminderPreset.subtleBg,
            "transition-colors hover:brightness-[0.97] dark:hover:brightness-110",
          ),
        !selected &&
          hasReminders &&
          !isHoliday &&
          isWeekend &&
          canAccent &&
          reminderPreset &&
          cn(
            "ring-1",
            reminderPreset.ring,
            reminderPreset.text,
            reminderPreset.subtleBg,
            "transition-colors hover:brightness-[0.97] dark:hover:brightness-110",
          ),
        !selected &&
          !hasReminders &&
          isHoliday &&
          canAccent &&
          "ring-1 ring-rose-400 text-rose-600 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100/70 dark:hover:bg-rose-950/45",
        !selected &&
          !hasReminders &&
          !isHoliday &&
          isWeekend &&
          canAccent &&
          "ring-1 ring-slate-200 text-slate-500 bg-slate-50/50 dark:ring-slate-700 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/45",
        !selected &&
          !hasReminders &&
          !isHoliday &&
          !isWeekend &&
          day.isToday &&
          "ring-2 ring-cal-today font-semibold text-foreground",
        !selected && !hasReminders && !isHoliday && !isWeekend && canAccent && "hover:bg-muted",
        isFocused && "z-10 scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background",
      )}
    >
      {multipleRemindersOnDay && (
        <span
          className="pointer-events-none absolute right-1 top-1 z-[2] h-1.5 w-1.5 rounded-full bg-muted-foreground/55 ring-1 ring-background/90 dark:bg-muted-foreground/65"
          aria-hidden
          title="Multiple reminders"
        />
      )}
      {day.dayNumber}
      {intersectingNotes.length > 0 && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 flex w-full flex-col items-center justify-end gap-[2px] pb-1"
          aria-hidden
        >
          {visibleNotes.map((note) => (
            <div
              key={note.id}
              className={cn("h-[3px] w-full rounded-sm", noteIndicatorColorClass(note.id))}
            />
          ))}
          {showOverflow && (
            <span className="text-[9px] font-semibold leading-none tracking-tight text-muted-foreground/90 tabular-nums">
              +{overflowExtra}
            </span>
          )}
        </div>
      )}
    </motion.button>
  );

  if (holidayName || hasReminders) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{cell}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[16rem] space-y-1.5 text-left">
          {holidayName && <p className="font-medium leading-snug">{holidayName}</p>}
          {dayReminders.map((r) => {
            const rc = getReminderColor(r.id);
            return (
              <p key={r.id} className={cn("text-xs font-medium leading-snug", rc.text)}>
                ⏰ {r.text}
              </p>
            );
          })}
        </TooltipContent>
      </Tooltip>
    );
  }

  return cell;
}
