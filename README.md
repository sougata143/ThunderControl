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
- Activity reports
- Multiple child device management
- Remote device control
- Custom rule creation

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

## 🛠 Technology Stack

### Frontend
- React Native (with Expo SDK 52)
- TypeScript
- Expo Router v4 (for navigation)
- Redux Toolkit (state management)
- React Native Elements (UI components)
- React Native Reanimated (for animations)

### Backend & Services
- Firebase Authentication
- Firebase Realtime Database
- Firebase Cloud Functions
- Firebase Cloud Messaging (for notifications)

### Development Tools
- Expo CLI
- TypeScript
- ESLint
- Prettier

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or later)
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
│   ├── (child)/           # Child dashboard routes
│   ├── components/        # Reusable components
│   ├── config/           # Configuration files
│   ├── constants/        # Constants and theme
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and service layer
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
