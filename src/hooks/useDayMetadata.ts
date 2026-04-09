import { getDayMetadata, type CalendarDay } from "@/core/dateEngine";
import { useMemo } from "react";

export interface DayMetadataView {
  isWeekend: boolean;
  holidayName: string | null;
}

/**
 * Memoized holiday/weekend flags for a single calendar cell.
 *
 * @param day - Grid cell model from `getCalendarDays`.
 */
export function useDayMetadata(day: CalendarDay): DayMetadataView {
  return useMemo(() => {
    const { isWeekend, holidayName } = getDayMetadata(day.date);
    return { isWeekend, holidayName };
  }, [day.date]);
}
