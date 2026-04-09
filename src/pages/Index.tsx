import { CalendarProvider, useCalendar } from "@/context/CalendarContext";
import { CalendarGrid } from "@/features/CalendarView/CalendarGrid";
import { NotesPanel } from "@/features/MemoNotes/NotesPanel";
import { SeasonalHero } from "@/features/CalendarView/SeasonalHero";
import { AnimatePresence, motion } from "framer-motion";

function ProductivityPanelGate() {
  const { rangeStart, focusedDate } = useCalendar();
  const visible = !!rangeStart || !!focusedDate;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="productivity-panel"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-2 w-full shrink-0"
        >
          <NotesPanel />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Index() {
  return (
    <CalendarProvider>
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-4 bg-background">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto min-h-screen sm:min-h-0 sm:h-[85vh] bg-card sm:rounded-2xl shadow-xl overflow-hidden border-0 sm:border border-border">
          <div className="w-full h-64 md:h-full md:w-5/12 flex-shrink-0">
            <SeasonalHero />
          </div>

          <div className="flex w-full flex-col items-stretch justify-start gap-4 overflow-y-auto p-4 sm:p-6 md:w-7/12 md:p-10">
            <CalendarGrid />
            <ProductivityPanelGate />
          </div>
        </div>
      </div>
    </CalendarProvider>
  );
}
