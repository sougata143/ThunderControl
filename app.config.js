module.exports = {
  expo: {
    name: "ThunderControl",
    slug: "thunder-control",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.thundercontrol",
      googleServicesFile: "./GoogleService-Info.plist",
      config: {
        googleSignIn: {
          reservedClientId: process.env.GOOGLE_IOS_CLIENT_ID
        }
      }
    },
    android: {
      package: "com.yourcompany.thundercontrol",
      googleServicesFile: "./google-services.json",
      permissions: ["INTERNET"]
    },
    plugins: [
      ["@react-native-google-signin/google-signin"],
      "expo-dev-client"
    ],
    scheme: "thundercontrol",
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
      googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
      eas: {
        projectId: "your-project-id"
      }
    },
    experiments: {
      tsconfigPaths: true
    },
    newArchEnabled: true
  }
};
