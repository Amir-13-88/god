import { Suspense, useMemo } from "react";
import { AppProvider, useApp } from "./store";
import type { Tab } from "./store";
import Header from "./components/Header";
import DictionaryView from "./components/DictionaryView";
import MyWordsView from "./components/MyWordsView";
import ReviewView from "./components/ReviewView";
import SettingsView from "./components/SettingsView";
import AddWordView from "./components/AddWordView";
import WordDetail from "./components/WordDetail";
import Icon from "./components/icons";
import { faNum, isDue } from "./lib/leitner";

const DRIFTING = ["A", "b", "Z", "q", "K", "w", "S", "e"];

function Shell() {
  const { tab, setTab, saved, toasts, detail } = useApp();

  const dueCount = useMemo(() => Object.values(saved).filter((s) => isDue(s)).length, [saved]);

  const tabs: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: "dict", label: "فرهنگ", icon: "book" },
    { id: "my", label: "کلمات من", icon: "cards" },
    { id: "add", label: "افزودن", icon: "plus" },
    { id: "review", label: "مرور", icon: "repeat", badge: dueCount },
    { id: "settings", label: "برنامه", icon: "gear" },
  ];

  return (
    <div className="min-h-dvh flex flex-col relative overflow-x-hidden">
      {/* حروف شناور تزئینی */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {DRIFTING.map((ch, i) => (
          <span
            key={i}
            className="drift-letter"
            style={{
              left: `${(i * 13 + 5) % 90}%`,
              top: `${(i * 23 + 8) % 85}%`,
              fontSize: `${44 + (i % 4) * 26}px`,
              animationDelay: `${i * 1.3}s`,
              animationDuration: `${9 + (i % 3) * 3}s`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      <Header />

      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-4 py-5 pb-28">
        <div key={tab} className="anim-rise">
          {tab === "dict" && <DictionaryView />}
          {tab === "my" && <MyWordsView />}
          {tab === "add" && <AddWordView />}
          {tab === "review" && <ReviewView />}
          {tab === "settings" && <SettingsView />}
        </div>
      </main>

      {/* ناوبری پایین */}
      <nav className="fixed bottom-0 inset-x-0 z-40">
        <div className="max-w-3xl mx-auto px-3 pb-3">
          <div className="bg-oxford-deep/95 backdrop-blur border border-white/10 rounded-2xl shadow-2xl shadow-black/30 grid grid-cols-5 overflow-hidden">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex flex-col items-center gap-0.5 py-3 transition-all active:scale-95 ${
                  tab === t.id ? "text-gold" : "text-white/50 hover:text-white/80"
                }`}
              >
                <span className="relative">
                  <Icon name={t.icon} className="w-5.5 h-5.5" strokeWidth={tab === t.id ? 2.4 : 2} />
                  {t.badge ? (
                    <span className="absolute -top-1.5 -left-2 min-w-[17px] h-[17px] px-1 rounded-full bg-gold text-oxford-deep text-[9.5px] font-bold grid place-items-center">
                      {faNum(t.badge)}
                    </span>
                  ) : null}
                </span>
                <span className="text-[10px] font-bold">{t.label}</span>
                {tab === t.id && <span className="absolute top-0 inset-x-4 h-0.5 bg-gold rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* توست‌ها */}
      <div className="fixed bottom-24 inset-x-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`anim-toast pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-3 shadow-xl text-[13px] font-bold max-w-sm ${
              t.kind === "ok"
                ? "bg-ok text-white"
                : t.kind === "bad"
                ? "bg-bad text-white"
                : "bg-oxford-deep text-white border border-white/15"
            }`}
          >
            <Icon name={t.kind === "ok" ? "check" : t.kind === "bad" ? "alert" : "info"} className="w-4.5 h-4.5 shrink-0" strokeWidth={2.4} />
            {t.msg}
          </div>
        ))}
      </div>

      {/* پنجره‌ی جزئیات واژه */}
      {detail && <WordDetail />}
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
