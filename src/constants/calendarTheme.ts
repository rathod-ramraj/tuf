/**
 * Single source of truth for calendar-related theme tokens used by both Tailwind
 * (via CSS variables in `index.css`) and runtime updates (`applyThemeColors`).
 */

/** Tailwind classes for range start/end circles; maps to `--cal-start` in CSS. */
export const CALENDAR_RANGE_ENDPOINT_CLASS =
  "bg-cal-start text-primary-foreground font-bold shadow-md" as const;

/**
 * Document-level CSS custom property names written by `applyThemeColors`.
 * Import these instead of string literals to avoid drift between JS and CSS.
 */
export const CALENDAR_CSS_VARIABLES = {
  primary: "--primary",
  calStart: "--cal-start",
  calEnd: "--cal-end",
  ring: "--ring",
  calRangeBg: "--cal-range-bg",
  accent: "--accent",
} as const;

export type CalendarCssVariableKey = keyof typeof CALENDAR_CSS_VARIABLES;
