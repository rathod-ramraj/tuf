import type { CalendarFlipMotionCustom } from "@/types/calendar";

/** Shared spring-like tween for month flip (Framer Motion). */
export const CALENDAR_FLIP_TRANSITION = { duration: 0.4, ease: "easeInOut" as const };

/**
 * 3D flip variants for the day grid; `custom` carries direction and mobile axis.
 */
export const calendarDayGridFlipVariants = {
  enter: ({ direction: d, isMobile }: CalendarFlipMotionCustom) => ({
    rotateY: isMobile ? 0 : d > 0 ? 90 : -90,
    rotateX: isMobile ? (d > 0 ? -90 : 90) : 0,
    opacity: 0,
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
  }),
  center: {
    rotateY: 0,
    rotateX: 0,
    opacity: 1,
    position: "relative" as const,
    zIndex: 1,
  },
  exit: ({ direction: d, isMobile }: CalendarFlipMotionCustom) => ({
    rotateY: isMobile ? 0 : d > 0 ? -90 : 90,
    rotateX: isMobile ? (d > 0 ? 90 : -90) : 0,
    opacity: 0,
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  }),
};

export const calendarShellTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.18, ease: "easeIn" as const },
  },
};
