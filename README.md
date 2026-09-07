# 🎓 لایتنر زبان - دیکشنری آفلاین انگلیسی-فارسی

یک برنامه کامل برای یادگیری زبان انگلیسی با سیستم مرور لایتنر، دیکشنری آفلاین با ۷۰۰۰+ واژه، و همگام‌سازی ابری.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Firebase](https://img.shields.io/badge/firebase-ready-orange)

---

## ✨ ویژگی‌ها

### 📚 دیکشنری آفلاین
- ✅ **۷۰۰۰+ واژه** با تعریف انگلیسی، معنی فارسی، مثال و تلفظ IPA
- ✅ دسته‌بندی بر اساس سطح CEFR (A1 تا C2)
- ✅ جست‌وجوی سریع و هوشمند
- ✅ کاملاً آفلاین کار می‌کنه

### 🔄 سیستم مرور لایتنر
- ✅ فاصله‌های مرور: ۱، ۳، ۷، ۲۱، ۳۰ و ۹۰ روز
- ✅ کارت‌های چرخشی سه‌بعدی
- ✅ گزارش پیشرفت و آمار

### 🌐 همگام‌سازی ابری (با Firebase)
- ✅ ورود با Google یا ایمیل
- ✅ ذخیره داده‌ها در ابر
- ✅ دسترسی از چند دستگاه
- ✅ پشتیبان‌گیری خودکار

### 📱 Progressive Web App (PWA)
- ✅ نصب روی موبایل و دسکتاپ
- ✅ کارکرد آفلاین کامل
- ✅ اعلان‌های یادآوری

---

## 🚀 شروع سریع

### روش ۱: فقط استفاده از برنامه (بدون Firebase)

اگه فقط می‌خوای برنامه رو استفاده کنی و نیازی به همگام‌سازی ابری نداری:

```bash
# ۱. نصب وابستگی‌ها
npm install

# ۲. اجرای برنامه
npm run dev

# ۳. باز کردن در مرورگر
# برو به: http://localhost:5173
```

✅ **تمام!** برنامه آماده استفاده‌ست.

---

### روش ۲: استفاده با همگام‌سازی ابری (با Firebase)

اگه می‌خوای داده‌هات در ابر ذخیره بشه و از چند دستگاه بهشون دسترسی داشته باشی:

#### گزینه الف: استفاده از اسکریپت خودکار (توصیه می‌شه)

```bash
# ۱. نصب وابستگی‌ها
npm install

# ۲. اجرای اسکریپت راه‌اندازی
node setup-firebase.js

# ۳. مقادیر Firebase رو وارد کن (از Firebase Console کپی کن)

# ۴. تمام! برنامه آماده‌ست
```

#### گزینه ب: راه‌اندازی دستی

اگه می‌خوای دستی راه‌اندازی کنی، این راهنماها رو بخون:

1. **راهنمای خیلی ساده (برای مبتدیان مطلق)**: [`SIMPLE_GUIDE.md`](./SIMPLE_GUIDE.md)
2. **راهنمای کامل با جزئیات**: [`FIREBASE_SETUP_GUIDE.md`](./FIREBASE_SETUP_GUIDE.md)
3. **منابع و لینک‌های مفید**: [`RESOURCES.md`](./RESOURCES.md)

---

## 📖 راهنمای کامل

### 🎯 کدوم راهنما رو بخونم؟

| وضعیت تو | راهنما | مدت زمان |
|----------|--------|----------|
| هیچی بلد نیستم | [`SIMPLE_GUIDE.md`](./SIMPLE_GUIDE.md) | ۱۰ دقیقه |
| می‌خوام دقیق یاد بگیرم | [`FIREBASE_SETUP_GUIDE.md`](./FIREBASE_SETUP_GUIDE.md) | ۳۰ دقیقه |
| می‌خوام بیشتر یاد بگیرم | [`RESOURCES.md`](./RESOURCES.md) | ۱ هفته |

---

## 🛠️ دستورات

```bash
# نصب وابستگی‌ها
npm install

# اجرای برنامه در حالت توسعه
npm run dev

# Build برای production
npm run build

# پیش‌نمایش build
npm run preview

# راه‌اندازی Firebase
node setup-firebase.js
```

---

## 📁 ساختار پروژه

```
leitner-language/
├── src/
│   ├── components/       # کامپوننت‌های React
│   │   ├── DictionaryView.tsx
│   │   ├── MyWordsView.tsx
│   │   ├── ReviewView.tsx
│   │   ├── AddWordView.tsx
│   │   ├── SettingsView.tsx
│   │   ├── AccountView.tsx
│   │   └── ...
│   ├── data/            # داده‌های دیکشنری (۷۰۰۰+ واژه)
│   │   ├── dict-a.ts
│   │   ├── dict-b.ts
│   │   └── ...
│   ├── lib/             # کتابخانه‌ها و سرویس‌ها
│   │   ├── firebase.ts  # پیکربندی Firebase
│   │   ├── auth.ts      # سرویس احراز هویت
│   │   ├── sync.ts      # سرویس همگام‌سازی
│   │   ├── dictionary.ts
│   │   ├── leitner.ts
│   │   └── enrich.ts
│   ├── store.tsx        # مدیریت state
│   ├── App.tsx          # کامپوننت اصلی
│   └── main.tsx         # نقطه ورود
├── public/              # فایل‌های استاتیک
├── SIMPLE_GUIDE.md      # راهنمای خیلی ساده
├── FIREBASE_SETUP_GUIDE.md  # راهنمای کامل
├── RESOURCES.md         # منابع و لینک‌ها
├── setup-firebase.js    # اسکریپت راه‌اندازی
└── README.md            # این فایل
```

---

## 🔥 راه‌اندازی Firebase

### مراحل سریع:

1. **ساخت پروژه Firebase**
   - برو به: https://console.firebase.google.com/
   - یک پروژه جدید بساز

2. **فعال‌سازی Authentication**
   - Authentication > Get started
   - Google و Email/Password رو فعال کن

3. **ساخت Firestore Database**
   - Firestore Database > Create database
   - Location: europe-west3 یا asia-south1
   - Start in test mode

4. **گرفتن پیکربندی**
   - Project Settings > Your apps > Web app
   - پیکربندی رو کپی کن

5. **جایگزینی در کد**
   - فایل `src/lib/firebase.ts` رو باز کن
   - مقادیر رو جایگزین کن

یا از اسکریپت خودکار استفاده کن:
```bash
node setup-firebase.js
```

---

## 🎨 تکنولوژی‌ها

- **React 18** - فریمورک UI
- **TypeScript** - زبان برنامه‌نویسی
- **Vite** - Build tool
- **Tailwind CSS** - استایل‌دهی
- **Firebase** - بک‌اند و احراز هویت
- **LocalStorage** - ذخیره‌سازی محلی

---

## 📱 نصب به عنوان PWA

### روی موبایل:

**اندروید (Chrome):**
1. برنامه رو در Chrome باز کن
2. روی منوی ⋮ کلیک کن
3. "Add to Home screen" رو انتخاب کن

**iOS (Safari):**
1. برنامه رو در Safari باز کن
2. روی دکمه Share کلیک کن
3. "Add to Home Screen" رو انتخاب کن

### روی دسکتاپ:

**Chrome/Edge:**
1. برنامه رو باز کن
2. روی آیکون نصب در نوار آدرس کلیک کن

---

## 🔒 امنیت

- ✅ داده‌های کاربران در Firestore با قوانین امنیتی محافظت می‌شن
- ✅ هر کاربر فقط به داده‌های خودش دسترسی داره
- ✅ احراز هویت با Google و Email
- ✅ رمز عبور به صورت هش شده ذخیره می‌شه

---

## 🐛 رفع مشکلات رایج

### مشکل: "Cannot find module 'firebase'"
```bash
npm install firebase
```

### مشکل: "Permission denied"
1. برو به Firebase Console > Firestore Database > Rules
2. قوانین رو به این تغییر بده:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
3. روی "Publish" کلیک کن

### مشکل: "API key not valid"
- پیکربندی Firebase رو دوباره کپی کن
- مطمئن شو همه مقادیر رو درست جایگزین کردی

### مشکل: برنامه سفید می‌مونه
- Console مرورگر (F12) رو باز کن
- خطاها رو چک کن
- `npm run build` رو دوباره اجرا کن

---

## 📊 آمار پروژه

- **۷۰۰۰+ واژه** در دیکشنری
- **۱۲ فایل داده** برای بارگذاری تنبل
- **۶ سطح CEFR** (A1 تا C2)
- **۱۱ دسته موضوعی**
- **۶ فاصله مرور** در سیستم لایتنر

---

## 🤝 مشارکت

اگه می‌خوای مشارکت کنی:

1. Fork کن
2. Branch جدید بساز: `git checkout -b feature/amazing-feature`
3. Commit کن: `git commit -m 'Add amazing feature'`
4. Push کن: `git push origin feature/amazing-feature`
5. Pull Request باز کن

---

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده.

---

## 📞 پشتیبانی

اگه سوالی داری یا به مشکل برخوردی:

1. راهنماها رو بخون:
   - [`SIMPLE_GUIDE.md`](./SIMPLE_GUIDE.md)
   - [`FIREBASE_SETUP_GUIDE.md`](./FIREBASE_SETUP_GUIDE.md)
   - [`RESOURCES.md`](./RESOURCES.md)

2. در Stack Overflow جستجو کن

3. Issue باز کن

---

## 🎉 تشکر

ممنون که از این پروژه استفاده می‌کنی!

اگه خوشت اومد، یک ⭐ بده!

---

**ساخته شده با ❤️ برای یادگیری زبان انگلیسی**
