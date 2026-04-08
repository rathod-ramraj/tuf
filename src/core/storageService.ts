const PREFIX = "cal_notes_";

export type Note = {
  id: string;
  startDate: string; // ISO string
  endDate: string | null; // ISO string or null
  text: string;
};

const NOTES_KEY = `${PREFIX}global`;

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
  } catch {
    // storage quota exceeded or unavailable
  }
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
