import { useNotes, isDateInNote, isExactRangeMatch } from "./useNotes";
import { useCalendar, useCalendarDispatch } from "@/context/CalendarContext";
import { Label } from "@/shared/ui/Typography";
import { format, parseISO, isBefore, isAfter, isSameDay } from "date-fns";
import { StickyNote, PlusCircle, ArrowLeft, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function NotesPanel() {
  const { notes, addNote, hasSelection, isSingleSelection } = useNotes();
  const { rangeStart, rangeEnd, focusedDate } = useCalendar();
  const dispatch = useCalendarDispatch();
  
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newText, setNewText] = useState("");

  // Reset add mode when dates change
  React.useEffect(() => {
    setIsAddingNote(false);
    setNewText("");
  }, [rangeStart, rangeEnd, focusedDate]);

  const isRangeComplete = rangeStart && rangeEnd;
  const selectedDate = focusedDate ?? rangeStart ?? null;
  const isSingleDateView = !!focusedDate || (rangeStart && !rangeEnd);

// Compute matching notes - FIXED BLEED LOGIC
  const matchingNotes = useMemo(() => {
    if (isSingleDateView && selectedDate) {
      // Single: show ALL notes containing this date
      return notes.filter((note) => isDateInNote(selectedDate!, note));
    } else if (rangeStart && rangeEnd && !isSameDay(rangeStart, rangeEnd)) {
      // Range: EXACT MATCH ONLY
      return notes.filter((note) => isExactRangeMatch(note, rangeStart!, rangeEnd!));
    }
    return [];
  }, [notes, isSingleDateView, selectedDate, rangeStart, rangeEnd]);

  const hasNotes = matchingNotes.length > 0;

  // Dynamic Labeling
  let rangeLabel = "Select a date to add notes";
  if (selectedDate) {
    if (isSingleSelection) {
      rangeLabel = format(selectedDate, "MMMM d, yyyy");
    } else if (isRangeComplete) {
      rangeLabel = `${format(rangeStart!, "MMM d")} – ${format(rangeEnd!, "MMM d, yyyy")}`;
    } else {
      rangeLabel = format(selectedDate, "MMMM d, yyyy");
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={hasSelection ? "notes" : "empty"}
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
      >
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-accent" />
  <Label>{isSingleDateView ? "Daily Notes" : "Range Notes"}</Label>

          </div>
        </div>

        {/* Sub-header - Premium Layout */}
        <div className="flex items-center justify-between pb-3">
          <p className="font-body text-sm font-semibold text-foreground">{rangeLabel}</p>
          
          <div className="flex items-center gap-1.5">
            {/* Navigation/View Toggle */}
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

        {/* Premium Add Button - positioned in header */}
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

        {/* Premium Note Cards - Read Mode */}
        <AnimatePresence>
          {!isAddingNote && hasNotes && (
            <div className="space-y-4 mb-6">
              {matchingNotes.map((note) => {
                const noteStart = parseISO(note.startDate);
                const noteEnd = note.endDate ? parseISO(note.endDate) : noteStart;
                const noteRangeLabel = `${format(noteStart, "MMM d")} ${note.endDate ? `– ${format(noteEnd, "MMM d")}` : ''}`;
                
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-background p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-border hover:-translate-y-0.5">
                      {/* Premium Date Badge */}
                      <div className="inline-block bg-background/80 backdrop-blur-sm border border-border/50 px-3 py-1 rounded-full mb-4 text-xs font-semibold text-muted-foreground tracking-wide">
                        {noteRangeLabel}
                      </div>
                      
                      {/* Note Content */}
                      <div className="prose prose-sm max-w-none font-body leading-relaxed text-foreground">
                        <ReactMarkdown 
                          components={{
                            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>
                          }}
                        >
                          {note.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!hasSelection ? (
          <div className="flex flex-col items-center justify-center min-h-[140px] text-muted-foreground">
            <StickyNote className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm text-center">Select dates to view or add notes</p>
          </div>
        ) : !hasNotes && !isAddingNote ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-dashed border-2 border-border rounded-lg">
            <StickyNote className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm text-center mb-4">
              {isSingleDateView ? "No notes for this date" : "No notes for this range"}
            </p>
            <Button
              variant="outline"
              onClick={() => setIsAddingNote(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add First Note
            </Button>
          </div>
        ) : null}

        {/* Write Mode Form */}
        {isAddingNote && hasSelection && (
          <div className="space-y-3 pt-2">
            <Textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={`Write a note for ${isSingleDateView ? "this day" : "this range"}...`}
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
      </motion.div>
    </AnimatePresence>
  );
}
