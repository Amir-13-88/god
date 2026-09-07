/*
 * تکمیل واژه‌ها — برای واژه‌هایی که تعریف/تلفذ ندارند (مثل واژه‌های دستی یا کم‌کاربرد).
 * با یک اتصال اینترنت از API رایگان دریافت و برای همیشه در localStorage کش می‌شود؛
 * یعنی بعد از یک بار دیدن، آن واژه هم آفلاین می‌شود.
 */
export interface EnrichData {
  en?: string;
  ph?: string;
  audio?: string;
  source: "api";
}

const LS_KEY = "leitner.enrich.v1";
const MAX_CACHE = 3000;

let cache: Record<string, EnrichData> = (() => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, EnrichData>) : {};
  } catch {
    return {};
  }
})();

let saveTimer: number | null = null;
function scheduleSave() {
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      const keys = Object.keys(cache);
      if (keys.length > MAX_CACHE) {
        for (const k of keys.slice(0, keys.length - MAX_CACHE)) delete cache[k];
      }
      localStorage.setItem(LS_KEY, JSON.stringify(cache));
    } catch { /* حافظه پر */ }
  }, 400);
}

const norm = (w: string) => w.trim().toLowerCase().replace(/\s+/g, " ");
const inFlight = new Map<string, Promise<EnrichData | null>>();

export function getCached(key: string): EnrichData | null {
  return cache[norm(key)] ?? null;
}

export function cachedCount(): number {
  return Object.keys(cache).length;
}

export function enrichWord(word: string): Promise<EnrichData | null> {
  const key = norm(word);
  const cached = getCached(key);
  if (cached) return Promise.resolve(cached);
  if (inFlight.has(key)) return inFlight.get(key)!;

  const p = (async () => {
    if (!navigator.onLine) return null;
    try {
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`,
        { signal: ctrl.signal }
      );
      window.clearTimeout(timer);
      if (!res.ok) return null;
      const data = await res.json();
      const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
      if (!first) return null;
      const phonetic =
        (first.phonetic as string) ||
        ((first.phonetics as { text?: string }[]) ?? []).find((x) => x.text)?.text ||
        "";
      const audio =
        ((first.phonetics as { audio?: string }[]) ?? []).find((x) => x.audio)?.audio || "";
      const defs: string[] = [];
      for (const m of first.meanings ?? []) {
        for (const d of m.definitions ?? []) {
          if (d.definition) defs.push(d.definition);
          if (defs.length >= 2) break;
        }
        if (defs.length >= 2) break;
      }
      const out: EnrichData = {
        en: defs.join(" • ") || undefined,
        ph: phonetic || undefined,
        audio: audio || undefined,
        source: "api",
      };
      cache[key] = out;
      scheduleSave();
      return out;
    } catch {
      return null;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, p);
  return p;
}

/** تلفظ صوتی: اول صدای واقعی کش‌شده، بعد TTS مرورگر */
export function speakWord(word: string, fallbackTTS: () => void) {
  const cached = getCached(word);
  if (cached?.audio) {
    const a = new Audio(cached.audio);
    a.play().catch(() => fallbackTTS());
    return;
  }
  fallbackTTS();
}
