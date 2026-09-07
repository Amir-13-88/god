# لایتنر زبان - راهنمای فعال‌سازی بک‌اند (Firebase)

## 🎉 تبریک! بک‌اند اضافه شد

برنامه الان شامل سیستم احراز هویت و همگام‌سازی ابری با **Firebase** است.

## ✨ قابلیت‌های جدید

- ✅ **ورود با Google** - سریع و آسان
- ✅ **ورود با ایمیل/رمز عبور** - برای کسانی که ترجیح می‌دن
- ✅ **همگام‌سازی ابری** - داده‌های شما (کلمات من، پیشرفت لایتنر) در ابر ذخیره می‌شه
- ✅ **دسترسی از چند دستگاه** - با یک حساب، از هر جایی به داده‌هات دسترسی داشته باش

## 🚀 راه‌اندازی Firebase (۵ دقیقه)

### مرحله ۱: ساخت پروژه Firebase

1. برو به [Firebase Console](https://console.firebase.google.com/)
2. روی **"Add project"** کلیک کن
3. یک نام انتخاب کن (مثلاً `leitner-language`)
4. Google Analytics رو می‌تونی غیرفعال کنی (اختیاری)
5. روی **"Create project"** کلیک کن

### مرحله ۲: فعال‌سازی Authentication

1. در منوی سمت چپ، روی **"Authentication"** کلیک کن
2. روی **"Get started"** کلیک کن
3. در تب **"Sign-in method"**، این روش‌ها رو فعال کن:
   - **Google** (برای ورود با Google)
   - **Email/Password** (برای ورود با ایمیل)

### مرحله ۳: ساخت Firestore Database

1. در منوی سمت چپ، روی **"Firestore Database"** کلیک کن
2. روی **"Create database"** کلیک کن
3. **"Start in test mode"** رو انتخاب کن (بعداً می‌تونی security rules رو تنظیم کنی)
4. یک location انتخاب کن (مثلاً `europe-west`)
5. روی **"Enable"** کلیک کن

### مرحله ۴: دریافت Firebase Config

1. در صفحه اصلی پروژه، روی آیکون **⚙️ (چرخ‌دنده)** کلیک کن
2. **"Project settings"** رو انتخاب کن
3. به پایین اسکرول کن تا بخش **"Your apps"** رو ببینی
4. روی آیکون **Web (</>)** کلیک کن
5. یک نام برای اپ انتخاب کن (مثلاً `leitner-web`)
6. روی **"Register app"** کلیک کن
7. یک بلوک کد مثل این می‌بینی:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### مرحله ۵: جایگزینی Config در برنامه

1. فایل `src/lib/firebase.ts` رو باز کن
2. مقادیر `firebaseConfig` رو با مقادیر واقعی جایگزین کن:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...", // مقدار واقعی
  authDomain: "your-project.firebaseapp.com", // مقدار واقعی
  projectId: "your-project-id", // مقدار واقعی
  storageBucket: "your-project.appspot.com", // مقدار واقعی
  messagingSenderId: "123456789", // مقدار واقعی
  appId: "1:123456789:web:abc123" // مقدار واقعی
};
```

3. فایل رو ذخیره کن

### مرحله ۶: بیلد و تست

```bash
npm run build
```

برنامه رو باز کن و برو به تب **"برنامه"** → **"حساب کاربری"**. الان می‌تونی:
- با Google وارد بشی
- یا یک حساب جدید بسازی
- داده‌هات رو با ابر همگام‌سازی کنی

## 🔒 امنیت (اختیاری ولی توصیه‌شده)

بعد از اینکه همه‌چیز کار کرد، می‌تونی **Firestore Security Rules** رو تنظیم کنی تا فقط کاربر بتونه به داده‌های خودش دسترسی داشته باشه:

1. برو به **Firestore Database** → **Rules**
2. این rules رو جایگزین کن:

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

3. روی **"Publish"** کلیک کن

## 💰 هزینه

Firebase یک **پلن رایگان** (Spark Plan) داره که شامل:
- 50,000 خواندن در روز
- 20,000 نوشتن در روز
- 1 GB ذخیره‌سازی
- 10 GB transfer در ماه

برای استفاده شخصی، این کاملاً کافیه و **رایگان** می‌مونه.

## 🐛 عیب‌یابی

### "Firebase پیکربندی نشده" می‌بینم
- مطمئن شو که `firebaseConfig` رو درست جایگزین کردی
- مطمئن شو که `apiKey` با `"YOUR_API_KEY"` جایگزین شده

### خطای "Permission denied"
- Security rules رو چک کن
- مطمئن شو که Authentication فعاله

### داده‌ها همگام‌سازی نمی‌شن
- Console مرورگر رو باز کن (F12) و ببین خطایی هست یا نه
- مطمئن شو که Firestore Database ساخته شده

## 📞 پشتیبانی

اگه مشکلی داشتی، [مستندات Firebase](https://firebase.google.com/docs) رو چک کن یا issue باز کن.

---

**نکته مهم**: اگه نمی‌خوای Firebase استفاده کنی، برنامه همچنان به‌صورت آفلاین کار می‌کنه. فقط تب "حساب کاربری" رو استفاده نکن.
