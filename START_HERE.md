# 👋 سلام! از اینجا شروع کن!

**تبریک! برنامه لایتنر زبان رو داری. حالا بیا راه‌اندازیش کنیم!**

---

## 🤔 اول بگو ببینم، چی می‌خوای؟

### گزینه ۱: "فقط می‌خوام برنامه کار کنه" (۲ دقیقه)
- نمی‌خوای Firebase راه‌اندازی کنی
- فقط می‌خوای برنامه رو باز کنی و استفاده کنی
- داده‌ها فقط روی همین دستگاه ذخیره می‌شن

**👉 برو به: [راهنمای شروع سریع](#گزینه-۱-شروع-سریع-بدون-firebase)**

---

### گزینه ۲: "می‌خوام داده‌هام در ابر ذخیره بشه" (۱۰ دقیقه)
- می‌خوای از چند دستگاه به داده‌هات دسترسی داشته باشی
- می‌خوای اگه مرورگر پاک شد، داده‌هات از بین نره
- می‌خوای با حساب گوگل وارد بشی

**👉 برو به: [راهنمای راه‌اندازی Firebase](#گزینه-۲-راه‌اندازی-firebase-با-همگام‌سازی-ابری)**

---

## 🚀 گزینه ۱: شروع سریع (بدون Firebase)

### مرحله ۱: نصب وابستگی‌ها

ترمینال (Command Prompt یا Terminal) رو باز کن و این دستور رو بزن:

```bash
npm install
```

صبر کن تا نصب تموم بشه (حدود ۱ دقیقه).

### مرحله ۲: اجرای برنامه

```bash
npm run dev
```

### مرحله ۳: باز کردن در مرورگر

مرورگر رو باز کن و برو به:

```
http://localhost:5173
```

✅ **تمام!** برنامه آماده استفاده‌ست!

---

## 🔥 گزینه ۲: راه‌اندازی Firebase (با همگام‌سازی ابری)

### روش الف: استفاده از فایل JSON (راحت‌ترین روش)

#### مرحله ۱: نصب وابستگی‌ها

```bash
npm install
```

#### مرحله ۲: گرفتن مقادیر از Firebase

1. برو به: https://console.firebase.google.com/
2. با حساب گوگل وارد شو
3. یک پروژه جدید بساز (نام: `leitner-app`)
4. Authentication رو فعال کن (Google + Email/Password)
5. Firestore Database بساز (location: europe-west3)
6. Project Settings > Your apps > Web app
7. پیکربندی رو کپی کن

#### مرحله ۳: ویرایش فایل JSON

فایل **`firebase-config.json`** رو باز کن و مقادیر رو جایگزین کن:

**قبل:**
```json
{
  "apiKey": "YOUR_API_KEY_HERE",
  "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT_ID.appspot.com",
  "messagingSenderId": "YOUR_SENDER_ID",
  "appId": "YOUR_APP_ID"
}
```

**بعد (با مقادیر واقعی):**
```json
{
  "apiKey": "AIzaSyB1xY2z3A4bC5dE6fG7hI8jK9lM0nO1pQ",
  "authDomain": "leitner-app.firebaseapp.com",
  "projectId": "leitner-app",
  "storageBucket": "leitner-app.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abcdef1234567890"
}
```

فایل رو ذخیره کن (Ctrl+S).

#### مرحله ۴: اجرای اسکریپت

```bash
node setup-firebase.js
```

اسکریپت ازت می‌پرسه:
```
📄 فایل firebase-config.json پیدا شد. می‌خوای از اون استفاده کنی؟ (yes/no): yes
✅ مقادیر از فایل خوانده شد

این مقادیر درسته؟ (yes/no): yes

⚙️  در حال به‌روزرسانی فایل firebase.ts...
✅ فایل firebase.ts به‌روزرسانی شد!
```

#### مرحله ۵: تست کردن

```bash
npm run dev
```

برو به تب **"برنامه"** > **"حساب کاربری"** و روی **"ورود با Google"** کلیک کن.

✅ **تمام!** Firebase کار می‌کنه! 🎉

---

### روش ب: استفاده از خط فرمان (برای کسانی که راحت‌ترن)

اگه می‌خوای مقادیر رو مستقیم در ترمینال وارد کنی:

```bash
node setup-firebase.js
```

اسکریپت ازت سوال می‌پرسه و مقادیر رو یکی یکی وارد کن.

---

## 📚 راهنماهای بیشتر

| راهنما | برای کی؟ | مدت زمان |
|--------|---------|----------|
| **این فایل** (START_HERE.md) | نقطه شروع | ۲ دقیقه |
| [`SIMPLE_GUIDE.md`](./SIMPLE_GUIDE.md) | مبتدیان مطلق | ۱۰ دقیقه |
| [`SETUP_SCRIPT_GUIDE.md`](./SETUP_SCRIPT_GUIDE.md) | استفاده از اسکریپت | ۵ دقیقه |
| [`FIREBASE_SETUP_GUIDE.md`](./FIREBASE_SETUP_GUIDE.md) | راهنمای کامل | ۳۰ دقیقه |
| [`RESOURCES.md`](./RESOURCES.md) | منابع یادگیری | ۱ هفته |

---

## ❓ سوالات متداول

### س: Node.js چیه و چطور نصبش کنم؟
**ج:** Node.js یک برنامه‌ست که برای اجرای اسکریپت‌ها لازمه.
- دانلود: https://nodejs.org/
- نسخه LTS رو دانلود کن
- نصب کن (Next > Next > Finish)

### س: ترمینال چیه؟
**ج:** 
- **ویندوز**: Command Prompt یا PowerShell
- **مک**: Terminal
- **لینوکس**: Terminal

### س: npm چیه؟
**ج:** npm یک ابزار برای نصب بسته‌های Node.js هست. با Node.js نصب می‌شه.

### س: اگه به مشکل خوردم چی؟
**ج:** 
1. راهنماهای بالا رو بخون
2. Console مرورگر (F12) رو چک کن
3. در Stack Overflow جستجو کن
4. یا Issue باز کن

---

## 🎯 خلاصه

### برای شروع سریع:
```bash
npm install
npm run dev
```

### برای راه‌اندازی Firebase:
```bash
npm install
# فایل firebase-config.json رو ویرایش کن
node setup-firebase.js
npm run dev
```

---

## 🎊 تمام!

حالا می‌دونی از کجا شروع کنی!

موفق باشی! 💪

---

**نیاز به کمک داری؟**
- راهنمای خیلی ساده: [`SIMPLE_GUIDE.md`](./SIMPLE_GUIDE.md)
- راهنمای کامل: [`FIREBASE_SETUP_GUIDE.md`](./FIREBASE_SETUP_GUIDE.md)
- منابع: [`RESOURCES.md`](./RESOURCES.md)
