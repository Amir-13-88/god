# 📘 راهنمای کامل و گام به گام راه‌اندازی Firebase

این راهنما به شما کمک می‌کنه تا در **کمتر از ۱۰ دقیقه** بک‌اند برنامه رو راه‌اندازی کنید.

---

## 🤔 Firebase چیست؟

Firebase یک سرویس گوگل است که به شما اجازه می‌ده:
- ✅ کاربران ثبت‌نام و ورود کنند (با گوگل یا ایمیل)
- ✅ داده‌ها رو در ابر ذخیره کنید
- ✅ از چند دستگاه به یک حساب دسترسی داشته باشید
- ✅ کاملاً رایگان برای استفاده شخصی

---

## 📋 پیش‌نیازها

- یک حساب گوگل (Gmail)
- مرورگر وب (Chrome پیشنهاد می‌شه)
- ۱۰ دقیقه وقت

---

## 🚀 مرحله ۱: ساخت پروژه Firebase

### گام ۱.۱: ورود به Firebase Console

1. مرورگر رو باز کن
2. برو به: **https://console.firebase.google.com/**
3. با حساب گوگل خودت وارد شو

### گام ۱.۲: ساخت پروژه جدید

1. روی دکمه **"Add project"** یا **"ایجاد پروژه"** کلیک کن
2. در فیلد **"Project name"** یک نام وارد کن، مثلاً:
   ```
   Leitner Language App
   ```
3. روی **"Continue"** کلیک کن
4. در صفحه **"Google Analytics"**:
   - می‌تونی **"Enable Google Analytics"** رو خاموش کنی (اختیاریه)
   - یا اگه می‌خوای آمار استفاده رو ببینی، روشن بذار
5. روی **"Create project"** کلیک کن
6. صبر کن تا پروژه ساخته بشه (حدود ۳۰ ثانیه)
7. وقتی آماده شد، روی **"Continue"** کلیک کن

---

## 🔐 مرحله ۲: فعال‌سازی Authentication

### گام ۲.۱: رفتن به بخش Authentication

1. در منوی سمت چپ، روی **"Authentication"** کلیک کن
2. روی دکمه **"Get started"** یا **"شروع به کار"** کلیک کن

### گام ۲.۲: فعال‌سازی ورود با Google

1. در تب **"Sign-in method"**، روی **"Google"** کلیک کن
2. سوئیچ **"Enable"** رو روشن کن
3. در فیلد **"Project support email"**، ایمیل خودت رو انتخاب کن
4. روی **"Save"** کلیک کن

### گام ۲.۳: فعال‌سازی ورود با ایمیل/رمز عبور

1. دوباره به تب **"Sign-in method"** برگرد
2. روی **"Email/Password"** کلیک کن
3. سوئیچ **"Enable"** رو روشن کن
4. روی **"Save"** کلیک کن

✅ حالا کاربران می‌تونن هم با گوگل و هم با ایمیل وارد بشن!

---

## 🗄️ مرحله ۳: ساخت Firestore Database

### گام ۳.۱: رفتن به بخش Firestore

1. در منوی سمت چپ، روی **"Firestore Database"** کلیک کن
2. روی دکمه **"Create database"** کلیک کن

### گام ۳.۲: انتخاب موقعیت سرور

1. در dropdown **"Cloud Firestore location"**، یک موقعیت انتخاب کن:
   - برای کاربران ایران: **`europe-west1`** یا **`europe-west3`** (آلمان/بلژیک)
   - یا **`asia-south1`** (هند) - نزدیک‌تر به ایران
2. روی **"Next"** کلیک کن

### گام ۳.۳: انتخاب حالت امنیتی

1. **"Start in test mode"** رو انتخاب کن
   - این برای تست و توسعه مناسبه
   - بعداً می‌تونی قوانین امنیتی رو تغییر بدی
2. روی **"Enable"** کلیک کن
3. صبر کن تا Database ساخته بشه

✅ حالا پایگاه داده آماده‌ست!

---

## 🔑 مرحله ۴: گرفتن پیکربندی Firebase

### گام ۴.۱: رفتن به تنظیمات پروژه

1. روی آیکون **چرخ‌دنده (⚙️)** در کنار **"Project Overview"** کلیک کن
2. روی **"Project settings"** کلیک کن

### گام ۴.۲: اضافه کردن Web App

1. در بخش **"Your apps"**، روی آیکون **وب (</>)** کلیک کن
2. در فیلد **"App nickname"** یک نام وارد کن، مثلاً:
   ```
   Leitner Web App
   ```
3. تیک **"Also set up Firebase Hosting"** رو **نزن** (نیاز نیست)
4. روی **"Register app"** کلیک کن

### گام ۴.۳: کپی کردن پیکربندی

1. یک بلوک کد می‌بینی که شبیه اینه:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef..."
   };
   ```

2. **کل این بلوک رو کپی کن** (از `const firebaseConfig = {` تا `};`)

---

## 💻 مرحله ۵: جایگزینی در کد

### گام ۵.۱: باز کردن فایل پیکربندی

1. در ویرایشگر کد، فایل **`src/lib/firebase.ts`** رو باز کن
2. بخش `firebaseConfig` رو پیدا کن (خطوط ۴ تا ۱۱)

### گام ۵.۲: جایگزینی مقادیر

کد فعلی رو با مقادیر خودت جایگزین کن:

**قبل:**
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**بعد (با مقادیر واقعی):**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyB1xY2z3A4bC5dE6fG7hI8jK9lM0nO1pQ",
  authDomain: "leitner-language-app.firebaseapp.com",
  projectId: "leitner-language-app",
  storageBucket: "leitner-language-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### گام ۵.۳: ذخیره فایل

- فایل رو ذخیره کن (Ctrl+S یا Cmd+S)

---

## 🧪 مرحله ۶: تست کردن

### گام ۶.۱: اجرای برنامه

1. در ترمینال، برنامه رو اجرا کن:
   ```bash
   npm run dev
   ```

2. مرورگر رو باز کن و برو به آدرس نمایش داده شده (معمولاً `http://localhost:5173`)

