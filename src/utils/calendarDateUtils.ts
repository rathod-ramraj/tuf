import type { CalendarBannerLine } from "@/types/calendar";
import { addDays, format, parse, subDays } from "date-fns";

/**
 * UI-oriented date helpers kept separate from `core/dateEngine` (grid math, holidays).
 */

/**
 * Computes 3D flip direction when changing the visible month.
 *
 * @param fromAnchor - Current month (any day in that month is fine; day-of-month ignored).
 * @param toAnchor - Target month.
 * @returns `1` if moving forward in time, `-1` if backward.
 */
export function monthFlipDirection(fromAnchor: Date, toAnchor: Date): 1 | -1 {
  const from = new Date(fromAnchor.getFullYear(), fromAnchor.getMonth(), 1);
  const to = new Date(toAnchor.getFullYear(), toAnchor.getMonth(), 1);
  return to.getTime() >= from.getTime() ? 1 : -1;
}

/**
 * Parses `yyyy-MM` into the first day of that month (local time).
 *
 * @param monthKey - String from `format(date, "yyyy-MM")`.
 * @param referenceDate - Fallback for `parse` (typically `new Date()`).
 */
export function parseMonthKeyToDate(monthKey: string, referenceDate: Date): Date {
  return parse(`${monthKey}-01`, "yyyy-MM-dd", referenceDate);
}

/**
 * Which date the context banner should describe: focused day wins, then range start, else today.
 *
 * @param focusedDate - Day drill-down from workspace, if any.
 * @param rangeStart - Start of selected range, if any.
 * @param today - Typically `new Date()` from the component render.
 */
export function resolveBannerTargetDate(
  focusedDate: Date | null,
  rangeStart: Date | null,
  today: Date,
): Date {
  if (focusedDate) return focusedDate;
  if (rangeStart) return rangeStart;
  return today;
}

/**
 * Builds reminders + holiday lines for the banner; pure aside from `holidayName` input.
 *
 * @param holidayName - Human-readable holiday or `null`.
 * @param reminderTexts - Reminder copy strings for the target date.
 */
export function buildBannerLines(
  holidayName: string | null,
  reminderTexts: readonly string[],
): CalendarBannerLine[] {
  const lines: CalendarBannerLine[] = [];
  if (holidayName) lines.push({ emoji: "🎉", text: holidayName });
  reminderTexts.forEach((text) => lines.push({ emoji: "⏰", text }));
  return lines;
}

/**
 * Screen-reader string for the current range selection.
 *
 * @param rangeStart - Selection start or `null`.
 * @param rangeEnd - Selection end or `null`.
 * @returns Empty string when nothing to announce.
 */
export function formatSelectionAnnouncement(rangeStart: Date | null, rangeEnd: Date | null): string {
  if (rangeStart && rangeEnd) {
    return `Selected range: ${format(rangeStart, "MMMM d")} to ${format(rangeEnd, "MMMM d, yyyy")}`;
  }
  if (rangeStart) {
    return `Start date selected: ${format(rangeStart, "MMMM d, yyyy")}. Select an end date.`;
  }
  return "";
}

/**
 * Computes the adjacent calendar cell date for keyboard navigation.
 *
 * @param current - Focused day.
 * @param key - Arrow key from the keyboard event.
 * @returns Next date, or `null` if `key` is not a navigation key.
 */
export function getAdjacentCalendarDate(current: Date, key: string): Date | null {
  switch (key) {
    case "ArrowRight":
      return addDays(current, 1);
    case "ArrowLeft":
      return subDays(current, 1);
    case "ArrowDown":
      return addDays(current, 7);
    case "ArrowUp":
      return subDays(current, 7);
    default:
      return null;
  }
}
