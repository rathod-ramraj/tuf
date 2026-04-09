import { getAdjacentCalendarDate } from "@/utils/calendarDateUtils";
import { useCallback, type RefObject } from "react";

export interface UseCalendarGridKeyboardResult {
  focusDate: (date: Date) => void;
  handleKeyNav: (e: React.KeyboardEvent, current: Date) => void;
}

/**
 * Focus management and arrow-key traversal for the 7×6 date grid.
 *
 * @param gridRef - Container with `[data-date]` on each cell button.
 */
export function useCalendarGridKeyboard(
  gridRef: RefObject<HTMLDivElement | null>,
): UseCalendarGridKeyboardResult {
  const focusDate = useCallback(
    (date: Date) => {
      const el = gridRef.current?.querySelector(
        `[data-date="${date.toISOString()}"]`,
      ) as HTMLElement | null;
      el?.focus();
    },
    [gridRef],
  );

  const handleKeyNav = useCallback(
    (e: React.KeyboardEvent, current: Date) => {
      if (e.key === "Enter" || e.key === " ") return;
      const next = getAdjacentCalendarDate(current, e.key);
      if (!next) return;
      e.preventDefault();
      focusDate(next);
    },
    [focusDate],
  );

  return { focusDate, handleKeyNav };
}
