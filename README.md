# ThunderControl - Parental Control & Monitoring App

ThunderControl is a comprehensive mobile application built with React Native and Expo that helps parents monitor and manage their children's device usage. The app provides real-time monitoring, usage controls, and detailed activity reports.

## 🚀 Features

### Authentication & User Management
- Multi-role support (Parent/Child)
- Email & Password authentication
- Google Sign-in integration
- Guest account access
- Guest to full account conversion
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

## 🛠 Technology Stack

### Frontend
- React Native (with Expo SDK 52)
- TypeScript
- Expo Router v4 (for navigation)
- Redux Toolkit (state management)
- React Native Elements (UI components)

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

## 🚀 Running the App

### Development
```bash
# Start the development server
npm start
# or
yarn start

# Run on iOS
npm run ios
# or
yarn ios

# Run on Android
npm run android
# or
yarn android
```

### Production Build
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 📁 Project Structure

```
thundercontrol/
├── app/                    # Main application code
│   ├── components/         # Reusable components
│   ├── config/            # Configuration files
│   ├── navigation/        # Navigation setup
│   ├── screens/           # Screen components
│   │   ├── auth/         # Authentication screens
│   │   ├── parent/       # Parent screens
│   │   └── child/        # Child screens
│   ├── services/         # API and service functions
│   ├── store/            # Redux store setup
│   │   └── slices/       # Redux slices
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── assets/               # Static assets
├── docs/                 # Documentation
└── firebase/            # Firebase related files
    └── functions/       # Cloud Functions
```

## 🔐 Security

- All sensitive data is encrypted
- Firebase Security Rules are implemented
- Regular security audits
- No sensitive data stored locally
- Secure communication protocols

## 📱 Supported Platforms

- iOS 13.0 and later
- Android 8.0 (API Level 26) and later

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run e2e

# Run specific test file
npm test filename.test.ts
```

## 📦 Available Scripts

- `npm start`: Start the Expo development server
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
- `npm run build`: Build the app
- `npm run eject`: Eject from Expo (if needed)

## 🔄 State Management

The app uses Redux Toolkit for state management with the following main slices:
- `auth`: Authentication state
- `device`: Device information and settings
- `monitoring`: Monitoring data and settings
- `settings`: App settings

## 🌐 API Integration

The app integrates with Firebase services through:
- `AuthService`: Authentication operations
- `DeviceService`: Device management
- `MonitoringService`: Activity monitoring
- `NotificationService`: Push notifications

## 📈 Monitoring Features

- Screen time tracking
- App usage statistics
- Website monitoring
- Location tracking
- Activity reports
- Real-time alerts

## 🎯 Future Roadmap

- [ ] Screen recording prevention
- [ ] AI-powered content filtering
- [ ] Cross-platform synchronization
- [ ] Advanced scheduling features
- [ ] Enhanced reporting capabilities
- [ ] Multi-language support

## 📝 Changelog

### Latest Updates (2024-01-09)
- Fixed guest login functionality
  - Added proper device info handling in Redux store
  - Corrected parent dashboard routing for guest users
  - Updated auth service to properly set device and user information
- Code Improvements
  - Added default exports to React components
  - Enhanced type safety in Redux slices
  - Improved state management for device information

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React Native community
- Expo team
- Firebase team
- All contributors

## 📞 Support

For support, email support@thundercontrol.com or join our Slack channel.
