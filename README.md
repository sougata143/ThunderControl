# ThunderControl - Parental Control & Monitoring App

ThunderControl is a comprehensive mobile application built with React Native and Expo that helps parents monitor and manage their children's device usage. The app provides real-time monitoring, usage controls, and detailed activity reports.

## 🚀 Features

### Authentication & User Management
- Multi-role support (Parent/Child)
- Email & Password authentication
- Google Sign-in integration
- Optional guest account access
  - Full feature access in guest mode
  - Easy account creation when ready
  - Seamless guest-to-full account conversion
- Password reset functionality

### Parent Features
- Real-time device monitoring
- App usage statistics
- Screen time management
- Content filtering
- Location tracking
- Activity reports with sharing
- Multiple child device management
- Remote device control
- Custom rule creation
- Comprehensive device reports:
  - Activity Reports (app usage, screen time)
  - Location Reports (movement patterns, safe zones)
  - Communication Reports (calls, messages)
  - Safety Reports (alerts, blocked content)

### Child Features
- Simplified dashboard
- Time remaining indicators
- Emergency contact options
- Achievement tracking
- Educational content access

## 🎨 UI/UX Features
- Dynamic theme system with light/dark mode support
- Responsive layouts for all screen sizes
- Smooth animations and transitions
- Intuitive navigation with Expo Router
- Modern and clean design
- Accessibility support
- Loading states and progress indicators
- Share functionality for reports
- Interactive device management
- Visual feedback for user actions

## 🛠 Technology Stack

### Frontend
- React Native (with Expo SDK 52)
- TypeScript
- Expo Router v4 (for navigation)
- Redux Toolkit (state management)
- React Native Elements (UI components)
- React Native Reanimated (for animations)
- Expo Location
- Expo Battery
- Expo Device
- Expo FileSystem

### Backend & Services
- Firebase Authentication
- Firebase Realtime Database
- Firebase Cloud Functions
- Firebase Cloud Messaging (for notifications)
- AsyncStorage for local data

### Development Tools
- Expo CLI
- TypeScript
- ESLint
- Prettier

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v23.2.0 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/thundercontrol.git
   cd thundercontrol
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update Firebase configuration in `.env`:
     ```
     FIREBASE_API_KEY=your_api_key
     FIREBASE_AUTH_DOMAIN=your_auth_domain
     FIREBASE_DATABASE_URL=your_database_url
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_STORAGE_BUCKET=your_storage_bucket
     FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     FIREBASE_APP_ID=your_app_id
     ```

4. **Firebase Setup**
   - Create a new Firebase project
   - Enable Authentication (Email/Password and Google Sign-in)
   - Set up Realtime Database
   - Configure Firebase Rules
   - Add your app to Firebase project

5. **Google Sign-in Configuration**
   
   a. **Download Configuration Files**
   - Download `GoogleService-Info.plist` for iOS from Firebase Console
   - Download `google-services.json` for Android from Firebase Console

   b. **Place Configuration Files**
   - iOS: Place `GoogleService-Info.plist` in `ios/` directory
   - Android: Place `google-services.json` in `android/app/` directory

## Google OAuth Setup

