import { useMemo } from "react";
import { AppProvider, useApp } from "./store";
import type { Tab } from "./store";
import Header from "./components/Header";
import DictionaryView from "./components/DictionaryView";
import MyWordsView from "./components/MyWordsView";
import ReviewView from "./components/ReviewView";
import AddWordView from "./components/AddWordView";
import SettingsView from "./components/SettingsView";
import WordDetail from "./components/WordDetail";
import Icon from "./components/icons";
import { isDue, faNum } from "./lib/leitner";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "dict", label: "دیکشنری", icon: "book" },
  { id: "my", label: "کلمات من", icon: "cards" },
  { id: "add", label: "افزودن", icon: "pencil" },
  { id: "review", label: "مرور", icon: "repeat" },
  { id: "settings", label: "برنامه", icon: "gear" },
];

function FloatingLetters() {
  const chars = useMemo(
    () =>
      ["A", "b", "C", "d", "E", "f", "G", "h", "I", "j", "K", "l"].map((c, i) => ({
        c,
        top: `${(i * 8.3 + 5) % 90}%`,
        left: `${(i * 13.7 + 2) % 95}%`,
        size: 26 + ((i * 7) % 30),
        delay: (i * 0.9) % 6,
      })),
    []
  );
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {chars.map((l, i) => (
        <span
          key={i}
          className="drift-letter"
          style={{ top: l.top, left: l.left, fontSize: l.size, animationDelay: `${l.delay}s` }}
        >
          {l.c}
        </span>
      ))}
    </div>
  );
}

function Shell() {
  const { tab, setTab, toasts, saved } = useApp();
  const dueCount = useMemo(() => Object.values(saved).filter(isDue).length, [saved]);

  return (
    <div className="min-h-dvh pb-28">
      <FloatingLetters />
      <Header />

      <main className="max-w-3xl mx-auto px-4 pt-5 relative">
        {tab === "dict" && <DictionaryView />}
        {tab === "my" && <MyWordsView />}
        {tab === "add" && <AddWordView />}
        {tab === "review" && <ReviewView />}
        {tab === "settings" && <SettingsView />}
      </main>

      {/* نوار پایین */}
      <nav className="fixed bottom-0 inset-x-0 z-40">
        <div className="max-w-3xl mx-auto px-3 pb-3">
          <div
            className="bg-oxford-deep/95 backdrop-blur border border-white/10 rounded-2xl shadow-2xl shadow-black/30 grid grid-cols-5 px-1.5 py-1.5"
            style={{
              backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 12px)",
            }}
          >
            {TABS.map((t) => {
              const active = tab === t.id;
              const badge = t.id === "review" && dueCount > 0;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative flex flex-col items-center gap-1 rounded-xl py-2 px-1 transition-all active:scale-90 ${
                    active ? "bg-gold text-oxford-deep shadow-lg shadow-gold/25" : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="relative">
                    <Icon name={t.icon} className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
                    {badge && (
                      <span className="absolute -top-1.5 -left-2 min-w-[16px] h-4 px-1 rounded-full bg-bad text-white text-[9px] font-bold grid place-items-center border border-oxford-deep">
                        {faNum(dueCount)}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-bold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* توست‌ها */}
      <div className="fixed bottom-24 inset-x-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`anim-toast pointer-events-auto rounded-xl px-4 py-2.5 text-[13px] font-bold shadow-xl border-2 flex items-center gap-2 ${
              t.kind === "ok"
                ? "bg-ok text-white border-ok"
                : t.kind === "bad"
                ? "bg-bad text-white border-bad"
                : "bg-oxford-deep text-white border-white/20"
            }`}
          >
            <Icon name={t.kind === "ok" ? "check" : t.kind === "bad" ? "alert" : "info"} className="w-4 h-4" strokeWidth={2.4} />
            {t.msg}
          </div>
        ))}
      </div>

      <WordDetail />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
