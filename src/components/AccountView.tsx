import { useState, useEffect } from 'react';
import { initAuth, signInWithGoogle, signInWithEmail, createAccount, signOut, getCurrentUser } from '../lib/auth';
import { isFirebaseEnabled } from '../lib/firebase';
import { saveUserData, loadUserData } from '../lib/sync';
import type { UserData } from '../lib/sync';
import Icon from './icons';

interface AccountViewProps {
  saved: Record<string, any>;
  imported: any[];
  onDataLoaded: (data: UserData) => void;
  toast: (msg: string, kind?: 'ok' | 'bad' | 'info') => void;
}

export default function AccountView({ saved, imported, onDataLoaded, toast }: AccountViewProps) {
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    initAuth((user) => {
      setUser(user);
      if (user) {
        // Auto-load data on login
        loadUserData().then((data) => {
          if (data) {
            onDataLoaded(data);
            toast('داده‌های شما از ابر بارگذاری شد', 'ok');
          }
        }).catch(() => {});
      }
    });
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast('ورود موفق', 'ok');
    } catch (error: any) {
      toast(error.message || 'خطا در ورود', 'bad');
    }
    setLoading(false);
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast('ایمیل و رمز عبور را وارد کنید', 'bad');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        toast('ورود موفق', 'ok');
      } else {
        await createAccount(email, password);
        toast('حساب ایجاد شد', 'ok');
      }
    } catch (error: any) {
      toast(error.message || 'خطا در احراز هویت', 'bad');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast('خروج موفق', 'ok');
    } catch (error: any) {
      toast(error.message || 'خطا در خروج', 'bad');
    }
  };

  const handleSync = async () => {
    if (!user) return;

    setSyncing(true);
    try {
      await saveUserData({
        saved,
        imported,
        lastSync: Date.now()
      });
      toast('همگام‌سازی با ابر انجام شد', 'ok');
    } catch (error: any) {
      toast(error.message || 'خطا در همگام‌سازی', 'bad');
    }
    setSyncing(false);
  };

  if (!isFirebaseEnabled()) {
    return (
      <div className="bg-card border-2 border-line rounded-2xl p-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gold-soft text-gold-deep grid place-items-center mb-4">
          <Icon name="info" className="w-8 h-8" />
        </div>
        <h3 className="font-display text-xl text-oxford mb-2">Firebase پیکربندی نشده</h3>
        <p className="text-[13px] text-mute leading-7 mb-4">
          برای فعال‌سازی همگام‌سازی ابری، باید یک پروژه Firebase بسازی و config رو در فایل 
          <code className="ltr bg-paper px-2 py-0.5 rounded mx-1 text-[12px]">src/lib/firebase.ts</code>
          جایگزین کنی.
        </p>
        <a
          href="https://firebase.google.com/docs/web/setup"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-oxford text-white font-bold text-[13px] rounded-full px-6 py-3 hover:bg-oxford-mid transition-all"
        >
          <Icon name="globe" className="w-4 h-4" />
          آموزش ساخت پروژه Firebase
        </a>
      </div>
    );
  }

  if (user) {
    return (
      <div className="space-y-4">
        {/* User info */}
        <div className="bg-card border-2 border-line rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-oxford text-white grid place-items-center">
                <Icon name="user" className="w-8 h-8" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-display text-xl text-oxford">{user.displayName || 'کاربر'}</h3>
              <p className="text-[13px] text-mute">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full bg-gold text-oxford-deep font-bold text-[14px] rounded-xl py-3 hover:bg-[#f0b254] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {syncing ? (
              <>
                <span className="w-4 h-4 border-2 border-oxford-deep border-t-transparent rounded-full animate-spin" />
                در حال همگام‌سازی...
              </>
            ) : (
              <>
                <Icon name="repeat" className="w-5 h-5" />
                همگام‌سازی با ابر
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="w-full mt-3 bg-card border-2 border-bad/30 text-bad font-bold text-[13px] rounded-xl py-3 hover:border-bad transition-all"
          >
            خروج از حساب
          </button>
        </div>

        <p className="text-[12px] text-mute text-center leading-6">
          داده‌های شما (کلمات من، پیشرفت لایتنر) به‌صورت امن در ابر ذخیره می‌شود و می‌توانید از هر دستگاهی به آن‌ها دسترسی داشته باشید.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 text-[13px] font-bold rounded-xl py-2.5 border-2 transition-all ${
            mode === 'login' ? 'bg-oxford text-white border-oxford' : 'bg-card border-line text-ink'
          }`}
        >
          ورود
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`flex-1 text-[13px] font-bold rounded-xl py-2.5 border-2 transition-all ${
            mode === 'signup' ? 'bg-oxford text-white border-oxford' : 'bg-card border-line text-ink'
          }`}
        >
          ایجاد حساب
        </button>
      </div>

      {/* Google login */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-card border-2 border-line font-bold text-[14px] rounded-xl py-3 hover:border-oxford-mid/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {loading ? 'در حال پردازش...' : 'ورود با Google'}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-line" />
        <span className="text-[12px] text-mute">یا</span>
        <div className="flex-1 h-px bg-line" />
      </div>

      {/* Email/password form */}
      <div className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل"
          className="w-full bg-paper border-2 border-line focus:border-oxford-mid outline-none rounded-xl px-4 py-3 text-[14px]"
          dir="ltr"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          className="w-full bg-paper border-2 border-line focus:border-oxford-mid outline-none rounded-xl px-4 py-3 text-[14px]"
          dir="ltr"
        />
        <button
          onClick={handleEmailAuth}
          disabled={loading}
          className="w-full bg-oxford text-white font-bold text-[14px] rounded-xl py-3 hover:bg-oxford-mid transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'در حال پردازش...' : mode === 'login' ? 'ورود' : 'ایجاد حساب'}
        </button>
      </div>
    </div>
  );
}
