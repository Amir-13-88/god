import { useMemo, useState } from "react";
import Icon from "./icons";
import { useApp } from "../store";
import { isDue, isMastered, faNum, INTERVALS } from "../lib/leitner";
import { EmptyState, StatCard, LevelChip } from "./ui";

export default function ReviewView() {
  const { saved, allEntries, reviewResult, setTab, speak, toast } = useApp();
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState<{ done: number; ok: number } | null>(null);

  const entryOf = useMemo(() => {
    const m = new Map<string, (typeof allEntries)[number]>();
    for (const e of allEntries) if (!m.has(e.w)) m.set(e.w, e);
    return m;
  }, [allEntries]);

  const due = useMemo(() => Object.values(saved).filter((s) => isDue(s)).sort((a, b) => a.due - b.due), [saved]);
  const masteredCount = useMemo(() => Object.values(saved).filter(isMastered).length, [saved]);
  const learned = useMemo(() => Object.values(saved).filter((s) => s.box > 0).length, [saved]);

  const current = due[0];
  const e = current ? entryOf.get(current.w) : undefined;

  const answer = (ok: boolean) => {
    if (!current) return;
    reviewResult(current.w, ok);
    setFlipped(false);
    setStats((s) => ({ done: (s?.done ?? 0) + 1, ok: (s?.ok ?? 0) + (ok ? 1 : 0) }));
  };

  const finish = () => {
    if (stats && stats.done > 0) {
      const pct = Math.round((stats.ok / stats.done) * 100);
      toast(`مرور تمام شد — دقت ${faNum(pct)}٪`, pct >= 70 ? "ok" : "info");
    }
    setStats(null);
  };

  if (Object.values(saved).length === 0) {
    return (
      <EmptyState
        icon="repeat"
        title="مروری وجود ندارد"
        desc="اول چند واژه را به مجموعه‌ی خود اضافه کنید تا مرور لایتنر در فاصله‌های ۱، ۳، ۷، ۲۱، ۳۰ و ۹۰ روز برایشان برنامه‌ریزی شود."
        action={
          <button
            onClick={() => setTab("dict")}
            className="bg-gold text-oxford-deep font-bold text-[13.5px] rounded-full px-6 py-3 hover:bg-[#f0b254] transition-all active:scale-95 shadow-lg shadow-gold/30"
          >
            رفتن به فرهنگ لغت
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard label="آماده مرور" value={due.length} icon="clock" tone="#d98a2b" />
        <StatCard label="در مسیر یادگیری" value={learned} icon="layers" tone="#0b2e52" />
        <StatCard label="یادگرفته" value={masteredCount} icon="star" tone="#178a55" />
      </div>

      {!current || !e ? (
        <div className="bg-card border-2 border-line rounded-2xl px-6 py-14 text-center anim-pop">
          <div className="mx-auto w-16 h-16 rounded-full bg-ok-soft text-ok grid place-items-center mb-4">
            <Icon name="check" className="w-8 h-8" strokeWidth={2.4} />
          </div>
          <h3 className="font-display text-2xl text-oxford mb-2">آفرین! مرور امروز کامل شد 🎉</h3>
          <p className="text-[13px] text-mute leading-7 max-w-sm mx-auto mb-5">
            {stats && stats.done > 0
              ? `${faNum(stats.done)} واژه مرور شد و دقت شما ${faNum(Math.round((stats.ok / stats.done) * 100))}٪ بود.`
              : "هیچ واژه‌ای برای مرور نمانده. فرد دوباره سر بزنید تا واژه‌های بعدی آماده شوند."}
          </p>
          {stats && stats.done > 0 && (
            <button
              onClick={finish}
              className="bg-gold text-oxford-deep font-bold text-[13.5px] rounded-full px-6 py-3 hover:bg-[#f0b254] transition-all active:scale-95"
            >
              بستن گزارش
            </button>
          )}
        </div>
      ) : (
        <div className="persp">
          <div className={`flip-inner ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((f) => !f)}>
            {/* روی کارت */}
            <div className="flip-face min-h-[380px] bg-card border-2 border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer relative">
              <div className="absolute top-4 right-4 flex items-center gap-2" dir="rtl">
                <span className="text-[10.5px] font-bold text-mute bg-paper rounded-full px-2.5 py-1">
                  {faNum(due.length)} باقی‌مانده
                </span>
                <LevelChip lvl={e.lvl} />
              </div>
              <span className="text-[11px] font-bold text-mute bg-paper rounded-full px-3 py-1 mb-5" dir="rtl">
                معنی این واژه را به یاد بیاورید…
              </span>
              <div className="font-latin font-black text-[44px] leading-tight text-oxford">{e.w}</div>
              {e.ph && <div className="ltr-i font-latin text-[17px] text-gold-deep font-semibold mt-2">{e.ph}</div>}
              {e.pos && <span className="font-latin text-[12px] text-mute mt-2 bg-oxford-soft rounded px-2 py-0.5">{e.pos}</span>}
              <button
                onClick={(ev) => { ev.stopPropagation(); speak(e.w); }}
                className="mt-5 w-12 h-12 rounded-full bg-oxford-soft text-oxford grid place-items-center hover:bg-oxford hover:text-gold transition-all active:scale-90"
                aria-label="تلفظ"
              >
                <Icon name="speaker" className="w-5 h-5" />
              </button>
              <span className="mt-6 text-[12px] font-bold text-gold-deep flex items-center gap-1.5" dir="rtl">
                <Icon name="cards" className="w-4 h-4" />
                برای دیدن پاسخ روی کارت بزنید
              </span>
            </div>
            {/* پشت کارت */}
            <div className="flip-back flip-face bg-oxford-deep rounded-2xl p-6 flex flex-col items-center justify-center text-center overflow-auto cursor-pointer relative">
              <div className="absolute top-4 left-4"><LevelChip lvl={e.lvl} /></div>
              <div className="font-display text-[34px] text-gold leading-snug">{e.fa || "معنی این واژه چه بود؟"}</div>
              <div className="w-14 h-0.5 bg-gold/40 rounded-full my-4" />
              {e.en && <p className="font-latin text-[15.5px] leading-7 text-white/90 max-w-sm">{e.en}</p>}
              {e.ex && <p className="font-latin italic text-[13.5px] leading-6 text-white/60 max-w-sm mt-3">{e.ex}</p>}
            </div>
          </div>

          {flipped && (
            <div className="grid grid-cols-2 gap-3 mt-4 anim-rise">
              <button
                onClick={() => answer(false)}
                className="bg-bad text-white font-bold text-[14.5px] rounded-xl py-4 hover:bg-[#b93d53] transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg shadow-bad/25"
              >
                <Icon name="x" className="w-5 h-5" strokeWidth={2.6} />
                یادم نبود
              </button>
              <button
                onClick={() => answer(true)}
                className="bg-ok text-white font-bold text-[14.5px] rounded-xl py-4 hover:bg-[#127246] transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg shadow-ok/25"
              >
                <Icon name="check" className="w-5 h-5" strokeWidth={2.6} />
                بلد بودم
              </button>
            </div>
          )}
          <p className="text-center text-[11px] text-mute font-bold mt-3">
            پاسخ درست به جعبه‌ی بعدی می‌رود · پاسخ نادرست فردا دوباره می‌آید · فاصله‌ها: ۱، ۳، ۷، ۲۱، ۳۰ و ۹۰ روز
          </p>
        </div>
      )}
    </div>
  );
}
