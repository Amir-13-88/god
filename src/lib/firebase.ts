import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️ مهم: این یک config نمونه است
// برای استفاده واقعی، باید پروژه Firebase خودت رو بسازی و config واقعی رو جایگزین کنی
// آموزش: https://firebase.google.com/docs/web/setup

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app: any = null;
let auth: any = null;
let db: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization failed - running in offline mode');
}

export { auth, db };
export const googleProvider = new GoogleAuthProvider();

// بررسی اینکه Firebase فعال است یا نه
export const isFirebaseEnabled = () => {
  return app !== null && firebaseConfig.apiKey !== "YOUR_API_KEY";
};
