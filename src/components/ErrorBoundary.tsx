import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props { children: ReactNode }
interface State { error: Error | null }

/** اگر خطایی رخ دهد، صفحه سفید نمی‌شود — پیام دوستانه با دکمه‌ی بازیابی */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Leitner error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-dvh grid place-items-center p-6">
          <div className="bg-card border-2 border-line rounded-2xl p-8 max-w-md text-center shadow-xl">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-oxford grid place-items-center mb-4">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z" stroke="#E8A33D" strokeWidth="1.9" strokeLinejoin="round"/>
                <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" stroke="#E8A33D" strokeWidth="1.9" strokeLinejoin="round"/>
                <path d="M9.5 11.5 12 7l2.5 4.5M10.3 10h3.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="font-bold text-xl text-oxford mb-2">اشکالی پیش آمد</h1>
            <p className="text-[13px] text-mute leading-7 mb-5">
              نگران نباشید؛ واژه‌ها و پیشرفت شما سالم مانده‌اند. با بارگیری دوباره همه‌چیز درست می‌شود.
            </p>
            <button
              onClick={() => location.reload()}
              className="bg-oxford text-white font-bold rounded-xl px-8 py-3 hover:bg-oxford-mid transition-colors"
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
