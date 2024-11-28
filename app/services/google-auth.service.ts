import { auth as firebaseAuth } from '../config/firebase';
import { 
  GoogleAuthProvider, 
  signInWithCredential,
  getAuth,
  signOut,
  signInWithPopup
} from 'firebase/auth';
import { Platform } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.googleWebClientId,
  iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
  androidClientId: Constants.expoConfig?.extra?.googleAndroidClientId,
  offlineAccess: true,
});

class GoogleAuthService {
  private static provider = new GoogleAuthProvider();

  static async signIn() {
    try {
      if (Platform.OS === 'web') {
        return await this.webSignIn();
      } else {
        return await this.nativeSignIn();
      }
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  }

  private static async webSignIn() {
    try {
      const auth = getAuth();
      this.provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      this.provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      const result = await signInWithPopup(auth, this.provider);
      return result.user;
    } catch (error: any) {
      console.error('Web Google Sign In Error:', error);
      throw error;
    }
  }

  private static async nativeSignIn() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(firebaseAuth, googleCredential);
      return userCredential.user;
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Play services not available or outdated');
      } else {
        throw error;
      }
    }
  }

  static async signOut() {
    try {
      const auth = getAuth();
      if (Platform.OS !== 'web') {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      await auth.signOut();
    } catch (error: any) {
      console.error('Google Sign Out Error:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      if (Platform.OS === 'web') {
        return getAuth().currentUser;
      } else {
        const currentUser = await GoogleSignin.getCurrentUser();
        return currentUser;
      }
    } catch (error) {
      return null;
    }
  }
}

export default GoogleAuthService;
