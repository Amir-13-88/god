import { useRef, useState } from "react";
import Icon from "./icons";
import { useApp } from "../store";
import { InstallModal } from "./Header";
import { INTERVALS, faNum } from "../lib/leitner";
import { cachedCount } from "../lib/enrich";
import { Card } from "./ui";

export default function SettingsView() {
  const {
    online, standalone, installEvt, promptInstall, toast,
    exportDict, importFile, importedCount, allEntries, baseCount, dictReady,
  } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [armed, setArmed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleClear = () => {
    if (!armed) {
      setArmed(true);
      window.setTimeout(() => setArmed(false), 2500);
      return;
    }
    localStorage.removeItem("vaazhe.words.v1");
    localStorage.removeItem("vaazhe.imported.v1");
    localStorage.removeItem("vaazhe.enrich.v1");
    location.reload();
  };

  return (
    <div className="space-y-4">
      {/* نصب و آفلاین */}
      <Card title="نصب و کارکرد آفلاین" icon="install" tone="#a86f14">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className={`rounded-xl p-3 border-2 flex items-center gap-2.5 ${online ? "border-ok/30 bg-ok-soft/50" : "border-gold/40 bg-gold-soft/50"}`}>
              <Icon name={online ? "wifi" : "wifioff"} className={`w-5 h-5 shrink-0 ${online ? "text-ok" : "text-gold-deep"}`} />
              <div>
                <div className="text-[12.5px] font-bold text-ink">{online ? "آنلاین" : "آفلاین"}</div>
                <div className="text-[10.5px] text-mute">وضعیت اتصال</div>
              </div>
            </div>
            <div className="rounded-xl p-3 border-2 border-line bg-paper">
              <div className="flex items-center gap-2.5">
                <Icon name="book" className="w-5 h-5 text-oxford" />
                <div>
                  <div className="text-[12.5px] font-bold text-ink">
                    {dictReady ? `${faNum(allEntries.length)} واژه` : "در حال بارگذاری"}
                  </div>
                  <div className="text-[10.5px] text-mute">آماده‌ی آفلاین</div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={async () => {
              if (standalone) return toast("برنامه همین حالا نصب‌شده باز است", "info");
              if (installEvt) {
                const r = await promptInstall();
                if (r === "accepted") toast("برنامه نصب شد", "ok");
                return;
              }
              setShowHelp(true);
            }}
            className="w-full flex items-center gap-3 bg-oxford text-white hover:bg-oxford-mid rounded-xl p-4 transition-colors text-start group"
          >
            <span className="w-10 h-10 rounded-lg bg-gold text-oxford-deep grid place-items-center group-hover:scale-105 transition-transform shrink-0">
              <Icon name="install" className="w-5 h-5" strokeWidth={2.4} />
            </span>
            <span className="flex-1">
              <span className="block font-bold text-[13.5px]">نصب برنامه روی دستگاه</span>
              <span className="block text-[11.5px] text-white/60 mt-0.5">
                {standalone ? "نصب‌شده ✓" : "مثل یک اپ واقعی، تمام‌صفحه و آفلاین"}
              </span>
            </span>
          </button>
          <p className="text-[11.5px] text-mute leading-6 flex gap-2">
            <span className="text-ok shrink-0"><Icon name="info" className="w-4 h-4" /></span>
            بعد از اولین باز شدن، کل برنامه و دیکشنری روی دستگاه کش می‌شود و حتی با اینترنت خیلی ضعیف یا قطع، کامل کار می‌کند.
            واژه‌هایی که یک بار با اینترنت باز شوند هم برای همیشه آفلاین می‌مانند ({faNum(cachedCount())} واژه کش‌شده).
          </p>
        </div>
      </Card>

      {/* فایل فرهنگ لغت */}
      <Card title="فایل فرهنگ لغت" icon="download" tone="#0b2e52">
        <div className="space-y-3">
          <button
            onClick={exportDict}
            className="w-full flex items-center gap-3 bg-oxford-soft/60 border-2 border-oxford-mid/25 hover:border-oxford-mid/50 rounded-xl p-4 transition-colors text-start group"
          >
            <span className="w-10 h-10 rounded-lg bg-oxford text-gold grid place-items-center group-hover:scale-105 transition-transform shrink-0">
              <Icon name="download" className="w-5 h-5" />
            </span>
            <span className="flex-1">
              <span className="block font-bold text-[13.5px] text-oxford">دانلود فایل کامل فرهنگ لغت (JSON)</span>
              <span className="block text-[11.5px] text-mute mt-0.5">
                {dictReady ? faNum(allEntries.length) : "…"} واژه با تعریف انگلیسی، معنی فارسی، تلفظ و سطح — برای نگهداری یا انتقال
              </span>
            </span>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-3 bg-gold-soft/60 border-2 border-gold/40 hover:border-gold rounded-xl p-4 transition-colors text-start group"
          >
            <span className="w-10 h-10 rounded-lg bg-gold text-oxford-deep grid place-items-center group-hover:scale-105 transition-transform shrink-0">
              <Icon name="upload" className="w-5 h-5" />
            </span>
            <span className="flex-1">
              <span className="block font-bold text-[13.5px] text-gold-deep">وارد کردن فایل واژه</span>
              <span className="block text-[11.5px] text-mute mt-0.5">فایل JSON دانلودشده یا واژه‌های خودتان را وارد کنید</span>
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importFile(f);
              e.target.value = "";
            }}
          />
          <p className="text-[11.5px] text-mute leading-6 flex gap-2">
            <span className="text-oxford-mid shrink-0"><Icon name="info" className="w-4 h-4" /></span>
            فرهنگ پایه {faNum(baseCount)} واژه را آفلاین دارد؛ بقیه‌ی واژه‌های دنیا با یک اتصال کوتاه اینترنت برای همیشه آفلاین می‌شوند.
            {importedCount > 0 && <> · {faNum(importedCount)} واژه‌ی دستی هم دارید.</>}
          </p>
        </div>
      </Card>

      {/* درباره‌ی لایتنر */}
      <Card title="روش مرور لایتنر" icon="layers" tone="#178a55">
        <p className="text-[12.5px] text-mute leading-7">
          واژه‌ها در جعبه‌هایی با فاصله‌های <b className="text-ink">{INTERVALS.map((d) => faNum(d)).join("، ")}</b> روز مرور می‌شوند.
          پاسخ درست واژه را به جعبه‌ی بعدی می‌برد و پاسخ نادرست آن را به فردا برمی‌گرداند تا وقتی کاملاً یاد گرفته شود.
        </p>
      </Card>

      {/* پاک کردن */}
      <Card title="داده‌های شما" icon="trash" tone="#ce4b62">
        <button
          onClick={handleClear}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-[13.5px] border-2 transition-all active:scale-[0.98] ${
            armed
              ? "bg-bad text-white border-bad"
              : "bg-card text-bad border-bad/30 hover:border-bad"
          }`}
        >
          <Icon name="trash" className="w-4.5 h-4.5" />
          {armed ? "مطمئنید؟ دوباره بزنید تا پاک شود" : "پاک کردن همه‌ی داده‌ها"}
        </button>
      </Card>

      {showHelp && <InstallModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
