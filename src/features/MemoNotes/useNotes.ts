import { useState, useEffect, useCallback, useMemo } from "react";
import { loadNotes, saveNotes, type Note } from "@/core/storageService";
import { formatISO, parseISO, isBefore, isAfter, isSameDay } from "date-fns";
import { useCalendar } from "@/context/CalendarContext";

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const isDateInNote = (date: Date, note: Note): boolean => {
  const start = parseISO(note.startDate);
  const end = note.endDate ? parseISO(note.endDate) : start;
  return !isBefore(date, start) && !isAfter(date, end);
};

export const isExactRangeMatch = (note: Note, rangeStart: Date, rangeEnd: Date): boolean => {
  const noteStart = parseISO(note.startDate);
  const noteEnd = note.endDate ? parseISO(note.endDate) : noteStart;
  return isSameDay(noteStart, rangeStart) && isSameDay(noteEnd, rangeEnd);
};

const doesNoteIntersectRange = (note: Note, rangeStart: Date | null, rangeEnd: Date | null): boolean => {
  if (!rangeStart || !rangeEnd) return false;
  const noteStart = parseISO(note.startDate);
  const noteEnd = note.endDate ? parseISO(note.endDate) : noteStart;
  
  // Note intersects range if noteStart <= rangeEnd AND noteEnd >= rangeStart
  return !isAfter(noteStart, rangeEnd) && !isBefore(noteEnd, rangeStart);
};

export function useNotes() {
  const { rangeStart, rangeEnd, focusedDate } = useCalendar();
  
  const isRangeSelection = !!rangeStart && !!rangeEnd;
  const singleDate = focusedDate ?? (rangeStart && !rangeEnd ? rangeStart : null);
  const isSingleSelection = !!singleDate;
  
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  const getMatchingNotes = (notes: Note[], date: Date | null): Note[] => {
    if (!date) return [];
    return notes.filter((note) => isDateInNote(date, note));
  };

  const getRangeMatchingNotes = (notes: Note[], rangeStart: Date | null, rangeEnd: Date | null): Note[] => {
    if (!rangeStart || !rangeEnd) return [];
    return notes.filter((note) => doesNoteIntersectRange(note, rangeStart, rangeEnd));
  };



// const matchingNotes = useMemo(() => {
//   return getMatchingNotes(notes, singleDate);
// }, [notes, singleDate]);

const addNote = useCallback((text: string, startDate: Date, endDate: Date | null = null) => {
    if (!text.trim() || !startDate) return;
    
    const newNote: Note = {
      id: generateId(),
      startDate: formatISO(startDate),
      endDate: endDate ? formatISO(endDate) : null,
      text: text.trim(),
    };

    const newNotes = [...notes, newNote];
    saveNotes(newNotes);
    setNotes(newNotes);
  }, [notes]);

  const hasSelection = !!rangeStart || !!focusedDate;

return { 
    notes,
    addNote, 
    hasSelection, 
    isSingleSelection 
  };
}
