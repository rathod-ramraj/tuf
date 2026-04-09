import { useCalendar } from "@/context/CalendarContext";
import { formatSelectionAnnouncement } from "@/utils/calendarDateUtils";

/**
 * Live region announcing range selection changes for assistive tech (no visual UI).
 */
export function SelectionAnnouncer() {
  const { rangeStart, rangeEnd } = useCalendar();
  const announcement = formatSelectionAnnouncement(rangeStart, rangeEnd);

  return (
    <div className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
      {announcement}
    </div>
  );
}
