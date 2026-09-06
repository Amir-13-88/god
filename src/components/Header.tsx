import { useMemo, useState } from "react";
import Icon from "./icons";
import { useApp } from "../store";
import { isDue, faNum } from "../lib/leitner";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-oxford-mid to-oxford-deep border border-white/15 grid place-items-center shadow-lg shadow-black/30">
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z" stroke="#E8A33D" strokeWidth="1.9" strokeLinejoin="round" />
          <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" stroke="#E8A33D" strokeWidth="1.9" strokeLinejoin="round" />
          <path d="M9.5 11.5 12 7l2.5 4.5M10.3 10h3.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <h1 className="font-display text-[22px] leading-7 text-white">
          واژه‌آموز <span className="text-gold">آکسفورد</span>
        </h1>
        <p className="ltr-i text-[10.5px] tracking-[0.18em] text-white/50 font-latin uppercase">Oxford Learner's Pocket</p>
      </div>
    </div>
  );
}

export function InstallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-oxford-deep/60 backdrop-blur-[2px]" />
      <div className="relative anim-pop bg-card rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 left-4 text-mute hover:text-bad" aria-label="بستن">
          <Icon name="x" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gold-soft text-gold-deep grid place-items-center">
            <Icon name="install" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl text-oxford">نصب روی گوشی و رایانه</h3>
            <p className="text-[12px] text-mute">بدون نیاز به فروشگاه — مستقیم از مرورگر</p>
          </div>
        </div>
        <div className="space-y-3 text-[13.5px]">
          <div className="bg-oxford-soft/60 rounded-xl p-4">
            <div className="font-bold text-oxford mb-2 flex items-center gap-2">
              <Icon name="phone" className="w-4 h-4" /> اندروید (کروم)
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-ink/85 leading-6">
              <li>روی منوی <b className="ltr-i font-latin">⋮</b> (سه‌نقطه) بالای مرورگر بزنید.</li>
              <li>گزینه‌ی <b>«افزودن به صفحه‌ی اصلی»</b> یا <b>«نصب برنامه»</b> را انتخاب کنید.</li>
              <li>تأیید کنید — آیکون واژه‌آموز به صفحه‌ی خانه اضافه می‌شود.</li>
            </ol>
          </div>
          <div className="bg-gold-soft/60 rounded-xl p-4">
            <div className="font-bold text-gold-deep mb-2 flex items-center gap-2">
              <Icon name="phone" className="w-4 h-4" /> آیفون و آیپد (سافاری)
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-ink/85 leading-6">
              <li>دکمه‌ی <b>هم‌رسانی (Share)</b> پایین سافاری را بزنید.</li>
              <li>گزینه‌ی <b className="ltr-i font-latin">Add to Home Screen</b> را انتخاب و تأیید کنید.</li>
            </ol>
          </div>
          <p className="text-[12px] text-mute leading-6 flex gap-2">
            <span className="text-ok shrink-0"><Icon name="wifi" className="w-4 h-4" /></span>
            پس از نصب، برنامه مثل یک اپ واقعی تمام‌صفحه باز می‌شود و حتی بدون اینترنت هم کامل کار می‌کند.
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-oxford text-white rounded-xl py-3 font-bold text-[14px] hover:bg-oxford-mid transition-colors active:scale-[0.98]"
        >
          متوجه شدم
        </button>
      </div>
    </div>
  );
}

export default function Header() {
  const { online, installEvt, promptInstall, standalone, saved, setTab, toast } = useApp();
  const [showHelp, setShowHelp] = useState(false);

  const dueCount = useMemo(() => Object.values(saved).filter((s) => isDue(s)).length, [saved]);

  const handleInstall = async () => {
    if (standalone) {
      toast("برنامه همین حالا هم به‌صورت اپ نصب‌شده باز است", "info");
      return;
    }
    if (installEvt) {
      const r = await promptInstall();
      if (r === "accepted") toast("برنامه با موفقیت نصب شد", "ok");
      return;
    }
    setShowHelp(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40">
        <div
          className="bg-oxford-deep border-b border-white/10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 14px), radial-gradient(30rem 10rem at 85% 0%, rgba(232,163,61,0.14), transparent 70%)",
          }}
        >
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <Logo />
            <div className="flex items-center gap-2">
              <span
                className={`hidden sm:flex items-center gap-1.5 text-[11px] font-bold rounded-full px-2.5 py-1.5 ${
                  online ? "bg-ok/15 text-emerald-300" : "bg-gold/15 text-gold"
                }`}
              >
                <Icon name={online ? "wifi" : "wifioff"} className="w-3.5 h-3.5" />
                {online ? "آنلاین" : "آفلاین"}
              </span>
              <button
                onClick={handleInstall}
                className={`flex items-center gap-1.5 text-[12.5px] font-bold rounded-full px-3.5 py-2 transition-all active:scale-95 ${
                  installEvt
                    ? "pulse-gold bg-gold text-oxford-deep hover:bg-[#f0b254]"
                    : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
                }`}
              >
                <Icon name="install" className="w-4 h-4" strokeWidth={2.4} />
                نصب برنامه
              </button>
            </div>
          </div>
        </div>

        {dueCount > 0 && (
          <button
            onClick={() => setTab("review")}
            className="w-full block bg-gold text-oxford-deep text-[13px] font-bold py-2 px-4 hover:bg-[#f0b254] transition-colors"
          >
            <span className="max-w-3xl mx-auto flex items-center justify-center gap-2">
              <Icon name="clock" className="w-4 h-4" strokeWidth={2.4} />
              {faNum(dueCount)} واژه آماده‌ی مرور امروز — شروع کنید
              <Icon name="chevL" className="w-4 h-4" strokeWidth={2.6} />
            </span>
          </button>
        )}
      </header>

      {showHelp && <InstallModal onClose={() => setShowHelp(false)} />}
    </>
  );
}

export function DictStatusChip() {
  const { dictReady, allEntries } = useApp();
  return (
    <span className="bg-ok-soft text-ok rounded-full px-2.5 py-0.5 text-[10.5px] font-bold flex items-center gap-1">
      <Icon name="wifi" className="w-3 h-3" strokeWidth={2.6} />
      {dictReady ? `${faNum(allEntries.length)} واژه آفلاین` : "در حال بارگذاری…"}
    </span>
  );
}
