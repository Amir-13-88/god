import { useMemo, useState } from "react";
import Icon from "./icons";
import { useApp } from "../store";
import { isDue, isMastered, nextIntervalLabel, faNum } from "../lib/leitner";
import { EmptyState, LevelChip } from "./ui";

export default function ReviewView() {
  const { saved, allEntries, reviewResult, setTab, speak } = useApp();

  const dueList = useMemo(
    () =>
      Object.values(saved)
        .filter(isDue)
        .sort((a, b) => a.due - b.due),
    [saved]
  );

  const entryOf = useMemo(() => {
    const m = new Map<string, (typeof allEntries)[number]>();
    for (const e of allEntries) if (!m.has(e.w)) m.set(e.w, e);
    return m;
  }, [allEntries]);

  const queue = useMemo(() => dueList.filter((s) => entryOf.has(s.w)), [dueList, entryOf]);

  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState<{ w: string; ok: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const current = queue[pos];
  const e = current ? entryOf.get(current.w) : undefined;

  const answer = (ok: boolean) => {
    if (!current) return;
    reviewResult(current.w, ok);
    setDone((d) => [...d, { w: current.w, ok }]);
    setFlipped(false);
    if (pos + 1 >= queue.length) setFinished(true);
    else setPos((p) => p + 1);
  };

  const restart = () => {
    setPos(0);
    setFlipped(false);
    setDone([]);
    setFinished(false);
  };

  const totalCount = Object.values(saved).length;

  /* حالت خالی */
  if (totalCount === 0) {
    return (
      <EmptyState
        icon="repeat"
        title="واژه‌ای برای مرور نیست"
        desc="اول چند واژه را از دیکشنری به مجموعه‌ی خود اضافه کنید تا مرور لایتنر برایشان شروع شود."
        action={
          <button
            onClick={() => setTab("dict")}
            className="bg-gold text-oxford-deep font-bold text-[13.5px] rounded-full px-6 py-3 hover:bg-[#f0b254] transition-all active:scale-95 shadow-lg shadow-gold/30"
          >
            رفتن به دیکشنری
          </button>
        }
      />
    );
  }

  /* همه مرور شده */
  if (queue.length === 0 || finished) {
    const okCount = done.filter((d) => d.ok).length;
    return (
      <div className="space-y-4">
        <div className="anim-rise bg-card border-2 border-line rounded-2xl p-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-ok-soft text-ok grid place-items-center mb-4 anim-pop">
            <Icon name="star" className="w-10 h-10" strokeWidth={1.6} />
          </div>
          <h2 className="font-display text-3xl text-oxford mb-2">
            {done.length > 0 ? "آفرین! مرور تمام شد" : "مروری برای امروز ندارید"}
          </h2>
          {done.length > 0 ? (
            <>
              <p className="text-[13.5px] text-mute leading-7 mb-5">
                {faNum(done.length)} واژه مرور شد — <b className="text-ok">{faNum(okCount)}</b> درست و{" "}
                <b className="text-bad">{faNum(done.length - okCount)}</b> برای فردا تکرار می‌شود.
              </p>
              <div className="h-3 bg-paper rounded-full overflow-hidden mb-5 max-w-sm mx-auto">
                <div className="h-full bg-ok rounded-full bar-grow" style={{ width: `${(okCount / done.length) * 100}%` }} />
              </div>
            </>
          ) : (
            <p className="text-[13.5px] text-mute leading-7 mb-5">
              همه‌ی واژه‌های شما برای روزهای آینده برنامه‌ریزی شده‌اند. فردا دوباره سر بزنید!
            </p>
          )}
          <div className="flex gap-2.5 justify-center flex-wrap">
            <button
              onClick={restart}
              className="bg-oxford text-white font-bold text-[13px] rounded-full px-6 py-3 hover:bg-oxford-mid transition-all active:scale-95"
            >
              مرور دوباره‌ی این جلسه
            </button>
            <button
              onClick={() => setTab("my")}
              className="bg-card border-2 border-line text-oxford font-bold text-[13px] rounded-full px-6 py-3 hover:border-oxford-mid/50 transition-all active:scale-95"
            >
              کلمات من
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* نوار پیشرفت */}
      <div className="bg-card border-2 border-line rounded-xl px-4 py-3">
        <div className="flex items-center justify-between text-[12px] font-bold text-mute mb-2">
          <span>
            کارت <b className="text-oxford">{faNum(pos + 1)}</b> از <b className="text-oxford">{faNum(queue.length)}</b>
          </span>
          <span className="flex items-center gap-1.5 text-gold-deep">
            <Icon name="clock" className="w-3.5 h-3.5" />
            مرور بعدیِ درست: {current ? nextIntervalLabel({ ...current, box: current.box + 1 }) : ""}
          </span>
        </div>
        <div className="h-2.5 bg-paper rounded-full overflow-hidden">
          <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${((pos + (flipped ? 0.5 : 0)) / queue.length) * 100}%` }} />
        </div>
      </div>

      {/* کارت */}
      {e && current && (
        <div className="persp">
          <div
            className={`flip-inner cursor-pointer min-h-[380px] ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped((f) => !f)}
            role="button"
            aria-label="نمایش پاسخ"
          >
            {/* روی کارت */}
            <div className="flip-face min-h-[380px] bg-card border-2 border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="flex items-center gap-2 mb-5" dir="rtl">
                <span className="text-[11px] font-bold text-mute bg-paper rounded-full px-3 py-1">
                  معنی این واژه را به یاد بیاورید…
                </span>
                <LevelChip lvl={e.lvl} />
              </div>
              <div className="ltr-i font-latin font-black text-[44px] leading-tight text-oxford">{e.w}</div>
              {e.ph && <div className="ltr-i font-latin text-[17px] text-gold-deep font-semibold mt-2">{e.ph}</div>}
              {e.pos && <span className="ltr-i font-latin text-[12px] text-mute mt-2 bg-oxford-soft rounded px-2 py-0.5">{e.pos}</span>}
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
            <div className="flip-back flip-face bg-oxford-deep rounded-2xl p-6 flex flex-col items-center justify-center text-center overflow-auto">
              <div className="absolute top-4 left-4"><LevelChip lvl={e.lvl} /></div>
              <div className="font-display text-[34px] text-gold leading-snug">{e.fa || "معنی این واژه چه بود؟"}</div>
              <div className="w-14 h-0.5 bg-gold/40 rounded-full my-4" />
              {e.en && <p className="ltr-i font-latin text-[15.5px] leading-7 text-white/90 max-w-sm">{e.en}</p>}
              {e.ex && <p className="ltr-i font-latin italic text-[13px] text-gold/80 mt-3 max-w-sm leading-6">{e.ex}</p>}
            </div>
          </div>
        </div>
      )}

      {/* دکمه‌ها */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => answer(false)}
          className={`flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-[15px] border-2 transition-all active:scale-[0.97] ${
            flipped
              ? "bg-bad text-white border-bad hover:bg-[#b93c53] shadow-lg shadow-bad/25"
              : "bg-card text-mute/50 border-line cursor-not-allowed"
          }`}
          disabled={!flipped}
        >
          <Icon name="x" className="w-5 h-5" strokeWidth={2.6} />
          بلد نبودم — فردا
        </button>
        <button
          onClick={() => answer(true)}
          className={`flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-[15px] border-2 transition-all active:scale-[0.97] ${
            flipped
              ? "bg-ok text-white border-ok hover:bg-[#127347] shadow-lg shadow-ok/25"
              : "bg-card text-mute/50 border-line cursor-not-allowed"
          }`}
          disabled={!flipped}
        >
          <Icon name="check" className="w-5 h-5" strokeWidth={2.6} />
          بلد بودم — جعبه‌ی بعد
        </button>
      </div>

      {/* پیش‌نمایش جلسه */}
      {done.length > 0 && (
        <div className="flex gap-1.5 flex-wrap justify-center">
          {done.map((d, i) => (
            <span
              key={i}
              className={`ltr-i font-latin text-[10.5px] font-bold rounded-full px-2 py-0.5 ${d.ok ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad"}`}
            >
              {d.w}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
