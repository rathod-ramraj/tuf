import { useNotes, isDateInNote, isExactRangeMatch } from "./useNotes";
import { useReminders } from "./useReminders";
import { useCalendar, useCalendarDispatch } from "@/context/CalendarContext";
import { Label } from "@/shared/ui/Typography";
import { format, parseISO, isSameDay } from "date-fns";
import { StickyNote, PlusCircle, ArrowLeft, Plus, Pencil, Trash2, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useMemo, useEffect } from "react";
import { MarkdownRich, NOTE_MARKDOWN_PLACEHOLDER_HINT } from "@/features/MemoNotes/MarkdownRich";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function reminderRangeLabel(r: { startDate: string; endDate: string | null }) {
  const start = parseISO(r.startDate);
  const end = r.endDate ? parseISO(r.endDate) : start;
  if (isSameDay(start, end)) {
    return format(start, "MMM d, yyyy");
  }
  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}

export function NotesPanel() {
  const { notes, addNote, deleteNote, updateNote, hasSelection, isSingleSelection } = useNotes();
  const { rangeStart, rangeEnd, focusedDate } = useCalendar();
  const dispatch = useCalendarDispatch();

  const reminderCtx = useMemo(
    () => ({ focusedDate, rangeStart, rangeEnd }),
    [focusedDate, rangeStart, rangeEnd],
  );
  const { matchingReminders, addReminder, removeReminder } = useReminders(reminderCtx);

  const activeDate = focusedDate ?? rangeStart ?? null;
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newText, setNewText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [reminderDraft, setReminderDraft] = useState("");

  useEffect(() => {
    setIsAddingNote(false);
    setNewText("");
    setEditingNoteId(null);
    setEditDraft("");
    setReminderDraft("");
  }, [rangeStart, rangeEnd, focusedDate]);

  const isRangeComplete = rangeStart && rangeEnd;
  const selectedDate = activeDate;
  const isSingleDateView = !!focusedDate || (rangeStart && !rangeEnd);

  const matchingNotes = useMemo(() => {
    if (isSingleDateView && selectedDate) {
      return notes.filter((note) => isDateInNote(selectedDate, note));
    } else if (rangeStart && rangeEnd && !isSameDay(rangeStart, rangeEnd)) {
      return notes.filter((note) => isExactRangeMatch(note, rangeStart, rangeEnd));
    }
    return [];
  }, [notes, isSingleDateView, selectedDate, rangeStart, rangeEnd]);

  const hasNotes = matchingNotes.length > 0;

  let rangeLabel = "Select a date";
  if (selectedDate) {
    if (isSingleSelection) {
      rangeLabel = format(selectedDate, "MMMM d, yyyy");
    } else if (isRangeComplete) {
      rangeLabel = `${format(rangeStart!, "MMM d")} – ${format(rangeEnd!, "MMM d, yyyy")}`;
    } else {
      rangeLabel = format(selectedDate, "MMMM d, yyyy");
    }
  }

  const remindersScopeLabel = useMemo(() => {
    if (focusedDate) {
      return `Showing reminders that touch ${format(focusedDate, "MMMM d, yyyy")}`;
    }
    if (rangeStart && rangeEnd && !isSameDay(rangeStart, rangeEnd)) {
      return `Showing reminders that overlap ${format(rangeStart, "MMM d")} – ${format(rangeEnd, "MMM d, yyyy")}`;
    }
    if (rangeStart) {
      return `Showing reminders that touch ${format(rangeStart, "MMMM d, yyyy")}`;
    }
    return "";
  }, [focusedDate, rangeStart, rangeEnd]);

  const addReminderSpansFullRange =
    !!(rangeStart && rangeEnd && !isSameDay(rangeStart, rangeEnd) && !focusedDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-accent" />
          <Label>Workspace</Label>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <p className="font-body text-sm font-semibold text-foreground">{rangeLabel}</p>
        <div className="flex items-center gap-1.5">
          {isRangeComplete && (
            <>
              {isSingleDateView ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch({ type: "FOCUS_DATE", payload: null })}
                  className="h-7 gap-1 px-2 text-xs whitespace-nowrap"
                >
                  <ArrowLeft className="h-3 w-3" /> Range View
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch({ type: "FOCUS_DATE", payload: rangeStart })}
                  className="h-7 gap-1 px-2 text-xs whitespace-nowrap"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Specific Day
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes" className="gap-1.5">
            <StickyNote className="h-3.5 w-3.5" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="reminders" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            Reminders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-4 space-y-3 focus-visible:outline-none">
          {!isAddingNote && hasNotes && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingNote(true)}
                className="h-8 gap-1.5 px-3 text-xs border border-border/50 hover:border-border"
              >
                <Plus className="h-3.5 w-3.5" />
                Add New Note
              </Button>
            </div>
          )}

          <AnimatePresence>
            {!isAddingNote && hasNotes && (
              <div className="space-y-4 mb-2">
                {matchingNotes.map((note) => {
                  const noteStart = parseISO(note.startDate);
                  const noteEnd = note.endDate ? parseISO(note.endDate) : noteStart;
                  const noteRangeLabel = `${format(noteStart, "MMM d")} ${note.endDate ? `– ${format(noteEnd, "MMM d")}` : ""}`;

                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                      <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-background p-6 pt-12 shadow-sm hover:shadow-md transition-all duration-200 hover:border-border hover:-translate-y-0.5">
                        <div className="absolute right-3 top-3 z-10 flex items-center gap-0.5">
                          {editingNoteId !== note.id && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Edit note"
                              onClick={() => {
                                setEditingNoteId(note.id);
                                setEditDraft(note.text);
                              }}
                              className="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-primary [&_svg]:h-3.5 [&_svg]:w-3.5"
                            >
                              <Pencil />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Delete note"
                            onClick={() => {
                              if (!window.confirm("Delete this note?")) return;
                              deleteNote(note.id);
                              if (editingNoteId === note.id) {
                                setEditingNoteId(null);
                                setEditDraft("");
                              }
                            }}
                            className="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-destructive [&_svg]:h-3.5 [&_svg]:w-3.5"
                          >
                            <Trash2 />
                          </Button>
                        </div>

                        <div className="inline-block bg-background/80 backdrop-blur-sm border border-border/50 px-3 py-1 rounded-full mb-4 text-xs font-semibold text-muted-foreground tracking-wide">
                          {noteRangeLabel}
                        </div>

                        {editingNoteId === note.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editDraft}
                              onChange={(e) => setEditDraft(e.target.value)}
                              placeholder={NOTE_MARKDOWN_PLACEHOLDER_HINT}
                              className="min-h-[120px] resize-y font-body text-sm"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                className="h-9 flex-1"
                                disabled={!editDraft.trim()}
                                onClick={() => {
                                  updateNote(note.id, editDraft);
                                  setEditingNoteId(null);
                                  setEditDraft("");
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-9 px-4"
                                onClick={() => {
                                  setEditingNoteId(null);
                                  setEditDraft("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <MarkdownRich text={note.text} variant="note" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {!hasNotes && !isAddingNote && hasSelection && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-dashed border-2 border-border rounded-lg">
              <StickyNote className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm text-center mb-4">
                {isSingleDateView ? "No notes for this date" : "No notes for this range"}
              </p>
              <Button variant="outline" onClick={() => setIsAddingNote(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Note
              </Button>
            </div>
          )}

          {isAddingNote && hasSelection && (
            <div className="space-y-3 pt-2">
              <Textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder={`Write a note for ${isSingleDateView ? "this day" : "this range"}… ${NOTE_MARKDOWN_PLACEHOLDER_HINT}`}
                className="min-h-[120px] resize-y"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const endDate = isSingleDateView || !rangeEnd ? null : rangeEnd;
                    addNote(newText, selectedDate!, endDate);
                    setIsAddingNote(false);
                    setNewText("");
                  }}
                  disabled={!newText.trim()}
                  className="flex-1 h-10"
                >
                  Save Note
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewText("");
                  }}
                  className="h-10 px-3"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reminders" className="mt-4 space-y-4 focus-visible:outline-none">
          <p className="text-xs leading-relaxed text-muted-foreground">{remindersScopeLabel}</p>
          {addReminderSpansFullRange && (
            <p className="text-xs font-medium text-amber-700/90 dark:text-amber-300/90">
              New reminders will span the full selected range.
            </p>
          )}

          {matchingReminders.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No reminders overlap this selection
            </div>
          ) : (
            <ul className="space-y-2">
              {matchingReminders.map((r) => (
                <motion.li
                  key={r.id}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 sm:flex-row sm:items-start"
                >
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {reminderRangeLabel(r)}
                    </p>
                    <MarkdownRich text={r.text} variant="reminder" className="text-foreground" />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 self-end text-muted-foreground hover:text-destructive sm:self-start"
                    aria-label={`Delete reminder: ${r.text.replace(/<[^>]+>/g, " ").trim()}`}
                    onClick={() => removeReminder(r.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </motion.li>
              ))}
            </ul>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Textarea
              value={reminderDraft}
              onChange={(e) => setReminderDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  addReminder(reminderDraft);
                  setReminderDraft("");
                }
              }}
              placeholder={`Reminder text… ${NOTE_MARKDOWN_PLACEHOLDER_HINT}`}
              className="min-h-[72px] flex-1 resize-y text-sm sm:min-h-[80px]"
              disabled={!activeDate}
            />
            <Button
              type="button"
              className="h-10 shrink-0 sm:w-auto w-full"
              disabled={!activeDate || !reminderDraft.trim()}
              onClick={() => {
                addReminder(reminderDraft);
                setReminderDraft("");
              }}
            >
              Add Reminder
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
