import type { ReactNode } from "react";
import Icon from "./icons";
import { useApp } from "../store";
import type { Entry } from "../lib/dictionary";
import { CEFR_INFO } from "../lib/dictionary";
import { BOX_COLORS, BOX_NAMES, faNum } from "../lib/leitner";
import type { SavedWord } from "../lib/leitner";

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="absolute top-1/2 -translate-y-1/2 start-4 text-mute pointer-events-none">
        <Icon name="search" className="w-5 h-5" />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-card border-2 border-line focus:border-oxford-mid outline-none rounded-2xl py-3.5 ps-12 pe-11 text-[14.5px] font-medium placeholder:text-mute/70 shadow-sm transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute top-1/2 -translate-y-1/2 end-3.5 w-6 h-6 rounded-full bg-paper text-mute hover:bg-bad-soft hover:text-bad grid place-items-center transition-colors"
          aria-label="پاک کردن"
        >
          <Icon name="x" className="w-3.5 h-3.5" strokeWidth={2.6} />
        </button>
      )}
    </div>
  );
}

export function LevelChip({ lvl }: { lvl: Entry["lvl"] }) {
  const info = CEFR_INFO[lvl];
  return (
    <span
      className="ltr-i font-latin text-[10px] font-bold rounded-md px-1.5 py-px text-white shrink-0"
      style={{ backgroundColor: info.color }}
      title={`سطح ${info.label}`}
    >
      {lvl}
    </span>
  );
}

export function BoxBadge({ s }: { s: SavedWord }) {
  const idx = Math.min(s.box, BOX_COLORS.length - 1);
  return (
    <span
      className="text-[10px] font-bold rounded-full px-2 py-0.5 text-white shrink-0"
      style={{ backgroundColor: BOX_COLORS[idx] }}
    >
      {BOX_NAMES[idx]}
    </span>
  );
}

export function SaveButton({ entry, big }: { entry: Entry; big?: boolean }) {
  const { isSaved, toggleSave } = useApp();
  const saved = isSaved(entry.w);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleSave(entry);
      }}
      title={saved ? "حذف از مجموعه‌ی من" : "افزودن به مجموعه‌ی من"}
      className={`shrink-0 grid place-items-center rounded-full border-2 transition-all active:scale-90 ${
        big ? "w-11 h-11" : "w-9 h-9"
      } ${
        saved
          ? "bg-ok border-ok text-white shadow-md shadow-ok/30"
          : "bg-card border-line text-oxford-mid hover:border-gold hover:text-gold-deep"
      }`}
    >
      <Icon name={saved ? "check" : "plus"} className={big ? "w-5 h-5" : "w-4 h-4"} strokeWidth={2.6} />
    </button>
  );
}

export function WordRow({
  entry,
  saved,
  delay = 0,
  trailing,
}: {
  entry: Entry;
  saved?: SavedWord;
  delay?: number;
  trailing?: ReactNode;
}) {
  const { openDetail, speak } = useApp();
  return (
    <button
      onClick={() => openDetail(entry)}
      style={{ animationDelay: `${Math.min(delay, 400)}ms` }}
      className="word-row anim-rise w-full text-start bg-card border-2 border-line rounded-xl px-4 py-3 flex items-center gap-3"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="ltr-i font-latin font-bold text-[17px] text-oxford">{entry.w}</span>
          {entry.ph && <span className="ltr-i font-latin text-[12.5px] text-gold-deep font-semibold">{entry.ph}</span>}
          {entry.pos && <span className="text-[11px] text-mute bg-oxford-soft rounded px-1.5 py-px font-latin ltr-i">{entry.pos}</span>}
          <LevelChip lvl={entry.lvl} />
          {saved && <BoxBadge s={saved} />}
        </div>
        <div className="text-[13.5px] text-ink font-medium mt-0.5 truncate">{entry.fa}</div>
        {entry.en && <div className="ltr text-[12px] text-mute font-latin italic truncate mt-0.5">{entry.en}</div>}
      </div>
      {trailing}
      <span
        role="button"
        tabIndex={0}
        title="شنیدن تلفظ"
        onClick={(ev) => {
          ev.stopPropagation();
          speak(entry.w);
        }}
        onKeyDown={(ev) => {
          if (ev.key === "Enter") {
            ev.stopPropagation();
            speak(entry.w);
          }
        }}
        className="w-8 h-8 shrink-0 rounded-full bg-oxford-soft text-oxford grid place-items-center hover:bg-oxford hover:text-gold transition-all active:scale-90"
      >
        <Icon name="speaker" className="w-4 h-4" />
      </span>
      <SaveButton entry={entry} />
    </button>
  );
}

export function StatCard({ label, value, icon, tone }: { label: string; value: number; icon: string; tone: string }) {
  return (
    <div className="bg-card border-2 border-line rounded-xl p-3.5 text-center">
      <div className="mx-auto w-8 h-8 rounded-lg grid place-items-center mb-1.5" style={{ backgroundColor: `${tone}1a`, color: tone }}>
        <Icon name={icon} className="w-4 h-4" />
      </div>
      <div className="font-display text-2xl leading-7" style={{ color: tone }}>
        {faNum(value)}
      </div>
      <div className="text-[11px] font-bold text-mute">{label}</div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon: string;
  title: string;
  desc: string;
  action?: ReactNode;
}) {
  return (
    <div className="bg-card border-2 border-dashed border-line rounded-2xl px-6 py-14 text-center anim-rise">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-oxford-soft text-oxford grid place-items-center mb-4">
        <Icon name={icon} className="w-8 h-8" strokeWidth={1.6} />
      </div>
      <h3 className="font-display text-2xl text-oxford mb-2">{title}</h3>
      <p className="text-[13px] text-mute leading-7 max-w-sm mx-auto mb-5">{desc}</p>
      {action}
    </div>
  );
}

export function Card({
  title,
  icon,
  tone = "#0b2e52",
  children,
}: {
  title: string;
  icon: string;
  tone?: string;
  children: ReactNode;
}) {
  return (
    <section className="anim-rise bg-card border-2 border-line rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-9 h-9 rounded-xl grid place-items-center" style={{ backgroundColor: `${tone}1a`, color: tone }}>
          <Icon name={icon} className="w-5 h-5" />
        </span>
        <h2 className="font-display text-xl" style={{ color: tone }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
