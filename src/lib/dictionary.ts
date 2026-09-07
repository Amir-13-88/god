/* فرهنگ لغت — داده‌ها به‌صورت تنبل (چانک جدا) بارگذاری می‌شوند تا برنامه با
   کمترین سرعت اینترنت هم فوراً بالا بیاید و بعد از اولین بار، آفلاین بماند. */

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
  en: string; // تعریف انگلیسی به انگلیسی
  fa: string; // معنی فارسی
  ex?: string; // جمله‌ی مثال
  ph: string; // تلفظ نوشتاری IPA
  lvl: CEFR; // سطح
}

const LVLS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);

/* قالب هر خط:  word|pos|english-def|farsi|example|/ipa/|LVL */
function parse(src: string, prefix: string): Entry[] {
  return src
    .trim()
    .split("\n")
    .map((line, i) => {
      const [w, pos, en, fa, ex, ph, lvl] = line.split("|");
      return {
        id: `${prefix}${i}-${(w || "").replace(/\s+/g, "-")}`,
        w: (w || "").trim(),
        pos: (pos || "").trim(),
        en: (en || "").trim(),
        fa: (fa || "").trim(),
        ex: (ex || "").trim() || undefined,
        ph: (ph || "").trim(),
        lvl: (LVLS.has((lvl || "").trim()) ? lvl!.trim() : "A2") as CEFR,
      };
    })
    .filter((e) => e.w && (e.fa || e.en));
}

let _cache: Entry[] | null = null;
let _promise: Promise<Entry[]> | null = null;

export function loadBaseEntries(): Promise<Entry[]> {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;
  _promise = Promise.all([
    import("../data/dict-a"),
    import("../data/dict-b"),
    import("../data/dict-c"),
    import("../data/dict-d"),
    import("../data/dict-e"),
    import("../data/dict-f"),
    import("../data/dict-g"),
    import("../data/dict-h"),
    import("../data/dict-i"),
    import("../data/dict-j"),
    import("../data/dict-k"),
    import("../data/dict-l"),
  ])
    .then(([a, b, c, d, e2, f, g, h, i2, j, k, l]) => {
      const seen = new Set<string>();
      const out: Entry[] = [];
      for (const e of [
        ...parse(a.DICT_A, "a-"),
        ...parse(b.DICT_B, "b-"),
        ...parse(c.DICT_C, "c-"),
        ...parse(d.DICT_D, "d-"),
        ...parse(e2.DICT_E, "e-"),
        ...parse(f.DICT_F, "f-"),
        ...parse(g.DICT_G, "g-"),
        ...parse(h.DICT_H, "h-"),
        ...parse(i2.DICT_I, "i-"),
        ...parse(j.DICT_J, "j-"),
        ...parse(k.DICT_K, "k-"),
        ...parse(l.DICT_L, "l-"),
      ]) {
        const key = e.w.toLowerCase() + "\u0001" + e.pos;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(e);
      }
      _cache = out.sort((x, y) => x.w.localeCompare(y.w));
      return _cache;
    })
    .catch((err) => {
      _promise = null;
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
  { name: "خانواده و مردم", en: "Family & People", words: ["family", "mother", "father", "brother", "sister", "baby", "child", "aunt", "uncle", "daughter", "son", "friend", "people", "person", "man", "woman", "husband", "wife", "parent", "neighbour"] },
  { name: "خوراکی و نوشیدنی", en: "Food & Drink", words: ["apple", "banana", "bread", "butter", "cake", "carrot", "cheese", "chicken", "chocolate", "coffee", "egg", "fish", "fruit", "juice", "lemon", "meal", "meat", "milk", "onion", "orange", "pepper", "pizza", "potato", "rice", "salad", "salt", "sandwich", "soup", "sugar", "tea", "tomato", "water", "vegetable", "food"] },
  { name: "جانوران", en: "Animals", words: ["animal", "bird", "cat", "cow", "dog", "duck", "elephant", "fish", "horse", "lion", "monkey", "mouse", "pet", "pig", "rabbit", "sheep", "snake", "tiger", "turtle", "wolf"] },
  { name: "بدن و سلامت", en: "Body & Health", words: ["arm", "body", "brain", "ear", "eye", "face", "feet", "finger", "hair", "hand", "head", "heart", "knee", "leg", "lip", "mouth", "neck", "nose", "shoulder", "skin", "stomach", "teeth", "tooth", "doctor", "medicine", "hospital", "sick", "healthy", "ill", "fever", "pain", "health"] },
  { name: "رنگ‌ها", en: "Colours", words: ["black", "blue", "brown", "colour", "gold", "green", "grey", "orange", "pink", "purple", "red", "silver", "white", "yellow"] },
  { name: "زمان و آب‌وهوا", en: "Time & Weather", words: ["afternoon", "autumn", "clock", "cloud", "cold", "day", "evening", "hour", "minute", "month", "morning", "night", "rain", "season", "snow", "spring", "storm", "summer", "sun", "sunny", "time", "today", "tomorrow", "warm", "weather", "week", "wind", "winter", "year", "yesterday", "cloudy"] },
  { name: "خانه و زندگی", en: "Home & Life", words: ["bed", "chair", "computer", "desk", "door", "floor", "garden", "home", "house", "key", "kitchen", "lamp", "room", "sofa", "table", "television", "wall", "window"] },
  { name: "مدرسه و یادگیری", en: "School & Study", words: ["answer", "book", "class", "classroom", "dictionary", "exam", "exercise", "homework", "learn", "lesson", "pen", "pencil", "question", "read", "school", "science", "spell", "student", "study", "teacher", "test", "university", "word", "write"] },
  { name: "شهر و سفر", en: "City & Travel", words: ["airport", "bridge", "bus", "car", "cinema", "city", "hotel", "map", "market", "museum", "park", "plane", "restaurant", "road", "shop", "station", "street", "taxi", "ticket", "town", "train", "travel", "trip", "village"] },
  { name: "احساس و حالت", en: "Feelings", words: ["afraid", "angry", "beautiful", "bored", "boring", "clever", "dangerous", "excited", "funny", "glad", "happy", "hungry", "kind", "lazy", "love", "nervous", "proud", "sad", "scared", "sick", "strong", "surprised", "tired", "weak", "worried"] },
  { name: "شغل و کار", en: "Jobs & Work", words: ["actor", "artist", "bank", "boss", "business", "career", "cook", "doctor", "driver", "engineer", "factory", "farmer", "job", "lawyer", "manager", "nurse", "office", "pilot", "police", "salary", "scientist", "secretary", "shop", "singer", "teacher", "waiter", "work", "worker"] },
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
