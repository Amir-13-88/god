import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseEnabled } from './firebase';

// State
let currentUser: User | null = null;
let authCallback: ((user: User | null) => void) | null = null;

// Initialize auth listener
export function initAuth(callback: (user: User | null) => void) {
  authCallback = callback;
  
  if (!isFirebaseEnabled()) {
    console.log('Firebase not configured - auth disabled');
    callback(null);
    return;
  }

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    callback(user);
  });
}

// Sign in with Google
export async function signInWithGoogle(): Promise<User | null> {
  if (!isFirebaseEnabled()) {
    throw new Error('Firebase not configured');
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

// Sign in with email/password
export async function signInWithEmail(email: string, password: string): Promise<User | null> {
  if (!isFirebaseEnabled()) {
    throw new Error('Firebase not configured');
  }
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Email sign-in error:', error);
    throw error;
  }
}

// Create account with email/password
export async function createAccount(email: string, password: string): Promise<User | null> {
  if (!isFirebaseEnabled()) {
    throw new Error('Firebase not configured');
  }
  
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Create account error:', error);
    throw error;
  }
}

// Sign out
export async function signOut(): Promise<void> {
  if (!isFirebaseEnabled()) {
    throw new Error('Firebase not configured');
  }
  
  try {
    await firebaseSignOut(auth);
    currentUser = null;
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// Get current user
export function getCurrentUser(): User | null {
  return currentUser;
}
