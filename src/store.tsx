import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loadBaseEntries } from "./lib/dictionary";
import type { Entry, CEFR } from "./lib/dictionary";
import { newSaved, recordResult } from "./lib/leitner";
import type { SavedWord } from "./lib/leitner";
import { speakWord } from "./lib/enrich";

export type Tab = "dict" | "my" | "add" | "review" | "settings";

export interface Toast { id: number; msg: string; kind: "ok" | "bad" | "info" }

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

const LS_WORDS = "leitner.words.v1";
const LS_IMPORTED = "leitner.imported.v1";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* حافظه پر */ }
}

/**
 * تجزیه‌ی انعطاف‌پذیر فایل واژه — چند فرمت رایج را می‌خواند تا وارد کردن
 * دیکشنری‌های بزرگِ آماده آسان شود:
 *  1) آرایه‌ی JSON:  [{"w":"book","fa":"کتاب","en":"...","ex":"...","ph":"...","lvl":"A1","pos":"n."}]
 *  2) آبجکت JSON:    {"book":"کتاب", "water":"آب"}
 *  3) خطوط متنی:     book - کتاب   |   book: کتاب   |   book = کتاب   |   book<TAB>کتاب
 */
export function parseWordList(text: string): CustomInput[] | null {
  const s = text.trim();
  if (!s) return null;

  // حالت JSON
  if (s.startsWith("{") || s.startsWith("[")) {
    try {
      const data = JSON.parse(s);
      if (Array.isArray(data)) {
        const out: CustomInput[] = [];
        for (const it of data) {
          if (typeof it === "string") {
            const m = it.split(/\s*[-=:\t]\s*/);
            if (m.length >= 2 && m[0].trim()) out.push({ w: m[0].trim(), fa: m.slice(1).join(" ").trim() });
          } else if (it && typeof it === "object" && typeof it.w === "string" && it.w.trim()) {
            out.push({
              w: it.w.trim(),
              fa: typeof it.fa === "string" ? it.fa : "",
              en: typeof it.en === "string" ? it.en : "",
              ex: typeof it.ex === "string" ? it.ex : "",
              ph: typeof it.ph === "string" ? it.ph : "",
              pos: typeof it.pos === "string" ? it.pos : "",
              lvl: it.lvl,
            });
          }
        }
        return out.length ? out : null;
      }
      if (data && typeof data === "object") {
        const out: CustomInput[] = [];
        for (const [k, v] of Object.entries(data)) {
          if (k.trim()) out.push({ w: k.trim(), fa: typeof v === "string" ? v : "" });
        }
        return out.length ? out : null;
      }
    } catch {
      /* JSON نبود — به خطوط متنی می‌افتیم */
    }
  }

  // حالت خطوط متنی
  const out: CustomInput[] = [];
  for (const raw of s.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^([A-Za-z][A-Za-z'’ \-]{0,40}?)\s*[-=:–—]?\s*\t?\s*(.+)$/);
    if (m && m[1].trim() && m[2].trim()) {
      out.push({ w: m[1].trim(), fa: m[2].trim() });
    }
  }
  return out.length ? out : null;
}

export interface CustomInput {
  w: string;
  fa?: string;
  en?: string;
  ex?: string;
  pos?: string;
  ph?: string;
  lvl?: CEFR;
}

interface AppCtx {
  tab: Tab;
  setTab: (t: Tab) => void;
  dictReady: boolean;
  baseCount: number;
  saved: Record<string, SavedWord>;
  isSaved: (w: string) => boolean;
  toggleSave: (e: Entry) => void;
  saveMany: (ws: string[]) => void;
  reviewResult: (w: string, ok: boolean) => void;
  removeSaved: (w: string) => void;
  imported: Entry[];
  allEntries: Entry[];
  baseHeadwords: Set<string>;
  addCustom: (list: CustomInput[], opts: { save: boolean; prefix: string }) => number;
  removeCustom: (w: string) => void;
  importedCount: number;
  detail: Entry | null;
  openDetail: (e: Entry) => void;
  closeDetail: () => void;
  toasts: Toast[];
  toast: (msg: string, kind?: Toast["kind"]) => void;
  online: boolean;
  standalone: boolean;
  installEvt: InstallPromptEvent | null;
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
  speak: (w: string) => void;
  exportDict: () => void;
  importFile: (f: File) => void;
  downloadTemplate: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp خارج از AppProvider");
  return v;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<Tab>("dict");
  const [saved, setSaved] = useState<Record<string, SavedWord>>(() => load(LS_WORDS, {}));
  const [imported, setImported] = useState<Entry[]>(() => load(LS_IMPORTED, [] as Entry[]));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [detail, setDetail] = useState<Entry | null>(null);
  const [installEvt, setInstallEvt] = useState<InstallPromptEvent | null>(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [baseEntries, setBaseEntries] = useState<Entry[]>([]);
  const [dictReady, setDictReady] = useState(false);

  const standalone = useMemo(
    () =>
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true,
    []
  );

  useEffect(() => persist(LS_WORDS, saved), [saved]);
  useEffect(() => persist(LS_IMPORTED, imported), [imported]);

  /* بارگذاری تنبل دیکشنری — پوسته فوراً بالا می‌آید، داده‌ها پشت‌صحنه */
  useEffect(() => {
    let mounted = true;
    loadBaseEntries()
      .then((entries) => {
        if (!mounted) return;
        setBaseEntries(entries);
        setDictReady(true);
      })
      .catch(() => {
        window.setTimeout(() => {
          if (!mounted) return;
          loadBaseEntries().then((entries) => {
            if (!mounted) return;
            setBaseEntries(entries);
            setDictReady(true);
          });
        }, 2500);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  /* کش کامل برنامه در service worker — بعد از اولین بار، آفلاین کامل */
  useEffect(() => {
    const send = () => {
      if (!("serviceWorker" in navigator)) return;
      navigator.serviceWorker.ready.then((reg) => {
        const urls = performance
          .getEntriesByType("resource")
          .map((r) => r.name)
          .filter((u) => u.startsWith(location.origin))
          .concat([location.href]);
        reg.active?.postMessage({ type: "PRECACHE", urls: [...new Set(urls)] });
      });
    };
    const t = window.setTimeout(send, 2000);
    return () => window.clearTimeout(t);
  }, []);

  const toast = useCallback((msg: string, kind: Toast["kind"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, msg, kind }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 3200);
  }, []);

  const isSaved = useCallback((w: string) => Boolean(saved[w]), [saved]);

  const toggleSave = useCallback(
    (e: Entry) => {
      setSaved((s) => {
        const n = { ...s };
        if (n[e.w]) {
          delete n[e.w];
          toast(`«${e.w}» از مجموعه حذف شد`, "info");
        } else {
          n[e.w] = newSaved(e.w);
          toast(`«${e.w}» به مجموعه اضافه شد — مرور از فردا`, "ok");
        }
        return n;
      });
    },
    [toast]
  );

  const saveMany = useCallback((ws: string[]) => {
    setSaved((s) => {
      const n = { ...s };
      for (const w of ws) if (!n[w]) n[w] = newSaved(w);
      return n;
    });
  }, []);

  const reviewResult = useCallback((w: string, ok: boolean) => {
    setSaved((s) => {
      const cur = s[w];
      if (!cur) return s;
      return { ...s, [w]: recordResult(cur, ok) };
    });
  }, []);

  const removeSaved = useCallback((w: string) => {
    setSaved((s) => {
      const n = { ...s };
      delete n[w];
      return n;
    });
  }, []);

  const allEntries = useMemo(() => [...baseEntries, ...imported], [baseEntries, imported]);
  const baseHeadwords = useMemo(
    () => new Set(baseEntries.map((e) => e.w.toLowerCase())),
    [baseEntries]
  );

  const addCustom = useCallback(
    (list: CustomInput[], opts: { save: boolean; prefix: string }): number => {
      const seen = new Set([
        ...baseEntries.map((e) => e.w.toLowerCase()),
        ...imported.map((e) => e.w.toLowerCase()),
      ]);
      const fresh: Entry[] = [];
      list.forEach((o, i) => {
        const key = o.w.trim().toLowerCase();
        if (!key || key.length < 2 || seen.has(key)) return;
        seen.add(key);
        fresh.push({
          id: `${opts.prefix}-${Date.now()}-${i}-${key}`,
          w: o.w.trim(),
          pos: o.pos ?? "",
          en: o.en ?? "",
          fa: o.fa ?? "",
          ex: o.ex || undefined,
          ph: o.ph ?? "",
          lvl: o.lvl ?? "B1",
        });
      });
      if (fresh.length > 0) {
        setImported((prev) => [...prev, ...fresh]);
        if (opts.save) saveMany(fresh.map((e) => e.w));
      }
      return fresh.length;
    },
    [baseEntries, imported, saveMany]
  );

  const removeCustom = useCallback((w: string) => {
    setImported((prev) => prev.filter((e) => e.w !== w));
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installEvt) return "unavailable" as const;
    installEvt.prompt();
    const r = await installEvt.userChoice;
    if (r.outcome === "accepted") {
      setInstallEvt(null);
      return "accepted" as const;
    }
    return "dismissed" as const;
  }, [installEvt]);

  const speak = useCallback((w: string) => {
    speakWord(w, () => {
      try {
        const u = new SpeechSynthesisUtterance(w);
        u.lang = "en-US";
        u.rate = 0.92;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      } catch { /* تلفظ در دسترس نیست */ }
    });
  }, []);

  const exportDict = useCallback(() => {
    const data = allEntries.map((e) => ({
      w: e.w, pos: e.pos, en: e.en, fa: e.fa, ex: e.ex ?? "", ph: e.ph, lvl: e.lvl,
    }));
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dictionary-english-fa.json";
    a.click();
    URL.revokeObjectURL(url);
    toast("فایل فرهنگ لغت دانلود شد", "ok");
  }, [allEntries, toast]);

  const downloadTemplate = useCallback(() => {
    const sample = [
      { w: "book", fa: "کتاب", en: "a set of written pages", ex: "I read a book.", ph: "/bʊk/", lvl: "A1", pos: "n." },
      { w: "water", fa: "آب", en: "a clear liquid", ex: "Drink some water.", ph: "/ˈwɔːtə/", lvl: "A1", pos: "n." },
      { w: "run", fa: "دویدن", en: "to move fast on foot", ex: "I run every morning.", ph: "/rʌn/", lvl: "A1", pos: "v." },
    ];
    const blob = new Blob([JSON.stringify(sample, null, 1)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "word-list-template.json";
    a.click();
    URL.revokeObjectURL(url);
    toast("فایل نمونه دانلود شد — آن را پر کنید و دوباره وارد کنید", "ok");
  }, [toast]);

  const importFile = useCallback(
    (f: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const list = parseWordList(String(reader.result));
        if (!list) {
          toast("فرمت فایل شناخته نشد. از JSON یا خطوط «word - معنی» استفاده کنید", "bad");
          return;
        }
        const n = addCustom(list, { save: false, prefix: "file" });
        toast(n > 0 ? `${n} واژه از فایل وارد شد و آفلاین ذخیره شد` : "واژه‌ی جدیدی در فایل نبود", n > 0 ? "ok" : "info");
      };
      reader.readAsText(f);
    },
    [addCustom, toast]
  );

  const value: AppCtx = {
    tab, setTab, dictReady, baseCount: baseEntries.length,
    saved, isSaved, toggleSave, saveMany, reviewResult, removeSaved,
    imported, allEntries, baseHeadwords, addCustom, removeCustom,
    importedCount: imported.length,
    detail, openDetail: (e) => setDetail(e), closeDetail: () => setDetail(null),
    toasts, toast,
    online, standalone, installEvt, promptInstall,
    speak, exportDict, importFile, downloadTemplate,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
