import { formatISO, parse, parseISO, isBefore, isAfter } from "date-fns";

const PREFIX = "cal_notes_";

export type Note = {
  id: string;
  startDate: string; // ISO string
  endDate: string | null; // ISO string or null
  text: string;
};

export type Reminder = {
  id: string;
  /** ISO timestamp — inclusive start of range. */
  startDate: string;
  /** ISO timestamp — inclusive end, or null for a single-day reminder. */
  endDate: string | null;
  text: string;
};

/** True if `date` falls on any calendar day within the reminder's inclusive range. */
export function reminderCoversDate(date: Date, r: Reminder): boolean {
  const start = parseISO(r.startDate);
  const end = r.endDate ? parseISO(r.endDate) : start;
  return !isBefore(date, start) && !isAfter(date, end);
}

/** True if the reminder's day-range overlaps [selStart, selEnd] inclusively. */
export function reminderIntersectsSelection(r: Reminder, selStart: Date, selEnd: Date): boolean {
  const rStart = parseISO(r.startDate);
  const rEnd = r.endDate ? parseISO(r.endDate) : rStart;
  return !isAfter(rStart, selEnd) && !isBefore(rEnd, selStart);
}

const NOTES_KEY = `${PREFIX}global`;
const REMINDERS_KEY = `${PREFIX}reminders`;

export function loadNotes(): Note[] {
  try {
    const stored = localStorage.getItem(NOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cal-notes-changed"));
    }
  } catch {
    // storage quota exceeded or unavailable
  }
}

export function deleteNote(noteId: string): Note[] {
  const notes = loadNotes().filter((n) => n.id !== noteId);
  saveNotes(notes);
  return notes;
}

export function updateNote(noteId: string, newText: string): Note[] {
  const trimmed = newText.trim();
  const notes = loadNotes().map((n) =>
    n.id === noteId ? { ...n, text: trimmed } : n,
  );
  saveNotes(notes);
  return notes;
}

export function loadNote(key: string): string {
  if (!key) return "";
  try {
    return localStorage.getItem(PREFIX + key) ?? "";
  } catch {
    return "";
  }
}

export function saveNote(key: string, value: string): void {
  if (!key) return;
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    // storage full or unavailable
  }
}

type LegacyReminder = { id: string; date: string; text: string };

function migrateReminderRow(raw: unknown): Reminder | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.text !== "string") return null;
  if (typeof o.startDate === "string") {
    return {
      id: o.id,
      startDate: o.startDate,
      endDate: typeof o.endDate === "string" ? o.endDate : null,
      text: o.text,
    };
  }
  if (typeof (o as LegacyReminder).date === "string") {
    const d = parse((o as LegacyReminder).date, "yyyy-MM-dd", new Date());
    return {
      id: o.id,
      startDate: formatISO(d),
      endDate: null,
      text: o.text,
    };
  }
  return null;
}

export function loadReminders(): Reminder[] {
  try {
    const stored = localStorage.getItem(REMINDERS_KEY);
    if (!stored) return [];
    const parsed: unknown[] = JSON.parse(stored);
    let needsPersist = false;
    const migrated = parsed
      .map((row) => {
        if (row && typeof row === "object" && "date" in row && !("startDate" in row)) {
          needsPersist = true;
        }
        return migrateReminderRow(row);
      })
      .filter((r): r is Reminder => r !== null);
    if (needsPersist) {
      saveReminders(migrated);
    }
    return migrated;
  } catch {
    return [];
  }
}

export function saveReminders(reminders: Reminder[]): void {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cal-reminders-changed"));
    }
  } catch {
    // storage quota exceeded or unavailable
  }
}

export function deleteReminder(reminderId: string): Reminder[] {
  const next = loadReminders().filter((r) => r.id !== reminderId);
  saveReminders(next);
  return next;
}
