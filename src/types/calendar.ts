/**
 * Calendar UI domain types (view state, motion helpers).
 */

/**
 * Discriminated view state for the calendar shell (`CalendarGrid`).
 * `year` is only meaningful when `mode === "months"`.
 */
export type CalendarChromeViewState =
  | { mode: "days" }
  | { mode: "months"; year: number };

/** Payload passed into Framer Motion flip variants (page-turn direction + breakpoint). */
export interface CalendarFlipMotionCustom {
  /** `1` = forward (next month), `-1` = backward. */
  direction: number;
  isMobile: boolean;
}

/** One line in the context banner (holiday or reminder). */
export interface CalendarBannerLine {
  emoji: string;
  text: string;
}
