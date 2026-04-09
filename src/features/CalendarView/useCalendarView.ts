import { getCalendarDays, getMonthLabel, nextMonth, prevMonth } from "@/core/dateEngine";
import { useCalendar, useCalendarDispatch } from "@/context/CalendarContext";
import { useCallback, useMemo } from "react";

export interface UseCalendarViewResult {
  days: ReturnType<typeof getCalendarDays>;
  monthLabel: string;
  goNext: () => void;
  goPrev: () => void;
}

/**
 * Memoized month matrix + label, and stable navigators for header arrows.
 */
export function useCalendarView(): UseCalendarViewResult {
  const { currentMonth } = useCalendar();
  const dispatch = useCalendarDispatch();

  const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
  const monthLabel = useMemo(() => getMonthLabel(currentMonth), [currentMonth]);

  const goNext = useCallback(() => {
    dispatch({ type: "SET_MONTH", payload: nextMonth(currentMonth) });
  }, [currentMonth, dispatch]);

  const goPrev = useCallback(() => {
    dispatch({ type: "SET_MONTH", payload: prevMonth(currentMonth) });
  }, [currentMonth, dispatch]);

  return { days, monthLabel, goNext, goPrev };
}
