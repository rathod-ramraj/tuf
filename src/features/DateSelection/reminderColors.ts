/**
 * Reminder accents — no rose/red/pink (reserved for holidays on the grid).
 * Every class string is literal so Tailwind JIT retains them.
 */
export type ReminderColorPreset = {
  ring: string;
  text: string;
  subtleBg: string;
  ringStrong: string;
  textOnRange: string;
  insetLight: string;
  insetDark: string;
};

const PRESETS: readonly ReminderColorPreset[] = [
  {
    ring: "ring-blue-400",
    text: "text-blue-600",
    subtleBg: "bg-blue-50/55 dark:bg-blue-950/30",
    ringStrong: "ring-blue-500",
    textOnRange: "text-blue-900 dark:text-blue-200",
    insetLight: "shadow-[inset_0_0_0_1px_rgba(96,165,250,0.55)]",
    insetDark: "dark:shadow-[inset_0_0_0_1px_rgba(147,197,253,0.45)]",
  },
  {
    ring: "ring-emerald-400",
    text: "text-emerald-600",
    subtleBg: "bg-emerald-50/55 dark:bg-emerald-950/30",
    ringStrong: "ring-emerald-500",
    textOnRange: "text-emerald-900 dark:text-emerald-200",
    insetLight: "shadow-[inset_0_0_0_1px_rgba(52,211,153,0.55)]",
    insetDark: "dark:shadow-[inset_0_0_0_1px_rgba(110,231,183,0.45)]",
  },
  {
    ring: "ring-amber-400",
    text: "text-amber-600",
    subtleBg: "bg-amber-50/55 dark:bg-amber-950/30",
    ringStrong: "ring-amber-500",
    textOnRange: "text-amber-900 dark:text-amber-200",
    insetLight: "shadow-[inset_0_0_0_1px_rgba(251,191,36,0.55)]",
    insetDark: "dark:shadow-[inset_0_0_0_1px_rgba(252,211,77,0.45)]",
  },
  {
    ring: "ring-purple-400",
    text: "text-purple-600",
    subtleBg: "bg-purple-50/55 dark:bg-purple-950/30",
    ringStrong: "ring-purple-500",
    textOnRange: "text-purple-900 dark:text-purple-200",
    insetLight: "shadow-[inset_0_0_0_1px_rgba(192,132,252,0.55)]",
    insetDark: "dark:shadow-[inset_0_0_0_1px_rgba(216,180,254,0.45)]",
  },
  {
    ring: "ring-cyan-400",
    text: "text-cyan-600",
    subtleBg: "bg-cyan-50/55 dark:bg-cyan-950/30",
    ringStrong: "ring-cyan-500",
    textOnRange: "text-cyan-900 dark:text-cyan-200",
    insetLight: "shadow-[inset_0_0_0_1px_rgba(34,211,238,0.55)]",
    insetDark: "dark:shadow-[inset_0_0_0_1px_rgba(103,232,249,0.45)]",
  },
  {
    ring: "ring-indigo-400",
    text: "text-indigo-600",
    subtleBg: "bg-indigo-50/55 dark:bg-indigo-950/30",
    ringStrong: "ring-indigo-500",
    textOnRange: "text-indigo-900 dark:text-indigo-200",
    insetLight: "shadow-[inset_0_0_0_1px_rgba(129,140,248,0.55)]",
    insetDark: "dark:shadow-[inset_0_0_0_1px_rgba(165,180,252,0.45)]",
  },
];

export const REMINDER_COLORS = PRESETS.map((p) => `${p.ring} ${p.text}`) as readonly string[];

function hashReminderId(reminderId: string): number {
  let hash = 0;
  for (let i = 0; i < reminderId.length; i++) {
    hash = (hash << 5) - hash + reminderId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getReminderColor(reminderId: string): ReminderColorPreset {
  return PRESETS[hashReminderId(reminderId) % PRESETS.length];
}
