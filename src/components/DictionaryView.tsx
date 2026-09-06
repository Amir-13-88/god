import { useMemo, useState } from "react";
import Icon from "./icons";
import { useApp } from "../store";
import {
  searchEntries, entriesForLetter, entriesForCategory,
  LETTERS, CATEGORIES, CEFR_ORDER, CEFR_INFO,
} from "../lib/dictionary";
import type { CEFR } from "../lib/dictionary";
import { faNum } from "../lib/leitner";
import { SearchBox, WordRow, EmptyState, LevelChip } from "./ui";

const PAGE = 40;

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      <div className="bg-gold-soft/70 border-2 border-gold/30 rounded-xl px-4 py-3 flex items-center gap-3 anim-rise">
        <span className="w-5 h-5 rounded-full border-2 border-gold border-t-transparent animate-spin shrink-0" />
        <span className="text-[13px] font-bold text-gold-deep">در حال آماده‌سازی دیکشنری… پوسته‌ی برنامه همین حالا آماده است.</span>
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-card border-2 border-line rounded-xl px-4 py-3.5 animate-pulse" style={{ animationDelay: `${i * 120}ms` }}>
          <div className="h-4 bg-paper rounded w-1/3 mb-2" />
          <div className="h-3 bg-paper rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}

export default function DictionaryView() {
  const { allEntries, saved, setTab, dictReady } = useApp();
  const [q, setQ] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [cat, setCat] = useState<string | null>(null);
  const [lvl, setLvl] = useState<CEFR | "all">("all");
  const [limit, setLimit] = useState(PAGE);

  const wordOfTheDay = useMemo(() => {
    if (allEntries.length === 0) return null;
    const d = new Date();
    return allEntries[(d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % allEntries.length];
  }, [allEntries]);

  const results = useMemo(() => {
    let r: typeof allEntries;
    if (q.trim()) r = searchEntries(q, allEntries);
    else if (cat) {
      const c = CATEGORIES.find((x) => x.name === cat);
      r = c ? entriesForCategory(c, allEntries) : [];
    } else if (letter) r = entriesForLetter(letter, allEntries);
    else r = allEntries;
    if (lvl !== "all") r = r.filter((e) => e.lvl === lvl);
    return r;
  }, [q, cat, letter, lvl, allEntries]);

  const selectLetter = (l: string) => {
    setLetter(letter === l ? null : l);
    setCat(null);
    setQ("");
    setLimit(PAGE);
  };

  const selectCat = (c: string) => {
    setCat(cat === c ? null : c);
    setLetter(null);
    setQ("");
    setLimit(PAGE);
  };

  if (!dictReady) return <LoadingSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex items-stretch gap-2">
        <div className="flex-1">
          <SearchBox value={q} onChange={(v) => { setQ(v); setLimit(PAGE); }} placeholder="جست‌وجوی واژه یا معنی فارسی…" />
        </div>
      </div>

      {/* فیلتر سطح CEFR */}
      <div className="flex gap-1.5 flex-wrap items-center">
        <span className="text-[11px] font-bold text-mute ms-1">سطح:</span>
        <button
          onClick={() => setLvl("all")}
          className={`text-[11.5px] font-bold rounded-full px-3 py-1.5 border-2 transition-all active:scale-95 ${
            lvl === "all" ? "bg-oxford text-white border-oxford" : "bg-card border-line text-ink hover:border-oxford-mid/50"
          }`}
        >
          همه
        </button>
        {CEFR_ORDER.map((l) => (
          <button
            key={l}
            onClick={() => setLvl(lvl === l ? "all" : l)}
            className={`font-latin text-[11.5px] font-bold rounded-full px-3 py-1.5 border-2 transition-all active:scale-95 ${
              lvl === l ? "text-white border-transparent" : "bg-card border-line text-mute hover:border-mute/50"
            }`}
            style={lvl === l ? { backgroundColor: CEFR_INFO[l].color } : undefined}
          >
            {l}
          </button>
        ))}
      </div>

      {/* واژه‌ی امروز */}
      {wordOfTheDay && !q.trim() && !cat && !letter && (
        <section
          className="anim-rise relative overflow-hidden rounded-2xl bg-oxford-deep text-white p-5"
          style={{
            backgroundImage:
              "radial-gradient(26rem 12rem at 110% -20%, rgba(232,163,61,0.28), transparent 70%), repeating-linear-gradient(-45deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 12px)",
          }}
        >
          <span className="drift-letter text-7xl" style={{ top: "-14px", left: "8px", animationDelay: "0.5s" }}>A</span>
          <span className="drift-letter text-5xl" style={{ bottom: "-6px", left: "80px", animationDelay: "2s" }}>b</span>
          <div className="flex items-start justify-between gap-3 relative">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-bold text-gold mb-2">
                <Icon name="sparkle" className="w-4 h-4" />
                واژه‌ی امروز
                <LevelChip lvl={wordOfTheDay.lvl} />
              </div>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="ltr-i font-latin font-black text-3xl text-white">{wordOfTheDay.w}</span>
                {wordOfTheDay.ph && <span className="ltr-i font-latin text-[14px] text-gold/90 font-semibold">{wordOfTheDay.ph}</span>}
              </div>
              <div className="text-[14.5px] font-bold mt-1">{wordOfTheDay.fa}</div>
              {wordOfTheDay.ex && <div className="ltr text-[12px] font-latin italic text-white/60 mt-1 truncate">{wordOfTheDay.ex}</div>}
            </div>
            <WordOfDayActions />
          </div>
        </section>
      )}

      {/* دسته‌ها */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.name}
            onClick={() => selectCat(c.name)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-[12px] font-bold border-2 transition-all active:scale-95 ${
              cat === c.name
                ? "bg-oxford text-white border-oxford shadow-md shadow-oxford/25"
                : "bg-card border-line text-ink hover:border-oxford-mid/50"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* حروف الفبا */}
      <div className="bg-card border-2 border-line rounded-xl p-2">
        <div className="flex gap-1 overflow-x-auto no-scrollbar" dir="ltr">
          {LETTERS.map((l) => (
            <button
              key={l}
              onClick={() => selectLetter(l)}
              className={`shrink-0 w-8 h-8 rounded-lg font-latin font-bold text-[13.5px] transition-all active:scale-90 ${
                letter === l ? "bg-gold text-oxford-deep shadow-md shadow-gold/40" : "text-oxford hover:bg-oxford-soft"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* شمارنده */}
      <div className="flex items-center justify-between text-[12px] font-bold text-mute px-1">
        <span>
          {q.trim() ? "نتیجه‌های جست‌وجو" : letter ? `واژه‌های حرف ${letter}` : cat ? `دسته‌ی ${cat}` : "همه‌ی واژه‌ها"}
        </span>
        <span className="flex items-center gap-2">
          <span className="bg-ok-soft text-ok rounded-full px-2.5 py-0.5 text-[10.5px] flex items-center gap-1">
            <Icon name="wifi" className="w-3 h-3" strokeWidth={2.6} />
            {faNum(allEntries.length)} واژه آفلاین
          </span>
          <span>{faNum(results.length)} نتیجه</span>
        </span>
      </div>

      {/* نتایج */}
      {results.length === 0 ? (
        <EmptyState
          icon="search"
          title="چیزی پیدا نشد"
          desc="املای انگلیسی را چک کنید یا معنی فارسی را جست‌وجو کنید."
          action={
            <button
              onClick={() => setTab("add")}
              className="bg-gold text-oxford-deep font-bold text-[12.5px] rounded-full px-5 py-2.5 hover:bg-[#f0b254] transition-all active:scale-95 flex items-center gap-1.5 mx-auto"
            >
              <Icon name="plus" className="w-4 h-4" strokeWidth={2.6} />
              افزودن دستی این واژه
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {results.slice(0, limit).map((e, i) => (
            <WordRow key={e.id} entry={e} saved={saved[e.w]} delay={i * 25} />
          ))}
          {results.length > limit && (
            <button
              onClick={() => setLimit((l) => l + PAGE)}
              className="w-full bg-card border-2 border-line hover:border-gold rounded-xl py-3 font-bold text-[13px] text-oxford-mid transition-all active:scale-[0.98]"
            >
              نمایش {faNum(Math.min(PAGE, results.length - limit))} واژه‌ی دیگر از {faNum(results.length - limit)}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* اکشن‌های واژه‌ی امروز — جدا تا هوک‌ها شرطی نشوند */
function WordOfDayActions() {
  const { openDetail, speak, detail } = useApp();
  const { allEntries } = useApp();
  const w = useMemo(() => {
    if (allEntries.length === 0) return null;
    const d = new Date();
    return allEntries[(d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % allEntries.length];
  }, [allEntries]);
  if (!w) return null;
  void detail;
  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => speak(w.w)}
        className="w-10 h-10 rounded-full bg-white/10 border border-white/20 grid place-items-center text-gold hover:bg-white/20 active:scale-90 transition-all"
        aria-label="تلفظ"
      >
        <Icon name="speaker" className="w-5 h-5" />
      </button>
      <button
        onClick={() => openDetail(w)}
        className="h-10 px-4 rounded-full bg-gold text-oxford-deep font-bold text-[12.5px] hover:bg-[#f0b254] active:scale-95 transition-all"
      >
        جزئیات
      </button>
    </div>
  );
}

