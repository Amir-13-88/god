import { useEffect, useState } from "react";
import Icon from "./icons";
import { useApp } from "../store";
import { dueLabel, nextIntervalLabel, faNum, INTERVALS } from "../lib/leitner";
import { SaveButton, BoxBadge, LevelChip } from "./ui";
import { getCached, enrichWord } from "../lib/enrich";

export default function WordDetail() {
  const { detail, closeDetail, speak, saved } = useApp();

  const [en, setEn] = useState("");
  const [ph, setPh] = useState("");
  const [audio, setAudio] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!detail) return;
    setEn(detail.en);
    setPh(detail.ph);
    setAudio(undefined);
    setOffline(false);
    setNotFound(false);
    if (detail.en && detail.ph) return;
    const c = getCached(detail.w);
    if (c) {
      if (!detail.en && c.en) setEn(c.en);
      if (!detail.ph && c.ph) setPh(c.ph);
      setAudio(c.audio);
      return;
    }
    if (!navigator.onLine) {
      setOffline(true);
      return;
    }
    setLoading(true);
    enrichWord(detail.w).then((r) => {
      setLoading(false);
      if (r && (r.en || r.ph)) {
        setEn((p) => p || r.en || "");
        setPh((p) => p || r.ph || "");
        setAudio(r.audio);
      } else if (!r) {
        setOffline(true);
      } else {
        setNotFound(true);
      }
    });
  }, [detail]);

  if (!detail) return null;

  const s = saved[detail.w];
  const stepIdx = s ? Math.min(s.box, INTERVALS.length - 1) : -1;

  const playSound = () => {
    if (audio) {
      try {
        new Audio(audio).play();
        return;
      } catch { /* از TTS استفاده می‌شود */ }
    }
    speak(detail.w);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center p-0 sm:p-4" onClick={closeDetail}>
      <div className="absolute inset-0 bg-oxford-deep/60 backdrop-blur-[2px]" />
      <div
        className="relative anim-rise bg-card w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[94dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-oxford-deep px-5 pt-4 pb-5 text-white relative overflow-hidden shrink-0">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(20rem 8rem at 100% 0%, rgba(232,163,61,0.25), transparent 70%)" }}
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="ltr-i font-latin font-black text-4xl text-white">{detail.w}</h2>
                {detail.pos && (
                  <span className="ltr-i font-latin text-[11px] bg-white/12 border border-white/20 rounded px-1.5 py-0.5 text-gold">
                    {detail.pos}
                  </span>
                )}
                <LevelChip lvl={detail.lvl} />
              </div>
              {(ph || loading) && (
                <button
                  onClick={playSound}
                  className="ltr-i font-latin text-[16px] text-gold font-semibold mt-1.5 inline-flex items-center gap-1.5 hover:text-[#f0b254] transition-colors"
                >
                  <Icon name="speaker" className="w-4 h-4" />
                  {ph || "…"}
                </button>
              )}
              <div className="font-display text-[26px] text-gold mt-1 leading-9">{detail.fa || "—"}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={playSound}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 grid place-items-center text-gold hover:bg-white/20 active:scale-90 transition-all"
                aria-label="تلفظ واژه"
              >
                <Icon name="speaker" className="w-5 h-5" />
              </button>
              <button
                onClick={closeDetail}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 grid place-items-center text-white/80 hover:bg-white/20 active:scale-90 transition-all"
                aria-label="بستن"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <section>
            <div className="flex items-center gap-2 mb-1.5">
              <Icon name="book" className="w-4 h-4 text-oxford-mid" />
              <h3 className="text-[12.5px] font-bold text-oxford-mid">تعریف انگلیسی به انگلیسی</h3>
            </div>
            {en ? (
              <p className="ltr bg-oxford-soft/50 border-s-4 border-oxford rounded-lg p-3.5 font-latin text-[15px] leading-7 text-ink" dir="ltr">
                {en}
              </p>
            ) : loading ? (
              <div className="bg-paper rounded-lg p-4 flex items-center gap-3 text-mute text-[12.5px]">
                <span className="w-5 h-5 rounded-full border-2 border-gold border-t-transparent animate-spin shrink-0" />
                در حال دریافت تعریف از منابع جهانی…
              </div>
            ) : offline ? (
              <div className="bg-gold-soft/60 rounded-lg p-3.5 text-[12.5px] text-gold-deep leading-6 flex gap-2">
                <Icon name="wifioff" className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  برای این واژه تعریف انگلیسی ذخیره نشده. یک بار با اینترنت بازش کنید تا برای همیشه آفلاین شود — معنی فارسی‌اش همیشه در دسترس است.
                </span>
              </div>
            ) : notFound ? (
              <div className="bg-paper rounded-lg p-3.5 text-[12.5px] text-mute leading-6 flex gap-2">
                <Icon name="info" className="w-4 h-4 shrink-0 mt-0.5" />
                <span>این واژه در منابع جهانی ثبت نشده؛ همان معنی فارسی برای یادگیری کافی است.</span>
              </div>
            ) : null}
          </section>

          {detail.ex && (
            <section>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon name="sparkle" className="w-4 h-4 text-gold-deep" />
                <h3 className="text-[12.5px] font-bold text-gold-deep">مثال</h3>
              </div>
              <div className="ltr bg-gold-soft/50 border-s-4 border-gold rounded-lg p-3.5 font-latin text-[14.5px] leading-7 text-ink italic" dir="ltr">
                {detail.ex}
              </div>
            </section>
          )}

          <section className="bg-paper rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Icon name="layers" className="w-4 h-4 text-oxford-mid" />
                <h3 className="text-[12.5px] font-bold text-oxford">جایگاه در لایتنر</h3>
              </div>
              {s ? (
                <div className="flex items-center gap-2">
                  <BoxBadge s={s} />
                  <span className="text-[11px] font-bold text-mute">{dueLabel(s)}</span>
                </div>
              ) : (
                <span className="text-[11px] font-bold text-mute">هنوز در مجموعه نیست</span>
              )}
            </div>

            <div className="flex items-center gap-1 mb-3" dir="ltr">
              {INTERVALS.map((d, i) => (
                <div key={d} className="flex-1">
                  <div className={`h-2 rounded-full transition-all ${stepIdx >= i ? "bg-oxford" : "bg-line"}`} />
                  <div className={`text-center text-[9px] font-latin font-bold mt-1 ${stepIdx >= i ? "text-oxford" : "text-mute/60"}`}>
                    {d}
                  </div>
                </div>
              ))}
              <div className="flex-1">
                <div className={`h-2 rounded-full ${s && s.box > 6 ? "bg-ok" : "bg-line"}`} />
                <div className={`text-center text-[9px] font-bold mt-1 ${s && s.box > 6 ? "text-ok" : "text-mute/60"}`}>✓</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <SaveButton entry={detail} big />
              <div className="text-[12px] text-mute leading-5">
                {s ? (
                  <>
                    مرور بعدی: <b className="text-ink">{nextIntervalLabel(s)}</b>
                    {s.lapses > 0 && (
                      <>
                        {" "}· فراموشی: <b className="text-bad">{faNum(s.lapses)}</b>
                      </>
                    )}
                  </>
                ) : (
                  <>با افزودن به مجموعه، مرور ۱، ۳، ۷، ۲۱، ۳۰ و ۹۰ روزه برایش برنامه‌ریزی می‌شود.</>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