### گام ۶.۲: تست ورود

1. روی تب **"برنامه"** در پایین صفحه کلیک کن
2. روی تب **"حساب کاربری"** کلیک کن
3. یکی از روش‌های ورود رو امتحان کن:
   - **ورود با Google**: روی دکمه سبز کلیک کن و حساب گوگل رو انتخاب کن
   - **ورود با ایمیل**: ایمیل و رمز عبور رو وارد کن

### گام ۶.۳: تست همگام‌سازی

1. بعد از ورود، چند واژه به مجموعه‌ات اضافه کن
2. روی دکمه **"آپلود در ابر"** کلیک کن
3. باید پیام **"داده‌ها با موفقیت در ابر ذخیره شد"** رو ببینی

### گام ۶.۴: بررسی در Firebase Console

1. به **Firebase Console** برگرد
2. روی **"Firestore Database"** کلیک کن
3. باید یک collection به نام **`users`** ببینی
4. داخلش، یک document با ID کاربرت هست
5. داخلش، داده‌های شما (savedWords و importedWords) ذخیره شده

✅ تبریک! بک‌اند کاملاً کار می‌کنه! 🎉

---

## 🔒 مرحله ۷: قوانین امنیتی (اختیاری ولی توصیه شده)

برای امنیت بیشتر، قوانین Firestore رو تغییر بده:

### گام ۷.۱: رفتن به بخش Rules

1. در **Firebase Console**، به **"Firestore Database"** برو
2. روی تب **"Rules"** کلیک کن

### گام ۷.۲: جایگزینی قوانین

قوانین فعلی رو پاک کن و این کد رو جایگزین کن:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // کاربران فقط به داده‌های خودشون دسترسی داشته باشن
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // بقیه مسیرها مسدود
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### گام ۷.۳: انتشار قوانین

1. روی **"Publish"** کلیک کن
2. صبر کن تا قوانین اعمال بشن

✅ حالا فقط خود کاربر می‌تونه به داده‌هاش دسترسی داشته باشه!

---

## 🌐 مرحله ۸: استقرار روی اینترنت (اختیاری)

اگه می‌خوای برنامه رو روی اینترنت قرار بدی تا دیگران هم استفاده کنن:

### گزینه ۱: Firebase Hosting (رایگان)

1. در ترمینال، Firebase CLI رو نصب کن:
   ```bash
   npm install -g firebase-tools
   ```

2. وارد Firebase شو:
   ```bash
   firebase login
   ```

3. پروژه رو init کن:
   ```bash
   firebase init hosting
   ```
   - پروژه رو انتخاب کن
   - **"dist"** رو به عنوان public directory انتخاب کن
   - **"Yes"** برای single-page app
   - **"No"** برای automatic builds

4. برنامه رو build کن:
   ```bash
   npm run build
   ```

5. استقرار کن:
   ```bash
   firebase deploy
   ```

6. یک URL مثل `https://your-project.web.app` می‌گیری!

### گزینه ۲: Vercel (رایگان و ساده‌تر)

1. کد رو در GitHub آپلود کن
2. به **https://vercel.com** برو
3. با GitHub وارد شو
4. پروژه رو import کن
5. Vercel خودکار build و deploy می‌کنه

---

## ❓ سوالات متداول

### س: آیا Firebase واقعاً رایگانه؟
**ج:** بله! پلن رایگان Firebase (Spark) برای استفاده شخصی کاملاً کافیه:
- 50,000 خواندن در روز
- 20,000 نوشتن در روز
- 1 GB ذخیره‌سازی
- 10 GB انتقال داده در ماه

### س: اگه Firebase رو پیکربندی نکنم چی می‌شه؟
**ج:** برنامه همچنان به‌صورت آفلاین کار می‌کنه. فقط تب "حساب کاربری" کار نمی‌کنه و داده‌ها فقط روی همون دستگاه ذخیره می‌شن.

### س: چطور داده‌های ابری رو پاک کنم؟
**ج:** در Firebase Console، به Firestore Database برو و collection `users` رو پاک کن.

### س: اگه فراموش کردم رمز عبورم رو چی کار کنم؟
**ج:** در صفحه ورود، روی "فراموشی رمز عبور" کلیک کن و ایمیل خودت رو وارد کن. لینک بازیابی برات ارسال می‌شه.

### س: چطور آمار استفاده رو ببینم؟
**ج:** در Firebase Console، به بخش "Analytics" برو (اگه فعال کرده باشی).

---

## 🆘 نیاز به کمک داری؟

اگه به مشکل برخوردی:

1. **خطای "apiKey" یا "auth"**: مطمئن شو پیکربندی رو درست کپی کردی
2. **خطای "permission-denied"**: قوانین Firestore رو چک کن
3. **خطای "network"**: اتصال اینترنتت رو چک کن
4. **مشکل دیگه**: Console مرورگر (F12) رو باز کن و خطاها رو ببین

---

## 🎊 تمام!

تبریک! شما با موفقیت بک‌اند برنامه رو راه‌اندازی کردی. حالا برنامه‌ات یک **Full-Stack App** کامله با:

✅ دیکشنری آفلاین با ۷۰۰۰+ واژه  
✅ سیستم مرور لایتنر  
✅ احراز هویت با گوگل و ایمیل  
✅ همگام‌سازی ابری  
✅ دسترسی از چند دستگاه  

موفق باشی! 🚀
