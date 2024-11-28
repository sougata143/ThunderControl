import { auth as firebaseAuth } from '../config/firebase';
import { 
  GoogleAuthProvider, 
  signInWithCredential,
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { Platform } from 'react-native';

// Ensure the auth session is completed properly
// maybeCompleteAuthSession(); // Removed this line as it's not used in the updated code

class GoogleAuthService {
  private static provider = new GoogleAuthProvider();
  // private static webClientId = ''; // Removed this line as it's not used in the updated code
  // private static iosClientId = ''; // Removed this line as it's not used in the updated code
  // private static androidClientId = ''; // Removed this line as it's not used in the updated code

  // private static [Google.useIdTokenAuthRequest, authRequest] = Google.useIdTokenAuthRequest({ // Removed this line as it's not used in the updated code
  //   clientId: Platform.select({
  //     ios: GoogleAuthService.iosClientId,
  //     android: GoogleAuthService.androidClientId,
  //     default: GoogleAuthService.webClientId,
  //   }),
  //   iosClientId: GoogleAuthService.iosClientId,
  //   androidClientId: GoogleAuthService.androidClientId,
  // });

  static async signIn() {
    try {
      const auth = getAuth();
      
      // Add scopes that you want to request from the user
      this.provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      this.provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

      if (Platform.OS === 'web') {
        const result = await signInWithPopup(auth, this.provider);
        return result.user;
      } else {
        // For mobile platforms, we'll need to implement native Google Sign-In
        // This will be implemented in the next iteration
        throw new Error('Mobile Google Sign-In is not yet implemented. Please use email/password authentication for now.');
      }
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  }

  // private static async signInWeb() { // Removed this line as it's not used in the updated code
  //   const auth = getAuth();
  //   const result = await signInWithPopup(auth, this.provider);
  //   return result.user;
  // }

  // private static async signInMobile() { // Removed this line as it's not used in the updated code
  //   const auth = getAuth();
    
  //   // Prompt the user to sign in
  //   const { type, params } = await this.authRequest();
    
  //   if (type !== 'success') {
  //     throw new Error('Google sign in was not successful');
  //   }

  //   // Create a Google credential with the token
  //   const { id_token } = params;
  //   const credential = GoogleAuthProvider.credential(id_token);

  //   // Sign in with the credential
  //   const result = await signInWithCredential(auth, credential);
  //   return result.user;
  // }

  static async signOut() {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  }
}

export default GoogleAuthService;
