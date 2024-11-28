import React from 'react';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      // Root routes
      '(tabs)': undefined;
      'auth/login': undefined;
      'auth/register': undefined;
      'auth/forgot-password': undefined;
      
      // Parent routes
      'parent/dashboard': undefined;
      'parent/device-monitoring': { deviceId: string };
      'parent/location-tracking': { deviceId: string };
      'parent/screen-time': { deviceId: string };
      'parent/communication': { deviceId: string };
      'parent/settings': undefined;
      'parent/add-child': undefined;
      'parent/monitoring-report': undefined;
      
      // Device routes
      'devices': undefined;
      'devices/[id]': { id: string };
      'add-device': undefined;
      
      // Child routes
      'child/home': undefined;
      'child/activities': undefined;
      'child/restrictions': undefined;
      'child/profile': undefined;
      
      // Special routes
      '+not-found': undefined;
      'index': undefined;
      'explore': undefined;
    }
  }
}

// This component is exported as default to satisfy Expo Router's requirements
const NavigationTypes: React.FC = () => null;

export default NavigationTypes;
