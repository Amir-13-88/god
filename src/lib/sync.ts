import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseEnabled } from './firebase';
import { getCurrentUser } from './auth';

// User data structure
export interface UserData {
  saved: Record<string, any>; // Leitner saved words
  imported: any[]; // Custom imported words
  lastSync: number;
}

// Save user data to Firestore
export async function saveUserData(data: UserData): Promise<void> {
  if (!isFirebaseEnabled()) {
    throw new Error('Firebase not configured');
  }
  
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, {
      ...data,
      lastSync: Date.now()
    });
  } catch (error: any) {
    console.error('Save user data error:', error);
    throw error;
  }
}

// Load user data from Firestore
export async function loadUserData(): Promise<UserData | null> {
  if (!isFirebaseEnabled()) {
    throw new Error('Firebase not configured');
  }
  
  const user = getCurrentUser();
  if (!user) {
    return null;
  }

  try {
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    
    return null;
  } catch (error: any) {
    console.error('Load user data error:', error);
    throw error;
  }
}

// Sync local data with cloud
export async function syncWithCloud(
  localData: UserData,
  onConflict: (local: UserData, cloud: UserData | null) => Promise<UserData>
): Promise<UserData> {
  if (!isFirebaseEnabled()) {
    return localData;
  }
  
  const user = getCurrentUser();
  if (!user) {
    return localData;
  }

  try {
    // Load cloud data
    const cloudData = await loadUserData();
    
    // If no cloud data, just save local
    if (!cloudData) {
      await saveUserData(localData);
      return localData;
    }
    
    // If timestamps are different, ask user what to do
    if (cloudData.lastSync !== localData.lastSync) {
      const resolved = await onConflict(localData, cloudData);
      await saveUserData(resolved);
      return resolved;
    }
    
    return localData;
  } catch (error: any) {
    console.error('Sync error:', error);
    throw error;
  }
}
