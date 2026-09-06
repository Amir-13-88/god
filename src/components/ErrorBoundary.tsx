import { Component } from "react";
import type { ReactNode } from "react";

interface Props { children: ReactNode }
interface State { error: Error | null }

/* اگر جایی از برنامه خطا داد، به‌جای صفحه‌ی سفید یک پیام دوستانه نشان می‌دهد */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-dvh grid place-items-center p-6" dir="rtl">
          <div className="max-w-md bg-card border-2 border-line rounded-2xl p-8 text-center anim-pop">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gold-soft text-gold-deep grid place-items-center mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 2.5 20h19L12 3Z" />
                <path d="M12 10v4M12 17.5h.01" />
              </svg>
            </div>
            <h1 className="font-display text-2xl text-oxford mb-2">خطای غیرمنتظره</h1>
            <p className="text-[13.5px] text-mute leading-7 mb-5">
              مشکلی در نمایش برنامه پیش آمد. با بارگیری دوباره معمولاً درست می‌شود — داده‌های شما (کلمات و پیشرفت مرور) حفظ شده است.
            </p>
            <button
              onClick={() => location.reload()}
              className="bg-oxford text-white font-bold text-[14px] rounded-xl px-7 py-3 hover:bg-oxford-mid transition-colors active:scale-95"
            >
              بارگیری دوباره
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
