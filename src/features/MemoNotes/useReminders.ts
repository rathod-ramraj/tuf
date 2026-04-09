import { useCallback, useEffect, useMemo, useState } from "react";
import { formatISO, isSameDay } from "date-fns";
import {
  loadReminders,
  saveReminders,
  deleteReminder as persistDeleteReminder,
  reminderIntersectsSelection,
  type Reminder,
} from "@/core/storageService";

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

export type ReminderSelectionContext = {
  focusedDate: Date | null;
  rangeStart: Date | null;
  rangeEnd: Date | null;
};

function selectionWindow(ctx: ReminderSelectionContext): { start: Date; end: Date } | null {
  const { focusedDate, rangeStart, rangeEnd } = ctx;
  if (focusedDate) {
    return { start: focusedDate, end: focusedDate };
  }
  if (rangeStart && rangeEnd && !isSameDay(rangeStart, rangeEnd)) {
    return { start: rangeStart, end: rangeEnd };
  }
  if (rangeStart) {
    return { start: rangeStart, end: rangeStart };
  }
  return null;
}

export function useReminders(ctx: ReminderSelectionContext) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    setReminders(loadReminders());
  }, []);

  useEffect(() => {
    const bump = () => setReminders(loadReminders());
    window.addEventListener("cal-reminders-changed", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("cal-reminders-changed", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const windowSel = useMemo(() => selectionWindow(ctx), [ctx.focusedDate, ctx.rangeStart, ctx.rangeEnd]);

  const matchingReminders = useMemo(() => {
    if (!windowSel) return [];
    return reminders.filter((r) => reminderIntersectsSelection(r, windowSel.start, windowSel.end));
  }, [reminders, windowSel]);

  const addReminder = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !ctx.rangeStart) return;

      const fullRange =
        ctx.rangeStart &&
        ctx.rangeEnd &&
        !isSameDay(ctx.rangeStart, ctx.rangeEnd) &&
        !ctx.focusedDate;

      const start = fullRange ? ctx.rangeStart : (ctx.focusedDate ?? ctx.rangeStart);
      const end = fullRange ? ctx.rangeEnd! : null;

      const next: Reminder[] = [
        ...loadReminders(),
        {
          id: generateId(),
          startDate: formatISO(start),
          endDate: end ? formatISO(end) : null,
          text: trimmed,
        },
      ];
      saveReminders(next);
      setReminders(next);
    },
    [ctx.focusedDate, ctx.rangeStart, ctx.rangeEnd],
  );

  const removeReminder = useCallback((id: string) => {
    const next = persistDeleteReminder(id);
    setReminders(next);
  }, []);

  return { matchingReminders, addReminder, removeReminder };
}
