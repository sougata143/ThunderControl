import { Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DeviceStats {
  batteryLevel: number;
  storageUsed: number;
  totalStorage: number;
  lastUpdated: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
  address?: string;
}

export interface CallLogEntry {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  timestamp: string;
}

export interface MessageEntry {
  id: string;
  contact: string;
  number: string;
  preview: string;
  type: 'sent' | 'received';
  timestamp: string;
  isBlocked: boolean;
}

export interface SafeZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
}

class DeviceMonitoringService {
  private static instance: DeviceMonitoringService;
  private locationSubscription: any;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): DeviceMonitoringService {
    if (!DeviceMonitoringService.instance) {
      DeviceMonitoringService.instance = new DeviceMonitoringService();
    }
    return DeviceMonitoringService.instance;
  }

  async generateReport(type: 'activity' | 'location' | 'communication' | 'safety'): Promise<any> {
    try {
      switch (type) {
        case 'activity':
          return await this.generateActivityReport();
        case 'location':
          return await this.generateLocationReport();
        case 'communication':
          return await this.generateCommunicationReport();
        case 'safety':
          return await this.generateSafetyReport();
        default:
          throw new Error('Invalid report type');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  private async generateActivityReport(): Promise<any> {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    const deviceInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
    
    return {
      deviceStats: {
        batteryLevel,
        storageUsed: deviceInfo.size || 0,
        totalStorage: await this.getTotalStorage(),
        lastUpdated: new Date().toISOString(),
      },
      // Add more activity data as needed
    };
  }

  private async generateLocationReport(): Promise<any> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    const locationHistory = await this.getLocationHistory();
    const safeZones = await this.getSafeZones();

    return {
      currentLocation: {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        timestamp: new Date().toISOString(),
      },
      locationHistory,
      safeZones,
    };
  }

  private async generateCommunicationReport(): Promise<any> {
    const callLogs = await this.getCallLogs();
    const messages = await this.getMessages();

    return {
      callLogs,
      messages,
      stats: {
        totalCalls: callLogs.length,
        totalMessages: messages.length,
        blockedMessages: messages.filter(m => m.isBlocked).length,
      },
    };
  }

  private async generateSafetyReport(): Promise<any> {
    // Implement safety report generation
    return {
      alerts: [],
      blockedContent: [],
      securityEvents: [],
    };
  }

  private async getTotalStorage(): Promise<number> {
    try {
      const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
      return info.totalSize || 1024 * 1024 * 1024; // Default to 1GB if not available
    } catch {
      return 1024 * 1024 * 1024; // Default to 1GB
    }
  }

  private async getLocationHistory(): Promise<LocationData[]> {
    const history = await AsyncStorage.getItem('@location_history');
    return history ? JSON.parse(history) : [];
  }

  private async getSafeZones(): Promise<SafeZone[]> {
    const zones = await AsyncStorage.getItem('@safe_zones');
    return zones ? JSON.parse(zones) : [];
  }

  private async getCallLogs(): Promise<CallLogEntry[]> {
    const logs = await AsyncStorage.getItem('@call_logs');
    return logs ? JSON.parse(logs) : [];
  }

  private async getMessages(): Promise<MessageEntry[]> {
    const messages = await AsyncStorage.getItem('@messages');
    return messages ? JSON.parse(messages) : [];
  }
}

export default DeviceMonitoringService.getInstance();
