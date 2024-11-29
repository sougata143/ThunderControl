export interface Device {
  id: string;
  name: string;
  deviceModel: string;
  status: 'online' | 'offline';
  batteryLevel?: number;
  lastSeen: string;
  location?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  restrictions: {
    screenTimeLimit?: number; // in minutes
    appRestrictions?: {
      [appId: string]: {
        isBlocked: boolean;
        timeLimit?: number; // in minutes
      };
    };
    contentFiltering?: {
      webFiltering: boolean;
      explicitContentBlocking: boolean;
      ageRestriction?: number;
    };
    schedules?: Array<{
      id: string;
      name: string;
      startTime: string; // HH:mm format
      endTime: string; // HH:mm format
      daysOfWeek: Array<0 | 1 | 2 | 3 | 4 | 5 | 6>; // 0 = Sunday, 6 = Saturday
      isActive: boolean;
    }>;
  };
}
