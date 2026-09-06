/* جعبه‌ی لایتنر — فواصل مرور: ۱، ۳، ۷، ۲۱، ۳۰ و ۹۰ روز */

export const INTERVALS = [1, 3, 7, 21, 30, 90];
export const DAY = 86400000;

export interface SavedWord {
  w: string;
  box: number; // 0 = تازه، 1..6 = جعبه‌ها، 7 = یادگرفته
  due: number; // زمان مرور بعدی (ms)
  lapses: number; // شمار فراموشی‌ها
  added: number;
}

export const BOX_NAMES = ["تازه", "جعبه‌ی ۱", "جعبه‌ی ۲", "جعبه‌ی ۳", "جعبه‌ی ۴", "جعبه‌ی ۵", "جعبه‌ی ۶", "یادگرفته"];
export const BOX_COLORS = ["#94a3b8", "#a7bfd9", "#7fb6ca", "#63bfae", "#74c27f", "#b3c25f", "#e8a33d", "#178a55"];

export function newSaved(w: string): SavedWord {
  return { w, box: 0, due: Date.now(), lapses: 0, added: Date.now() };
}

export function recordResult(s: SavedWord, ok: boolean): SavedWord {
  const now = Date.now();
  if (!ok) {
    return { ...s, box: 1, due: now + INTERVALS[0] * DAY, lapses: s.lapses + 1 };
  }
  const box = Math.min(s.box + 1, 7);
  const due = box >= 7 ? now + 3650 * DAY : now + INTERVALS[box - 1] * DAY;
  return { ...s, box, due };
}

export function isDue(s: SavedWord): boolean {
  return s.box < 7 && s.due <= Date.now();
}

export function isMastered(s: SavedWord): boolean {
  return s.box >= 7;
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
export function faNum(n: number | string): string {
  return String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function dueLabel(s: SavedWord): string {
  if (s.box >= 7) return "یادگرفته";
  const diff = s.due - Date.now();
  if (diff <= 0) return "مرور: امروز";
  const days = Math.ceil(diff / DAY);
  return `مرور: ${faNum(days)} روز دیگر`;
}

export function nextIntervalLabel(s: SavedWord): string {
  if (s.box >= 7) return "پایان مسیر";
  if (s.box === 0) return "امروز (واژه‌ی تازه)";
  return `${faNum(INTERVALS[Math.min(s.box, INTERVALS.length) - 1])} روز دیگر`;
}
