import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
  isSameDay,
  isSameMonth,
  isAfter,
  isBefore,
  isToday,
} from "date-fns";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayNumber: number;
}

export function getCalendarDays(month: Date): CalendarDay[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });

  return eachDayOfInterval({ start, end }).map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, month),
    isToday: isToday(date),
    dayNumber: date.getDate(),
  }));
}

export function getMonthLabel(month: Date): string {
  return format(month, "MMMM yyyy");
}

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function nextMonth(d: Date) {
  return addMonths(d, 1);
}
export function prevMonth(d: Date) {
  return subMonths(d, 1);
}

export function isInRange(
  date: Date,
  start: Date | null,
  end: Date | null
): boolean {
  if (!start || !end) return false;
  return (isAfter(date, start) || isSameDay(date, start)) &&
    (isBefore(date, end) || isSameDay(date, end));
}

export function isRangeStart(date: Date, start: Date | null): boolean {
  return !!start && isSameDay(date, start);
}

export function isRangeEnd(date: Date, end: Date | null): boolean {
  return !!end && isSameDay(date, end);
}

export function dateToKey(start: Date | null, end: Date | null): string {
  if (!start) return "";
  const s = format(start, "yyyy-MM-dd");
  const e = end ? format(end, "yyyy-MM-dd") : s;
  return `${s}_${e}`;
}
