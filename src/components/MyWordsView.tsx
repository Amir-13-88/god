import { useMemo, useState } from "react";
import Icon from "./icons";
import { useApp } from "../store";
import { INTERVALS, BOX_COLORS, BOX_NAMES, isDue, isMastered, dueLabel, faNum } from "../lib/leitner";
import { WordRow, EmptyState, StatCard, SaveButton } from "./ui";
import { CEFR_INFO } from "../lib/dictionary";
import type { CEFR } from "../lib/dictionary";

type Filter = "all" | "due" | "mastered" | number;

export default function MyWordsView() {
  const { saved, allEntries, setTab } = useApp();
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => Object.values(saved), [saved]);
  const entryOf = useMemo(() => {
    const m = new Map<string, (typeof allEntries)[number]>();
    for (const e of allEntries) if (!m.has(e.w)) m.set(e.w, e);
    return m;
  }, [allEntries]);

  const dueCount = list.filter((s) => isDue(s)).length;
  const masteredCount = list.filter(isMastered).length;
  const boxCounts = useMemo(() => {
    const c = [0, 0, 0, 0, 0, 0, 0];
    for (const s of list) if (s.box <= 6) c[s.box]++;
    return c;
  }, [list]);
  const maxBox = Math.max(1, ...boxCounts);

  const levelCounts = useMemo(() => {
    const c: Record<CEFR, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
    for (const s of list) {
      const e = entryOf.get(s.w);
      if (e) c[e.lvl] = (c[e.lvl] ?? 0) + 1;
    }
    return c;
  }, [list, entryOf]);
  const maxLvl = Math.max(1, ...Object.values(levelCounts));

  const filtered = useMemo(() => {
    let r = list;
    if (filter === "due") r = r.filter((s) => isDue(s));
    else if (filter === "mastered") r = r.filter(isMastered);
    else if (typeof filter === "number") r = r.filter((s) => s.box === filter);
    return [...r].sort((a, b) => {
      const am = isMastered(a) ? 1 : 0;
      const bm = isMastered(b) ? 1 : 0;
      if (am !== bm) return am - bm;
      return a.due - b.due;
    });
  }, [list, filter]);

  if (list.length === 0) {
    return (
      <EmptyState
        icon="cards"
        title="مجموعه‌ی شما خالی است"
        desc="واژه‌ها را در فرهنگ لغت پیدا کنید و با دکمه‌ی «+» به مجموعه‌ی شخصی خود اضافه کنید تا مرور لایتنر برایشان برنامه‌ریزی شود."
        action={
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            <button
              onClick={() => setTab("dict")}
              className="bg-gold text-oxford-deep font-bold text-[13.5px] rounded-full px-6 py-3 hover:bg-[#f0b254] transition-all active:scale-95 shadow-lg shadow-gold/30"
            >
              رفتن به فرهنگ لغت
            </button>
            <button
              onClick={() => setTab("add")}
              className="bg-card border-2 border-oxford-mid/40 text-oxford font-bold text-[13.5px] rounded-full px-6 py-3 hover:bg-oxford-soft transition-all active:scale-95"
            >
              افزودن واژه‌ی خودم
            </button>
          </div>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard label="واژه‌ی من" value={list.length} icon="cards" tone="#0b2e52" />
        <StatCard label="مرور امروز" value={dueCount} icon="clock" tone="#d98a2b" />
        <StatCard label="یادگرفته" value={masteredCount} icon="star" tone="#178a55" />
      </div>

      {/* نردبان لایتنر */}
      <section className="anim-rise bg-card border border-line rounded-xl p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="font-display text-lg text-oxford">نردبان لایتنر</h2>
          <span className="text-[11px] text-mute font-bold">فاصله‌های مرور: ۱، ۳، ۷، ۲۱، ۳۰ و ۹۰ روز</span>
        </div>
        <div className="space-y-1.5">
          {[0, 1, 2, 3, 4, 5, 6].map((b) => (
            <button
              key={b}
              onClick={() => setFilter(filter === b ? "all" : b)}
              className={`w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all ${
                filter === b ? "bg-oxford-soft ring-2 ring-oxford-mid/40" : "hover:bg-paper"
              }`}
            >
              <span className="w-14 shrink-0 text-start text-[11.5px] font-bold text-ink">{BOX_NAMES[b]}</span>
              <span className="flex-1 h-5 bg-paper rounded-md overflow-hidden">
                <span
                  className="block h-full rounded-md bar-grow"
                  style={{ width: `${(boxCounts[b] / maxBox) * 100}%`, backgroundColor: BOX_COLORS[b], animationDelay: `${b * 60}ms` }}
                />
              </span>
              <span className="w-8 shrink-0 text-end text-[12px] font-bold font-latin text-mute" dir="ltr">
                {boxCounts[b]}
              </span>
              <span className="w-14 shrink-0 text-[10px] text-mute">
                {b < 6 ? `${faNum(INTERVALS[b])} روز` : "آخرین"}
              </span>
            </button>
          ))}
          {masteredCount > 0 && (
            <button
              onClick={() => setFilter(filter === "mastered" ? "all" : "mastered")}
              className={`w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all ${
                filter === "mastered" ? "bg-ok-soft ring-2 ring-ok/40" : "hover:bg-paper"
              }`}
            >
              <span className="w-14 shrink-0 text-start text-[11.5px] font-bold text-ok">یادگرفته</span>
              <span className="flex-1 h-5 bg-paper rounded-md overflow-hidden">
                <span className="block h-full rounded-md bar-grow bg-ok" style={{ width: `${(masteredCount / maxBox) * 100}%` }} />
              </span>
              <span className="w-8 shrink-0 text-end text-[12px] font-bold font-latin text-ok" dir="ltr">
                {masteredCount}
              </span>
              <span className="w-14 shrink-0 text-[10px] text-ok font-bold">پایان مسیر</span>
            </button>
          )}
        </div>
      </section>

      {/* نمودار سطح */}
      {list.length > 0 && (
        <section className="anim-rise bg-card border border-line rounded-xl p-4">
          <h2 className="font-display text-lg text-oxford mb-3">سطح واژه‌های شما</h2>
          <div className="flex items-end gap-2" dir="ltr">
            {(Object.keys(levelCounts) as CEFR[]).map((l) => (
              <div key={l} className="flex-1 text-center">
                <div className="text-[11px] font-bold font-latin text-ink mb-1">{levelCounts[l]}</div>
                <div className="h-16 bg-paper rounded-t-lg overflow-hidden flex items-end">
                  <div
                    className="w-full rounded-t-lg bar-grow"
                    style={{ height: `${(levelCounts[l] / maxLvl) * 100}%`, backgroundColor: CEFR_INFO[l].color, animationDelay: "120ms" }}
                  />
                </div>
                <div className="font-latin text-[11px] font-bold mt-1" style={{ color: CEFR_INFO[l].color }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* فیلتر سریع */}
      <div className="flex gap-2 flex-wrap">
        {(
          [
            ["all", `همه (${faNum(list.length)})`],
            ["due", `آماده مرور (${faNum(dueCount)})`],
            ["mastered", `یادگرفته (${faNum(masteredCount)})`],
          ] as [Filter, string][]
        ).map(([f, label]) => (
          <button
            key={String(f)}
            onClick={() => setFilter(f)}
            className={`text-[12px] font-bold rounded-full px-3.5 py-1.5 border-2 transition-all active:scale-95 ${
              filter === f ? "bg-oxford text-white border-oxford" : "bg-card border-line text-ink hover:border-oxford-mid/50"
            }`}
          >
            {label}
          </button>
        ))}
        {dueCount > 0 && (
          <button
            onClick={() => setTab("review")}
            className="ms-auto text-[12px] font-bold rounded-full px-4 py-1.5 bg-gold text-oxford-deep hover:bg-[#f0b254] transition-all active:scale-95 flex items-center gap-1.5"
          >
            شروع مرور
            <Icon name="chevL" className="w-3.5 h-3.5" strokeWidth={2.6} />
          </button>
        )}
      </div>

      {/* فهرست */}
      {filtered.length === 0 ? (
        <p className="text-center text-mute text-[13px] py-8">در این بخش واژه‌ای نیست.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((s, i) => {
            const e = entryOf.get(s.w);
            if (!e) return null;
            return (
              <WordRow
                key={s.w}
                entry={e}
                saved={s}
                delay={i * 20}
                trailing={
                  <span
                    className={`hidden sm:inline text-[10.5px] font-bold rounded-full px-2 py-1 ${
                      isDue(s) ? "bg-gold-soft text-gold-deep" : isMastered(s) ? "bg-ok-soft text-ok" : "bg-paper text-mute"
                    }`}
                  >
                    {dueLabel(s)}
                  </span>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
