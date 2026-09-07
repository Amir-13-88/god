# 🎯 راهنمای خیلی ساده برای مبتدیان مطلق

**این راهنما برای کسانی نوشته شده که هیچ تجربه‌ای ندارن!**

---

## 🤔 اول بگو ببینم، تو کی هستی؟

### حالت ۱: "من فقط می‌خوام برنامه کار کنه"
- نمی‌خوای Firebase راه‌اندازی کنی
- فقط می‌خوای برنامه رو باز کنی و استفاده کنی
- **راه‌حل**: هیچ کاری نکن! برنامه همین الان کار می‌کنه 👍

### حالت ۲: "می‌خوام داده‌هام در ابر ذخیره بشه"
- می‌خوای از چند دستگاه به داده‌هات دسترسی داشته باشی
- می‌خوای اگه مرورگر پاک شد، داده‌هات از بین نره
- **راه‌حل**: باید Firebase رو راه‌اندازی کنی (۱۰ دقیقه کار)

---

## 🚀 اگه حالت ۱ هستی: فقط برنامه رو باز کن!

### مرحله ۱: برنامه رو اجرا کن

1. ترمینال (Command Prompt یا Terminal) رو باز کن
2. برو به پوشه پروژه:
   ```bash
   cd مسیر/پروژه/تو
   ```

3. برنامه رو اجرا کن:
   ```bash
   npm run dev
   ```

4. مرورگر رو باز کن و برو به:
   ```
   http://localhost:5173
   ```

✅ **تمام!** برنامه آماده استفاده‌ست.

---

## 🔥 اگه حالت ۲ هستی: Firebase رو راه‌اندازی کن

**نترس! خیلی ساده‌ست. فقط ۱۰ دقیقه وقت می‌بره.**

### مرحله ۱: برو به سایت Firebase

1. مرورگر رو باز کن
2. این آدرس رو وارد کن:
   ```
   https://console.firebase.google.com/
   ```
3. با حساب گوگل (Gmail) خودت وارد شو

---

### مرحله ۲: یک پروژه جدید بساز

1. روی دکمه **"Add project"** کلیک کن
2. در قسمت **"Project name"** این رو بنویس:
   ```
   leitner-app
   ```
3. روی **"Continue"** کلیک کن
4. در صفحه بعد، **"Enable Google Analytics"** رو **خاموش** کن
5. روی **"Create project"** کلیک کن
6. صبر کن (حدود ۳۰ ثانیه)
7. وقتی آماده شد، روی **"Continue"** کلیک کن

✅ پروژه ساخته شد!

---

### مرحله ۳: Authentication رو فعال کن

1. در منوی سمت چپ، روی **"Authentication"** کلیک کن
2. روی **"Get started"** کلیک کن
3. در تب **"Sign-in method"**، روی **"Google"** کلیک کن
4. سوئیچ **"Enable"** رو روشن کن
5. روی **"Save"** کلیک کن
6. دوباره به **"Sign-in method"** برگرد
7. این بار روی **"Email/Password"** کلیک کن
8. سوئیچ **"Enable"** رو روشن کن
9. روی **"Save"** کلیک کن

✅ احراز هویت فعال شد!

---

### مرحله ۴: Database بساز

1. در منوی سمت چپ، روی **"Firestore Database"** کلیک کن
2. روی **"Create database"** کلیک کن
3. در قسمت **"Cloud Firestore location"**، یکی از این‌ها رو انتخاب کن:
   - **europe-west3** (فرانکفورت - نزدیک به ایران)
   - **asia-south1** (ممبئی - نزدیک به ایران)
4. روی **"Next"** کلیک کن
5. **"Start in test mode"** رو انتخاب کن
6. روی **"Enable"** کلیک کن

✅ Database آماده‌ست!

---

### مرحله ۵: پیکربندی رو بگیر

1. روی آیکون **چرخ‌دنده (⚙️)** در بالای صفحه کلیک کن
2. روی **"Project settings"** کلیک کن
3. پایین صفحه، در قسمت **"Your apps"**، روی آیکون **وب (</>)** کلیک کن
4. در قسمت **"App nickname"** بنویس:
   ```
   Leitner Web
   ```
5. روی **"Register app"** کلیک کن
6. یک بلوک کد می‌بینی. **کل اون بلوک رو کپی کن** (Ctrl+C)

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

---

### مرحله ۶: پیکربندی رو در کد جایگزین کن

1. ویرایشگر کد (VS Code) رو باز کن
2. فایل **`src/lib/firebase.ts`** رو باز کن
3. خطوط ۴ تا ۱۱ رو پیدا کن:

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

4. **این ۸ خط رو پاک کن**
5. **بلوکی که از Firebase کپی کردی رو جایگزین کن** (Ctrl+V)

**مثال:**

**قبل:**
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  ...
};
```

**بعد:**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyB1xY2z3A4bC5dE6fG7hI8jK9lM0nO1pQ",
  authDomain: "leitner-app.firebaseapp.com",
  projectId: "leitner-app",
  storageBucket: "leitner-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

6. فایل رو ذخیره کن (Ctrl+S)

---

### مرحله ۷: تست کن!

1. برنامه رو دوباره اجرا کن:
   ```bash
   npm run dev
   ```

2. مرورگر رو باز کن:
   ```
   http://localhost:5173
   ```

3. روی تب **"برنامه"** در پایین صفحه کلیک کن
4. روی تب **"حساب کاربری"** کلیک کن
5. روی دکمه **"ورود با Google"** کلیک کن
6. حساب گوگل خودت رو انتخاب کن

✅ اگه وارد شدی، تبریک! Firebase کار می‌کنه! 🎉

---

## ❓ اگه به مشکل خوردی

### مشکل ۱: "Cannot find module 'firebase'"
**راه‌حل:**
```bash
npm install firebase
```

### مشکل ۲: "Permission denied"
**راه‌حل:**
1. برو به Firebase Console
2. Firestore Database > Rules
3. این کد رو جایگزین کن:
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
4. روی **"Publish"** کلیک کن

### مشکل ۳: "API key not valid"
**راه‌حل:**
- پیکربندی رو دوباره از Firebase Console کپی کن
- مطمئن شو همه مقادیر رو درست جایگزین کردی

---

## 🎊 تمام!

اگه تونستی وارد بشی، یعنی Firebase راه‌اندازی شد!

حالا می‌تونی:
- ✅ با حساب گوگل وارد بشی
- ✅ داده‌هات در ابر ذخیره بشه
- ✅ از چند دستگاه به داده‌هات دسترسی داشته باشی

---

## 📞 کمک می‌خوای؟

اگه هر جایی گیر کردی:
1. اسکرین‌شات از خطا بگیر
2. بهم بگو کجا گیر کردی
3. کمکت می‌کنم!

موفق باشی! 💪
