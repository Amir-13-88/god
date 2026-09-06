export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export const CEFR_ORDER: CEFR[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const CEFR_INFO: Record<CEFR, { label: string; color: string; soft: string }> = {
  A1: { label: "مقدماتی", color: "#178a55", soft: "#ddf2e6" },
  A2: { label: "پایه", color: "#0e9aa7", soft: "#d9f2f4" },
  B1: { label: "متوسط", color: "#3b6fb6", soft: "#dfe9f8" },
  B2: { label: "فرامتوسط", color: "#7c5cbf", soft: "#ebe4f9" },
  C1: { label: "پیشرفته", color: "#c04a6b", soft: "#fadfe7" },
  C2: { label: "حرفه‌ای", color: "#8a5a12", soft: "#f6ead2" },
};

export interface Entry {
  id: string;
  w: string; // سرمدخل
  pos: string; // نقش دستوری
  en: string; // تعریف انگلیسی
  fa: string; // معنی فارسی
  ex?: string; // مثال
  ph: string; // تلفظ نوشتاری IPA
  lvl: CEFR; // سطح
}

const LVLS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);

/* فرمت فشرده:  word|pos|fa|ipa|lvl */
function parse(src: string, prefix: string): Entry[] {
  return src
    .trim()
    .split("\n")
    .map((line, i) => {
      const [w, pos, fa, ph, lvl] = line.split("|");
      return {
        id: `${prefix}${i}-${(w || "").replace(/\s+/g, "-")}`,
        w: (w || "").trim(),
        pos: (pos || "").trim(),
        en: "",
        fa: (fa || "").trim(),
        ph: (ph || "").trim(),
        lvl: (LVLS.has((lvl || "").trim()) ? lvl!.trim() : "A2") as CEFR,
      };
    })
    .filter((e) => e.w && e.fa);
}

/* فرمت تعریف‌های انگلیسی:  word|definition|example */
function parseDefs(src: string): Map<string, { en: string; ex?: string }> {
  const m = new Map<string, { en: string; ex?: string }>();
  for (const line of src.trim().split("\n")) {
    const [w, en, ex] = line.split("|");
    if (w && en) m.set(w.trim().toLowerCase(), { en: en.trim(), ex: (ex || "").trim() || undefined });
  }
  return m;
}

let _cache: Entry[] | null = null;
let _promise: Promise<Entry[]> | null = null;

/**
 * بارگذاری فرهنگ پایه — داده‌ها به‌صورت تنبل (chunk جدا) دانلود می‌شوند تا
 * پوسته‌ی برنامه با کمترین سرعت اینترنت هم فوراً بالا بیاید. نتیجه کش می‌شود.
 */
export function loadBaseEntries(): Promise<Entry[]> {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;
  _promise = Promise.all([
    import("../data/dict-a"),
    import("../data/dict-b"),
    import("../data/dict-c"),
    import("../data/en-defs"),
  ])
    .then(([a, b, c, d]) => {
      const defs = parseDefs(d.EN_DEFS);
      const seen = new Set<string>();
      const out: Entry[] = [];
      for (const e of [...parse(a.DICT_A, "a-"), ...parse(b.DICT_B, "b-"), ...parse(c.DICT_C, "c-")]) {
        const key = e.w.toLowerCase() + "\u0001" + e.pos;
        if (seen.has(key)) continue;
        seen.add(key);
        const rich = defs.get(e.w.toLowerCase());
        if (rich) {
          e.en = rich.en;
          if (rich.ex) e.ex = rich.ex;
        }
        out.push(e);
      }
      _cache = out.sort((x, y) => x.w.localeCompare(y.w));
      return _cache;
    })
    .catch((err) => {
      _promise = null; /* اگر دانلود قطع شد، دوباره تلاش شود */
      throw err;
    });
  return _promise;
}

export const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

export interface Category {
  name: string;
  en: string;
  words: string[];
}

