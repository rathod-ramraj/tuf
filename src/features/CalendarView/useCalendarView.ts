import { useMemo } from "react";
import { getCalendarDays, getMonthLabel, nextMonth, prevMonth } from "@/core/dateEngine";
import { useCalendar, useCalendarDispatch } from "@/context/CalendarContext";

export function useCalendarView() {
  const { currentMonth } = useCalendar();
  const dispatch = useCalendarDispatch();

  const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
  const monthLabel = useMemo(() => getMonthLabel(currentMonth), [currentMonth]);

  const goNext = () => dispatch({ type: "SET_MONTH", payload: nextMonth(currentMonth) });
  const goPrev = () => dispatch({ type: "SET_MONTH", payload: prevMonth(currentMonth) });

  return { days, monthLabel, goNext, goPrev };
}