### Prerequisites
- A Google Cloud Console account
- Access to the [Google Cloud Console](https://console.cloud.google.com/)
- Your app's bundle identifier and package name

### Setup Steps

1. **Create and Configure Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing project
   - Enable required APIs:
     - Google Sign-In API
     - Google+ API
     - People API

2. **Configure OAuth Consent Screen**
   - Navigate to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in required information:
     - App name: "ThunderControl"
     - User support email
     - Developer contact email
   - Add required scopes:
     - email
     - profile
     - openid

3. **Create OAuth Client IDs**
   
   a. **iOS Client ID**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "iOS" application type
   - Enter your app's bundle ID (e.g., "com.yourcompany.thundercontrol")
   - Save the client ID

   b. **Android Client ID**:
   - Choose "Android" application type
   - Enter your package name
   - Generate SHA-1 certificate:
     ```bash
     cd android && ./gradlew signingReport
     ```
   - Enter the SHA-1 fingerprint
   - Save the client ID

   c. **Web Client ID**:
   - Choose "Web application" type
   - Add authorized JavaScript origins
   - Add authorized redirect URIs
   - Save the client ID

4. **Configure Environment Variables**
   Add the following to your `.env` file:
   ```shell
   GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
   GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
   GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
   ```

5. **Download Configuration Files**
   - For iOS: Download `GoogleService-Info.plist`
   - For Android: Download `google-services.json`
   - Place both files in the project root directory

6. **Update app.config.js**
   Ensure your app.config.js has the correct configuration:
   ```javascript
   ios: {
     bundleIdentifier: "your.bundle.id",
     googleServicesFile: "./GoogleService-Info.plist",
     config: {
       googleSignIn: {
         reservedClientId: process.env.GOOGLE_IOS_CLIENT_ID
       }
     }
   },
   android: {
     package: "your.package.name",
     googleServicesFile: "./google-services.json"
   }
   ```

7. **Rebuild the Project**
   ```bash
   # Clean and rebuild
   npx expo prebuild --clean
   
   # For iOS, install pods
   cd ios && pod install && cd ..
   ```

### Troubleshooting

- If you encounter UTF-8 encoding issues with CocoaPods, add to your `~/.profile` or `~/.zshrc`:
  ```bash
  export LANG=en_US.UTF-8
  ```

- For Android build issues, ensure your `google-services.json` is properly formatted and placed in the project root

- For iOS build issues, verify that:
  - `GoogleService-Info.plist` is included in the Xcode project
  - Bundle ID matches in both Xcode and Google Cloud Console
  - Required pods are installed correctly

### Current Configuration

The app is configured with the following client IDs:
- Web Client ID: `109575996570-ffc2eu64vq9mgvkafdkk2fk2mk120ik9.apps.googleusercontent.com`
- iOS Client ID: `109575996570-c5qu55mvdq3vl92g74flpbdb3v074uno.apps.googleusercontent.com`
- Android Client ID: `109575996570-nsnbem845klp5ahqnd8ae84br4jt94d2.apps.googleusercontent.com`

## 📱 Running the App

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Run on iOS Simulator**
   ```bash
   npx expo run:ios
   ```

3. **Run on Android Emulator**
   ```bash
   npx expo run:android
   ```

## 📁 Project Structure

```
thundercontrol/
├── app/                    # Main application code
│   ├── (auth)/            # Authentication routes
│   ├── (parent)/          # Parent dashboard routes
│   │   ├── devices/       # Device management
│   │   ├── reports/       # Activity reports
│   │   ├── messages/      # Message monitoring
│   │   └── settings/      # App settings
│   ├── (child)/           # Child dashboard routes
│   ├── components/        # Reusable components
│   │   ├── ui/           # UI components
│   │   └── themed/       # Themed components
│   ├── config/           # Configuration files
│   ├── constants/        # Constants and theme
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and service layer
│   │   ├── device-management.service.ts
│   │   ├── device-monitoring.service.ts
│   │   └── auth.service.ts
│   ├── store/           # Redux store setup
│   └── utils/           # Utility functions
├── assets/               # Static assets
├── types/               # TypeScript type definitions
└── app.config.js        # Expo configuration
```

## 🔒 Security Features

- Secure authentication flow
- Protected routes and navigation
- Data encryption
- Secure storage for sensitive information
- Rate limiting
- Input validation
- Session management
- Device verification
- Safe zone monitoring
- Content filtering

## 🌐 Supported Platforms

- iOS 13.0 and later
- Android API Level 21 (Android 5.0) and later
- Web (experimental support)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/)
- [React Native Elements](https://reactnativeelements.com/)
