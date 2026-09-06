import { useMemo, useState } from "react";
import Icon from "./icons";
import { useApp } from "../store";
import { INTERVALS, BOX_COLORS, BOX_NAMES, isDue, isMastered, dueLabel, faNum } from "../lib/leitner";
import type { CEFR } from "../lib/dictionary";
import { CEFR_INFO, CEFR_ORDER } from "../lib/dictionary";
import { WordRow, EmptyState, StatCard, SaveButton } from "./ui";

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
  const maxLevel = Math.max(1, ...CEFR_ORDER.map((l) => levelCounts[l]));

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
        desc="واژه‌ها را در دیکشنری پیدا کنید و با دکمه‌ی «+» به مجموعه‌ی شخصی خود اضافه کنید تا مرور لایتنر برایشان برنامه‌ریزی شود."
        action={
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            <button
              onClick={() => setTab("dict")}
              className="bg-gold text-oxford-deep font-bold text-[13.5px] rounded-full px-6 py-3 hover:bg-[#f0b254] transition-all active:scale-95 shadow-lg shadow-gold/30"
            >
              رفتن به دیکشنری
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
      <section className="anim-rise bg-card border-2 border-line rounded-xl p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
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
              <span className="w-8 shrink-0 text-end text-[12px] font-bold font-latin text-mute" dir="ltr">{boxCounts[b]}</span>
              <span className="w-14 shrink-0 text-[10px] text-mute">{b < 6 ? `${faNum(INTERVALS[b])} روز` : "آخرین"}</span>
            </button>
          ))}
        </div>
      </section>

      {/* پخش سطح */}
      <section className="anim-rise bg-card border-2 border-line rounded-xl p-4">
        <h2 className="font-display text-lg text-oxford mb-3">سطح واژه‌های شما (CEFR)</h2>
        <div className="flex gap-2 items-end" dir="ltr">
          {CEFR_ORDER.map((l, i) => (
            <div key={l} className="flex-1 text-center">
              <div className="h-20 bg-paper rounded-lg flex items-end overflow-hidden">
                <div
                  className="w-full rounded-lg bar-grow"
                  style={{
                    height: `${(levelCounts[l] / maxLevel) * 100}%`,
                    backgroundColor: CEFR_INFO[l].color,
                    animationDelay: `${i * 80}ms`,
                    minHeight: levelCounts[l] > 0 ? "8px" : "0",
                  }}
                />
              </div>
              <div className="font-latin font-bold text-[11px] mt-1.5" style={{ color: CEFR_INFO[l].color }}>{l}</div>
              <div className="text-[11px] font-bold text-ink">{faNum(levelCounts[l])}</div>
            </div>
          ))}
        </div>
      </section>

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
                    className={`hidden sm:inline text-[10.5px] font-bold rounded-full px-2 py-1 shrink-0 ${
                      isDue(s) ? "bg-gold-soft text-gold-deep" : isMastered(s) ? "bg-ok-soft text-ok" : "bg-paper text-mute"
                    }`}
                  >
                    {dueLabel(s)}
                  </span>
                }
              />
            );
          })}
          {filtered.map((s) => {
            const e = entryOf.get(s.w);
            if (e) return null;
            return (
              <div key={s.w} className="bg-card border-2 border-line rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <span className="ltr-i font-latin font-bold text-[16px] text-oxford">{s.w}</span>
                  <span className="block text-[11px] text-mute">واژه‌ی دستی — در دیکشنری پایه نیست</span>
                </div>
                <SaveButton entry={{ id: s.w, w: s.w, pos: "", en: "", fa: "", ph: "", lvl: "B1" }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
