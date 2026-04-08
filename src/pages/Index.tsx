import { CalendarProvider } from "@/context/CalendarContext";
import { CalendarGrid } from "@/features/CalendarView/CalendarGrid";
import { NotesPanel } from "@/features/MemoNotes/NotesPanel";
import { SeasonalHero } from "@/features/CalendarView/SeasonalHero";

export default function Index() {
  return (
    <CalendarProvider>
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-4 bg-background">
        
        {/* Main Card Container */}
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto min-h-screen sm:min-h-0 sm:h-[85vh] bg-card sm:rounded-2xl shadow-xl overflow-hidden border-0 sm:border border-border">
          
          {/* THE HERO WRAPPER: Forces 100% width on mobile, 5/12 width on desktop */}
          <div className="w-full h-64 md:h-full md:w-5/12 flex-shrink-0">
            <SeasonalHero />
          </div>
          
          {/* THE CALENDAR WRAPPER: Takes remaining space below on mobile, right on desktop */}
          <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 w-full md:w-7/12 overflow-y-auto">
            <CalendarGrid />
            <NotesPanel />
          </div>

        </div>
        
      </div>
    </CalendarProvider>
  );
}