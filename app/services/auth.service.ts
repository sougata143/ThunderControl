import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInAnonymously,
  linkWithCredential,
  EmailAuthProvider,
  signOut,
  User
} from 'firebase/auth';
import { 
  ref, 
  set,
  update,
  serverTimestamp,
  get
} from 'firebase/database';
import { auth, db } from '../config/firebase';
import { store } from '../store';
import { setUserData } from '../store/slices/authSlice';
import { setDeviceInfo } from '../store/slices/deviceSlice';

class AuthService {
  static async signUp(email: string, password: string, isParent: boolean): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      
      // Create user profile in realtime database
      await set(ref(db, `users/${user.uid}`), {
        email: user.email,
        isParent,
        createdAt: serverTimestamp(),
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async signIn(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async signInAsGuest(): Promise<User> {
    try {
      const { user } = await signInAnonymously(auth);
      
      // Create guest profile in realtime database with parent status
      const userData = {
        isGuest: true,
        isParent: true, // Guests are treated as parents with limited access
        createdAt: serverTimestamp(),
        lastAccess: serverTimestamp(),
      };
      
      await set(ref(db, `users/${user.uid}`), userData);
      
      // Update Redux store with user data and device info
      store.dispatch(setUserData({ userId: user.uid, data: userData }));
      store.dispatch(setDeviceInfo({ isParent: true }));
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async convertGuestToFull(email: string, password: string, isParent: boolean): Promise<User> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.isAnonymous) {
        throw new Error('No guest account to convert');
      }

      // Create credentials
      const credential = EmailAuthProvider.credential(email, password);
      
      // Link anonymous account with email/password
      const userCredential = await linkWithCredential(currentUser, credential);
      const { user } = userCredential;

      // Update user profile
      await update(ref(db, `users/${user.uid}`), {
        email: user.email,
        isGuest: false,
        isParent,
        convertedAt: serverTimestamp(),
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  static async resetPassword(email: string): Promise<void> {
    try {
      // Note: Firebase Web SDK does not have a direct method to send password reset email.
      // You may need to use Firebase Cloud Functions or another approach to achieve this.
      throw new Error('Not implemented');
    } catch (error) {
      throw error;
    }
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return auth.onAuthStateChanged(callback);
  }

  static isGuest(): boolean {
    const user = auth.currentUser;
    return user?.isAnonymous || false;
  }

  static async getUserProfile(userId: string): Promise<any> {
    try {
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
      return snapshot.val();
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
