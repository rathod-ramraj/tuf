import { getDayMetadata } from "@/core/dateEngine";
import { loadReminders, reminderCoversDate } from "@/core/storageService";
import { useCalendar } from "@/context/CalendarContext";
import type { CalendarBannerLine } from "@/types/calendar";
import { buildBannerLines, resolveBannerTargetDate } from "@/utils/calendarDateUtils";
import { format, parse } from "date-fns";
import { useEffect, useMemo, useState } from "react";

export interface UseCalendarContextBannerResult {
  lines: CalendarBannerLine[];
  showBanner: boolean;
  /** Stable key for `AnimatePresence` / layout animations. */
  motionKey: string;
}

/**
 * Derives holiday + reminder summary rows for the strip above the calendar header.
 *
 * @returns Memoized banner payload and visibility flag.
 */
export function useCalendarContextBanner(): UseCalendarContextBannerResult {
  const { focusedDate, rangeStart } = useCalendar();
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const today = useMemo(() => parse(todayStr, "yyyy-MM-dd", new Date()), [todayStr]);

  const targetDate = useMemo(
    () => resolveBannerTargetDate(focusedDate, rangeStart, today),
    [focusedDate, rangeStart, today],
  );

  const [reminderTick, setReminderTick] = useState(0);

  useEffect(() => {
    const bump = () => setReminderTick((t) => t + 1);
    window.addEventListener("cal-reminders-changed", bump);
    return () => window.removeEventListener("cal-reminders-changed", bump);
  }, []);

  const holidayName = useMemo(() => getDayMetadata(targetDate).holidayName, [targetDate]);

  const dayReminders = useMemo(() => {
    void reminderTick;
    return loadReminders().filter((r) => reminderCoversDate(targetDate, r));
  }, [targetDate, reminderTick]);

  const lines = useMemo(
    () => buildBannerLines(holidayName, dayReminders.map((r) => r.text)),
    [holidayName, dayReminders],
  );

  const motionKey = useMemo(
    () => `banner-${format(targetDate, "yyyy-MM-dd")}-${lines.map((b) => b.text).join("|")}`,
    [targetDate, lines],
  );

  return {
    lines,
    showBanner: lines.length > 0,
    motionKey,
  };
}