export const CATEGORIES: Category[] = [
  { name: "خانواده و مردم", en: "Family & People", words: ["family", "mother", "father", "brother", "sister", "baby", "child", "aunt", "daughter", "son", "friend", "people", "person", "man", "woman", "husband", "wife", "parent", "uncle", "neighbour"] },
  { name: "خوراکی و نوشیدنی", en: "Food & Drink", words: ["apple", "banana", "bread", "butter", "cake", "cheese", "chicken", "coffee", "egg", "fish", "fruit", "juice", "meal", "meat", "milk", "orange", "rice", "tea", "water", "vegetable", "food", "sugar", "salt"] },
  { name: "جانوران", en: "Animals", words: ["animal", "bird", "cat", "cow", "dog", "elephant", "fish", "horse", "lion", "pet", "sheep", "zoo", "monkey", "tiger", "rabbit", "snake", "duck", "pig"] },
  { name: "بدن و سلامت", en: "Body & Health", words: ["arm", "body", "ear", "eye", "face", "finger", "foot", "hair", "hand", "head", "heart", "knee", "leg", "mouth", "neck", "nose", "teeth", "tooth", "doctor", "hospital", "health", "medicine"] },
  { name: "رنگ‌ها", en: "Colours", words: ["black", "blue", "colour", "green", "grey", "orange", "red", "white", "yellow", "gold", "pink", "purple", "brown"] },
  { name: "زمان و آب‌وهوا", en: "Time & Weather", words: ["autumn", "day", "evening", "hour", "minute", "month", "morning", "night", "rain", "season", "snow", "spring", "summer", "sun", "time", "today", "tomorrow", "weather", "week", "wind", "winter", "year", "yesterday", "cloud"] },
  { name: "خانه و زندگی", en: "Home & Life", words: ["bed", "chair", "computer", "desk", "door", "floor", "garden", "home", "house", "key", "kitchen", "room", "table", "wall", "window", "lamp", "sofa"] },
  { name: "مدرسه و یادگیری", en: "School & Study", words: ["answer", "book", "class", "exercise", "lesson", "pen", "pencil", "question", "read", "school", "science", "spell", "student", "study", "teacher", "test", "word", "write", "learn", "homework"] },
  { name: "شهر و سفر", en: "City & Travel", words: ["bus", "car", "city", "hotel", "map", "market", "park", "plane", "restaurant", "road", "shop", "station", "street", "taxi", "ticket", "town", "train", "travel", "trip", "village", "airport"] },
  { name: "احساس و حالت", en: "Feelings", words: ["afraid", "beautiful", "excited", "funny", "glad", "happy", "hungry", "sad", "tired", "angry", "love", "smile", "kind", "brave"] },
];

const norm = (s: string) =>
  s.toLowerCase().replace(/\u200c/g, " ").replace(/[يی]/g, "ی").replace(/[كک]/g, "ک").trim();

/** جست‌وجو در سرمدخل‌ها، تعریف انگلیسی و معنی فارسی */
export function searchEntries(q: string, all: Entry[]): Entry[] {
  const query = norm(q);
  if (!query) return [];
  const scored: { e: Entry; s: number }[] = [];
  for (const e of all) {
    const w = e.w.toLowerCase();
    let s = 0;
    if (w === query) s = 100;
    else if (w.startsWith(query)) s = 80;
    else if (w.includes(query)) s = 60;
    else if (norm(e.fa).includes(query)) s = 40;
    else if (norm(e.en).includes(query)) s = 25;
    else if (e.ex && norm(e.ex).includes(query)) s = 12;
    if (s > 0) scored.push({ e, s: s - Math.min(w.length, 30) / 10 });
  }
  scored.sort((a, b) => b.s - a.s || a.e.w.localeCompare(b.e.w));
  return scored.slice(0, 150).map((x) => x.e);
}

export function entriesForLetter(letter: string, all: Entry[]): Entry[] {
  return all.filter((e) => e.w.toLowerCase().startsWith(letter));
}

export function entriesForCategory(cat: Category, all: Entry[]): Entry[] {
  const set = new Set(cat.words);
  return all.filter((e) => set.has(e.w));
}
