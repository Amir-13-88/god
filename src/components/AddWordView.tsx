import { useMemo, useState } from "react";
import Icon from "./icons";
import { useApp } from "../store";
import type { CustomInput } from "../store";
import { CEFR_ORDER, CEFR_INFO } from "../lib/dictionary";
import type { CEFR } from "../lib/dictionary";
import { faNum } from "../lib/leitner";
import { Card } from "./ui";

/* تجزیه‌ی خطوط حالت گروهی:  word - معنی  |  word: معنی  |  word = معنی */
function parseBulk(text: string): { w: string; fa: string }[] {
  const out: { w: string; fa: string }[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z][A-Za-z'’ \-]{0,30}?)\s*[-=:–—]\s*(.+)$/);
    if (m) out.push({ w: m[1].trim(), fa: m[2].trim() });
    else {
      const sp = line.split(/\s{2,}|\t/);
      if (sp.length >= 2 && /^[A-Za-z]/.test(sp[0])) out.push({ w: sp[0].trim(), fa: sp.slice(1).join(" ").trim() });
    }
  }
  return out;
}

export default function AddWordView() {
  const { addCustom, imported, removeCustom, toast, baseHeadwords } = useApp();
  const [mode, setMode] = useState<"single" | "bulk">("single");

  /* حالت تکی */
  const [w, setW] = useState("");
  const [fa, setFa] = useState("");
  const [pos, setPos] = useState("n.");
  const [ph, setPh] = useState("");
  const [en, setEn] = useState("");
  const [ex, setEx] = useState("");
  const [lvl, setLvl] = useState<CEFR>("B1");
  const [saveBox, setSaveBox] = useState(true);

  /* حالت گروهی */
  const [bulk, setBulk] = useState("");
  const bulkParsed = useMemo(() => parseBulk(bulk), [bulk]);

  const addSingle = () => {
    if (!w.trim() || !fa.trim()) {
      toast("واژه‌ی انگلیسی و معنی فارسی را پر کنید", "bad");
      return;
    }
    const n = addCustom([{ w: w.trim(), fa: fa.trim(), pos, ph, en, ex, lvl }], { save: saveBox, prefix: "user" });
    if (n > 0) {
      toast(saveBox ? "واژه اضافه شد و به جعبه‌ی لایتنر رفت" : "واژه به فرهنگ اضافه شد", "ok");
      setW(""); setFa(""); setPh(""); setEn(""); setEx("");
    } else {
      toast("این واژه از قبل در فرهنگ هست", "info");
    }
  };

  const addBulk = () => {
    if (bulkParsed.length === 0) {
      toast("خطی با قالب درست پیدا نشد — مثل «book - کتاب»", "bad");
      return;
    }
    const n = addCustom(bulkParsed.map((o) => ({ w: o.w, fa: o.fa, lvl })), { save: saveBox, prefix: "user" });
    toast(n > 0 ? `${faNum(n)} واژه اضافه شد` : "همه‌ی واژه‌ها تکراری بودند", n > 0 ? "ok" : "info");
    if (n > 0) setBulk("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(
          [
            ["single", "افزودن تکی"],
            ["bulk", "افزودن گروهی"],
          ] as ["single" | "bulk", string][]
        ).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 text-[13px] font-bold rounded-xl py-2.5 border-2 transition-all active:scale-95 ${
              mode === m ? "bg-oxford text-white border-oxford" : "bg-card border-line text-ink hover:border-oxford-mid/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "single" ? (
        <Card title="واژه‌ی جدید" icon="plus" tone="#0b2e52">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11.5px] font-bold text-mute block mb-1">واژه‌ی انگلیسی *</span>
                <input
                  value={w}
                  onChange={(e) => setW(e.target.value)}
                  placeholder="book"
                  className="ltr w-full bg-paper border-2 border-line focus:border-oxford-mid outline-none rounded-xl px-3 py-2.5 font-latin text-[14px]"
                  dir="ltr"
                />
              </label>
              <label className="block">
                <span className="text-[11.5px] font-bold text-mute block mb-1">معنی فارسی *</span>
                <input
                  value={fa}
                  onChange={(e) => setFa(e.target.value)}
                  placeholder="کتاب"
                  className="w-full bg-paper border-2 border-line focus:border-oxford-mid outline-none rounded-xl px-3 py-2.5 text-[14px]"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11.5px] font-bold text-mute block mb-1">نقش دستوری</span>
                <select
                  value={pos}
                  onChange={(e) => setPos(e.target.value)}
                  className="w-full bg-paper border-2 border-line focus:border-oxford-mid outline-none rounded-xl px-3 py-2.5 font-latin text-[14px]"
                >
                  {["n.", "v.", "adj.", "adv.", "prep.", "conj.", "pron.", "phr.v.", "int."].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[11.5px] font-bold text-mute block mb-1">تلفظ (IPA)</span>
                <input
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  placeholder="/bʊk/"
                  className="ltr w-full bg-paper border-2 border-line focus:border-oxford-mid outline-none rounded-xl px-3 py-2.5 font-latin text-[14px]"
                  dir="ltr"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-[11.5px] font-bold text-mute block mb-1">تعریف انگلیسی (اختیاری)</span>
              <input
                value={en}
                onChange={(e) => setEn(e.target.value)}
                placeholder="a set of written pages…"
                className="ltr w-full bg-paper border-2 border-line focus:border-oxford-mid outline-none rounded-xl px-3 py-2.5 font-latin text-[14px]"
                dir="ltr"
              />
            </label>
            <label className="block">
              <span className="text-[11.5px] font-bold text-mute block mb-1">جمله‌ی مثال (اختیاری)</span>
              <input
                value={ex}
                onChange={(e) => setEx(e.target.value)}
                placeholder="I read a book every week."
                className="ltr w-full bg-paper border-2 border-line focus:border-oxford-mid outline-none rounded-xl px-3 py-2.5 font-latin text-[14px]"
                dir="ltr"
              />
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11.5px] font-bold text-mute">سطح:</span>
              {CEFR_ORDER.map((l) => (
                <button
                  key={l}
                  onClick={() => setLvl(l)}
                  className={`font-latin font-bold text-[11px] rounded-lg px-2.5 py-1.5 border-2 transition-all active:scale-90 ${
                    lvl === l ? "text-white border-transparent shadow" : "bg-card border-line text-mute"
                  }`}
                  style={lvl === l ? { backgroundColor: CEFR_INFO[l].color } : undefined}
                >
                  {l}
                </button>
              ))}
              <button
                onClick={() => setSaveBox((v) => !v)}
                className={`ms-auto text-[11px] font-bold rounded-full px-3 py-1.5 border-2 transition-all active:scale-95 flex items-center gap-1.5 ${
                  saveBox ? "bg-ok text-white border-ok" : "bg-card text-mute border-line"
                }`}
              >
                <Icon name={saveBox ? "check" : "repeat"} className="w-3.5 h-3.5" strokeWidth={2.6} />
                {saveBox ? "به جعبه‌ی لایتنر برود" : "فقط فرهنگ"}
              </button>
            </div>
            <button
              onClick={addSingle}
              className="w-full bg-gold text-oxford-deep font-bold text-[14.5px] rounded-xl py-3.5 hover:bg-[#f0b254] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-gold/25"
            >
              <Icon name="plus" className="w-5 h-5" strokeWidth={2.6} />
              افزودن به فرهنگ لغت
            </button>
          </div>
        </Card>
      ) : (
        <Card title="افزودن گروهی" icon="layers" tone="#a86f14">
          <div className="space-y-3">
            <p className="text-[12px] text-mute leading-6 bg-paper rounded-xl p-3">
              هر خط را با قالب <b className="ltr-i font-latin">word - معنی</b> یا <b className="ltr-i font-latin">word: معنی</b> بنویسید.
              {bulkParsed.length > 0 && (
                <span className="block mt-1.5 text-ok font-bold">{faNum(bulkParsed.length)} خط آماده‌ی افزودن است.</span>
              )}
            </p>
            <textarea
              value={bulk}
              onChange={(e) => setBulk(e.target.value)}
              rows={7}
              placeholder={"book - کتاب\nwater - آب\nrun: دویدن"}
              className="w-full bg-paper border-2 border-line focus:border-oxford-mid outline-none rounded-xl px-3 py-2.5 text-[13.5px] font-medium resize-y"
            />
            <div className="flex items-center gap-2">
              <span className="text-[11.5px] font-bold text-mute">سطح:</span>
              {CEFR_ORDER.map((l) => (
                <button
                  key={l}
                  onClick={() => setLvl(l)}
                  className={`font-latin font-bold text-[11px] rounded-lg px-2.5 py-1.5 border-2 transition-all active:scale-90 ${
                    lvl === l ? "text-white border-transparent shadow" : "bg-card border-line text-mute"
                  }`}
                  style={lvl === l ? { backgroundColor: CEFR_INFO[l].color } : undefined}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={addBulk}
              className="w-full bg-gold text-oxford-deep font-bold text-[14.5px] rounded-xl py-3.5 hover:bg-[#f0b254] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-gold/25"
            >
              <Icon name="plus" className="w-5 h-5" strokeWidth={2.6} />
              افزودن {bulkParsed.length > 0 ? faNum(bulkParsed.length) : ""} واژه
            </button>
          </div>
        </Card>
      )}

      {/* واژه‌های دستی */}
      {imported.length > 0 && (
        <Card title={`واژه‌های دستی شما (${faNum(imported.length)})`} icon="cards" tone="#178a55">
          <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
            {imported.map((e) => (
              <div key={e.id} className="flex items-center gap-3 bg-paper rounded-xl px-3.5 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="ltr-i font-latin font-bold text-[15px] text-oxford">{e.w}</span>
                    {e.ph && <span className="ltr-i font-latin text-[11.5px] text-gold-deep">{e.ph}</span>}
                  </div>
                  <div className="text-[12.5px] text-ink font-medium truncate">{e.fa}</div>
                </div>
                {baseHeadwords.has(e.w.toLowerCase()) && (
                  <span className="text-[9.5px] font-bold bg-gold-soft text-gold-deep rounded px-1.5 py-0.5 shrink-0">تکراری</span>
                )}
                <button
                  onClick={() => {
                    removeCustom(e.w);
                    toast(`«${e.w}» حذف شد`, "info");
                  }}
                  className="w-8 h-8 shrink-0 rounded-full bg-card border border-line text-mute hover:text-bad hover:border-bad grid place-items-center transition-all active:scale-90"
                  aria-label="حذف"
                >
                  <Icon name="trash" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
