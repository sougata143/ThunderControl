import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  getAuth
} from 'firebase/auth';
import { auth } from '../config/firebase';

class AuthService {
  static async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async signUp(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return {
        ...userCredential.user,
        isNewUser: true,
        role: 'parent'
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static signInAsGuest() {
    // Create a local guest user without Firebase authentication
    return {
      id: `guest_${Date.now()}`,
      email: null,
      displayName: 'Guest User',
      isGuest: true,
      role: 'parent',
      createdAt: new Date().toISOString()
    };
  }

  static async signOut(): Promise<void> {
    try {
      await getAuth().signOut();
    } catch (error) {
      throw error;
    }
  }

  static getCurrentUser(): any {
    const user = getAuth().currentUser;
    return user;
  }

  static onAuthStateChanged(callback: (user: any) => void): () => void {
    return getAuth().onAuthStateChanged(callback);
  }

  static isGuest(): boolean {
    const user = getAuth().currentUser;
    return user?.isAnonymous || false;
  }
}

export default AuthService;
