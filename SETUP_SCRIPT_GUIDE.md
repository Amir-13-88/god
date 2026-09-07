# 🎯 راهنمای استفاده از اسکریپت راه‌اندازی Firebase

**این راهنما برای کسانی نوشته شده که می‌خوان سریع و راحت Firebase رو راه‌اندازی کنن!**

---

## 🤔 اسکریپت چیه؟

یک برنامه کوچک که به جای اینکه دستی فایل‌ها رو ویرایش کنی، **خودکار همه کار رو انجام می‌ده!**

فقط کافیه مقادیر Firebase رو وارد کنی، خودش:
- ✅ فایل `firebase.ts` رو ویرایش می‌کنه
- ✅ مقادیر رو جایگزین می‌کنه
- ✅ حتی می‌تونه برنامه رو اجرا کنه

---

## 🚀 استفاده از اسکریپت (۳ مرحله ساده)

### مرحله ۱: مقادیر Firebase رو آماده کن

1. برو به **Firebase Console**: https://console.firebase.google.com/
2. پروژه خودت رو باز کن
3. روی آیکون **چرخ‌دنده (⚙️)** کلیک کن
4. روی **"Project settings"** کلیک کن
5. پایین صفحه، در قسمت **"Your apps"**، روی آیکون **وب (</>)** کلیک کن
6. یک بلوک کد می‌بینی. **اون رو کپی کن**

شبیه اینه:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1xY2z3A4bC5dE6fG7hI8jK9lM0nO1pQ",
  authDomain: "leitner-app.firebaseapp.com",
  projectId: "leitner-app",
  storageBucket: "leitner-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### مرحله ۲: اسکریپت رو اجرا کن

ترمینال (Command Prompt یا Terminal) رو باز کن و این دستور رو بزن:

```bash
node setup-firebase.js
```

### مرحله ۳: مقادیر رو وارد کن

اسکریپت ازت سوال می‌پرسه. مقادیر رو از بلوکی که کپی کردی وارد کن:

```
🔥 راه‌اندازی Firebase برای لایتنر زبان

📋 قبل از شروع، مطمئن شو که:
   1. یک پروژه Firebase ساختی
   2. Authentication رو فعال کردی
   3. Firestore Database ساختی
   4. پیکربندی Web App رو کپی کردی

آماده‌ای شروع کنیم؟ (yes/no): yes

📝 مقادیر Firebase Config رو وارد کن:

🔑 apiKey: AIzaSyB1xY2z3A4bC5dE6fG7hI8jK9lM0nO1pQ
🌐 authDomain: leitner-app.firebaseapp.com
📦 projectId: leitner-app
💾 storageBucket: leitner-app.appspot.com
📨 messagingSenderId: 123456789012
📱 appId: 1:123456789012:web:abcdef1234567890

✅ بررسی مقادیر...

📝 پیکربندی:
{
  "apiKey": "AIzaSyB1xY2z3A4bC5dE6fG7hI8jK9lM0nO1pQ",
  "authDomain": "leitner-app.firebaseapp.com",
  "projectId": "leitner-app",
  "storageBucket": "leitner-app.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abcdef1234567890"
}

این مقادیر درسته؟ (yes/no): yes

⚙️  در حال به‌روزرسانی فایل firebase.ts...
✅ فایل firebase.ts به‌روزرسانی شد!

🧪 می‌خوای الان تست کنی؟ (yes/no): yes

🚀 در حال اجرای برنامه...
```

✅ **تمام!** برنامه اجرا می‌شه و می‌تونی تست کنی!

---

## 📋 مثال کامل

### ورودی‌ها:

```
🔑 apiKey: AIzaSyB1xY2z3A4bC5dE6fG7hI8jK9lM0nO1pQ
🌐 authDomain: leitner-app.firebaseapp.com
📦 projectId: leitner-app
💾 storageBucket: leitner-app.appspot.com
📨 messagingSenderId: 123456789012
📱 appId: 1:123456789012:web:abcdef1234567890
```

### خروجی:

فایل `src/lib/firebase.ts` به صورت خودکار ویرایش می‌شه و مقادیر جایگزین می‌شن.

---

## 🧪 تست کردن

بعد از اجرای اسکریپت:

1. برنامه اجرا می‌شه (اگه "yes" زدی)
2. برو به: http://localhost:5173
3. روی تب **"برنامه"** در پایین صفحه کلیک کن
4. روی تب **"حساب کاربری"** کلیک کن
5. روی دکمه **"ورود با Google"** کلیک کن
6. حساب گوگل خودت رو انتخاب کن

✅ اگه وارد شدی، تبریک! Firebase کار می‌کنه! 🎉

---

## ❓ سوالات متداول

### س: اگه اشتباه وارد کردم چی؟
**ج:** دوباره اسکریپت رو اجرا کن و مقادیر درست رو وارد کن.

### س: اگه نمی‌دونم مقادیر کجاست؟
**ج:** به راهنمای [`SIMPLE_GUIDE.md`](./SIMPLE_GUIDE.md) مراجعه کن. مرحله ۵ رو بخون.

### س: اگه اسکریپت کار نکرد؟
**ج:** 
1. مطمئن شو Node.js نصبه: `node --version`
2. اگه نصب نیست، از https://nodejs.org دانلود کن
3. دوباره امتحان کن

### س: اگه می‌خوام دستی ویرایش کنم؟
**ج:** فایل `src/lib/firebase.ts` رو باز کن و مقادیر رو دستی جایگزین کن.

---

## 🎯 خلاصه

```bash
# ۱. اجرای اسکریپت
node setup-firebase.js

# ۲. وارد کردن مقادیر
# (از Firebase Console کپی کن)

# ۳. تست کردن
# برنامه اجرا می‌شه، برو به تب "حساب کاربری"
```

---

## 🆘 نیاز به کمک داری؟

اگه به مشکل خوردی:

1. **راهنمای خیلی ساده**: [`SIMPLE_GUIDE.md`](./SIMPLE_GUIDE.md)
2. **راهنمای کامل**: [`FIREBASE_SETUP_GUIDE.md`](./FIREBASE_SETUP_GUIDE.md)
3. **منابع**: [`RESOURCES.md`](./RESOURCES.md)

موفق باشی! 💪
