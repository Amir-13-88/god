import { useMemo, useState } from "react";
import Icon from "./icons";
import { useApp } from "../store";
import {
  LETTERS, CATEGORIES, CEFR_ORDER,
  searchEntries, entriesForLetter, entriesForCategory,
} from "../lib/dictionary";
import type { CEFR, Entry } from "../lib/dictionary";
import { faNum } from "../lib/leitner";
import { SearchBox, WordRow, LevelChip } from "./ui";

const PAGE = 40;

export default function DictionaryView() {
  const { allEntries, dictReady, saved, openDetail, setTab } = useApp();
  const [q, setQ] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [cat, setCat] = useState<string | null>(null);
  const [lvl, setLvl] = useState<CEFR | "all">("all");
  const [limit, setLimit] = useState(PAGE);

  const results = useMemo(() => {
    let r: Entry[];
    if (q.trim()) r = searchEntries(q, allEntries);
    else if (cat) {
      const c = CATEGORIES.find((x) => x.name === cat);
      r = c ? entriesForCategory(c, allEntries) : [];
    } else if (letter) r = entriesForLetter(letter, allEntries);
    else r = allEntries;
    if (lvl !== "all") r = r.filter((e) => e.lvl === lvl);
    return r;
  }, [q, cat, letter, lvl, allEntries]);

  const wordOfTheDay = useMemo(() => {
    if (allEntries.length === 0) return null;
    const day = Math.floor(Date.now() / 86400000);
    return allEntries[day % allEntries.length];
  }, [allEntries]);

  const selectLetter = (l: string) => {
    setLetter((prev) => (prev === l ? null : l));
    setCat(null);
    setLimit(PAGE);
  };
  const selectCat = (c: string) => {
    setCat((prev) => (prev === c ? null : c));
    setLetter(null);
    setLimit(PAGE);
  };

  /* در حال بارگذاری دیکشنری — اسکلتون نشان بده، نه صفحه خالی */
  if (!dictReady) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-13" />
        <div className="flex gap-2 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-8 w-16 shrink-0" />
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-20" />
        ))}
        <p className="text-center text-[12.5px] text-mute font-bold pt-2">در حال آماده‌سازی فرهنگ لغت…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchBox value={q} onChange={(v) => { setQ(v); setLimit(PAGE); }} placeholder="جست‌وجوی واژه یا معنی فارسی…" />

      {/* فیلتر سطح */}
      <div className="flex gap-1.5 flex-wrap items-center">
        <span className="text-[11px] font-bold text-mute me-1">سطح:</span>
        {(["all", ...CEFR_ORDER] as (CEFR | "all")[]).map((l) => (
          <button
            key={l}
            onClick={() => setLvl(l)}
            className={`font-latin font-bold text-[11px] rounded-full px-3 py-1 border-2 transition-all active:scale-95 ${
              lvl === l ? "bg-oxford text-white border-oxford" : "bg-card border-line text-mute hover:border-oxford-mid/50"
            }`}
          >
            {l === "all" ? "همه" : l}
          </button>
        ))}
      </div>

      {/* حروف الفبا */}
      {!q.trim() && !cat && (
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1" dir="ltr">
          {LETTERS.map((l) => (
            <button
              key={l}
              onClick={() => selectLetter(l)}
              className={`shrink-0 w-8 h-8 rounded-lg font-latin font-bold text-[13.5px] transition-all active:scale-90 ${
                letter === l ? "bg-gold text-oxford-deep shadow-md" : "bg-card border border-line text-oxford hover:border-gold"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* دسته‌های موضوعی */}
      {!q.trim() && !letter && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => selectCat(c.name)}
              className={`shrink-0 text-[12px] font-bold rounded-full px-3.5 py-2 border-2 transition-all active:scale-95 ${
                cat === c.name ? "bg-oxford text-white border-oxford" : "bg-card border-line text-ink hover:border-oxford-mid/50"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* واژه‌ی امروز */}
      {wordOfTheDay && !q.trim() && !cat && !letter && (
        <div
          className="anim-rise rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer"
          onClick={() => openDetail(wordOfTheDay)}
          style={{
            background: "linear-gradient(120deg,#0b2e52,#1c4a7e 60%,#0b2e52)",
            backgroundImage:
              "radial-gradient(24rem 10rem at 90% 0%, rgba(232,163,61,0.3), transparent 70%), linear-gradient(120deg,#0b2e52,#1c4a7e 60%,#0b2e52)",
          }}
        >
          <div className="text-[11px] font-bold text-gold flex items-center gap-1.5 mb-2">
            <Icon name="sparkle" className="w-4 h-4" />
            واژه‌ی امروز
          </div>
          <button onClick={(e) => { e.stopPropagation(); openDetail(wordOfTheDay); }} className="block text-start group">
            <span className="ltr-i font-latin font-black text-3xl text-white group-hover:text-gold transition-colors">
              {wordOfTheDay.w}
            </span>
          </button>
          <div className="flex items-center gap-2 mt-1.5">
            {wordOfTheDay.ph && (
              <span className="ltr-i font-latin text-[14px] text-gold/90 font-semibold">{wordOfTheDay.ph}</span>
            )}
            <LevelChip lvl={wordOfTheDay.lvl} />
          </div>
          <div className="text-[14.5px] font-bold mt-1">{wordOfTheDay.fa}</div>
        </div>
      )}

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
        <div className="bg-card border-2 border-dashed border-line rounded-2xl px-6 py-12 text-center anim-rise">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-paper text-mute grid place-items-center mb-3">
            <Icon name="search" className="w-7 h-7" strokeWidth={1.8} />
          </div>
          <p className="font-bold text-ink mb-1">چیزی پیدا نشد</p>
          <p className="text-[12.5px] text-mute leading-6 max-w-xs mx-auto">
            املای انگلیسی را چک کنید یا معنی فارسی را جست‌وجو کنید.
          </p>
          <button
            onClick={() => setTab("add")}
            className="mt-4 bg-gold text-oxford-deep font-bold text-[12.5px] rounded-full px-5 py-2.5 hover:bg-[#f0b254] transition-all active:scale-95 inline-flex items-center gap-1.5"
          >
            <Icon name="plus" className="w-4 h-4" strokeWidth={2.6} />
            افزودن دستی این واژه
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {results.slice(0, limit).map((e, i) => (
              <WordRow key={e.id} entry={e} saved={saved[e.w]} delay={i * 15} />
            ))}
          </div>
          {results.length > limit && (
            <button
              onClick={() => setLimit((l) => l + PAGE)}
              className="w-full bg-card border-2 border-line rounded-xl py-3 text-[13px] font-bold text-oxford hover:border-oxford-mid/50 transition-all active:scale-[0.98]"
            >
              نمایش {faNum(Math.min(PAGE, results.length - limit))} واژه‌ی دیگر ({faNum(results.length - limit)} باقی‌مانده)
            </button>
          )}
        </>
      )}
    </div>
  );
}
