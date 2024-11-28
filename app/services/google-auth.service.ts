import { auth as firebaseAuth } from '../config/firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import Constants from 'expo-constants';

// Keep configuration for future use
const config = {
  webClientId: Constants.expoConfig?.extra?.googleWebClientId,
  iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
  androidClientId: Constants.expoConfig?.extra?.googleAndroidClientId,
};

class GoogleAuthService {
  private static provider = new GoogleAuthProvider();

  static async signIn() {
    console.log('Google Sign-In is currently disabled');
    console.log('Configuration:', config);
    return null;
  }

  static async signOut() {
    console.log('Google Sign-Out is currently disabled');
    return null;
  }

  static async getCurrentUser() {
    return null;
  }
}

export default GoogleAuthService;
