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
  private batterySubscription: any;

  private constructor() {}

  static getInstance(): DeviceMonitoringService {
    if (!DeviceMonitoringService.instance) {
      DeviceMonitoringService.instance = new DeviceMonitoringService();
    }
    return DeviceMonitoringService.instance;
  }

  // Device Stats
  async getDeviceStats(): Promise<DeviceStats> {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    const { totalStorage, freeStorage } = await this.getStorageInfo();
    
    const stats: DeviceStats = {
      batteryLevel,
      storageUsed: totalStorage - freeStorage,
      totalStorage,
      lastUpdated: new Date().toISOString(),
    };

    await AsyncStorage.setItem('deviceStats', JSON.stringify(stats));
    return stats;
  }

  private async getStorageInfo() {
    try {
      const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory!);
      return {
        totalStorage: info.size || 0,
        freeStorage: info.size ? info.size * 0.2 : 0, // Mock value, actual implementation would need native module
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { totalStorage: 0, freeStorage: 0 };
    }
  }

  // Location Tracking
  async startLocationTracking(): Promise<void> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: new Date().toISOString(),
          };

          try {
            const address = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });

            if (address[0]) {
              locationData.address = `${address[0].street || ''} ${address[0].city || ''}`.trim();
            }
          } catch (error) {
            console.error('Error getting address:', error);
          }

          await this.saveLocationData(locationData);
          await this.checkSafeZones(locationData);
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
      throw error;
    }
  }

  async stopLocationTracking(): Promise<void> {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
    }
  }

  private async saveLocationData(location: LocationData): Promise<void> {
    try {
      const existingData = await AsyncStorage.getItem('locationHistory');
      const locationHistory: LocationData[] = existingData ? JSON.parse(existingData) : [];
      
      locationHistory.push(location);
      
      // Keep only last 100 locations
      if (locationHistory.length > 100) {
        locationHistory.shift();
      }
      
      await AsyncStorage.setItem('locationHistory', JSON.stringify(locationHistory));
    } catch (error) {
      console.error('Error saving location data:', error);
    }
  }

  async getLocationHistory(): Promise<LocationData[]> {
    try {
      const data = await AsyncStorage.getItem('locationHistory');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting location history:', error);
      return [];
    }
  }

  // Safe Zones
  async addSafeZone(zone: Omit<SafeZone, 'id'>): Promise<SafeZone> {
    try {
      const existingZones = await this.getSafeZones();
      const newZone: SafeZone = {
        ...zone,
        id: Date.now().toString(),
      };
      
      existingZones.push(newZone);
      await AsyncStorage.setItem('safeZones', JSON.stringify(existingZones));
      
      return newZone;
    } catch (error) {
      console.error('Error adding safe zone:', error);
      throw error;
    }
  }

  async getSafeZones(): Promise<SafeZone[]> {
    try {
      const data = await AsyncStorage.getItem('safeZones');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting safe zones:', error);
      return [];
    }
  }

  private async checkSafeZones(location: LocationData): Promise<void> {
    const safeZones = await this.getSafeZones();
    
    for (const zone of safeZones) {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        zone.latitude,
        zone.longitude
      );
      
      if (distance > zone.radius) {
        // Trigger notification or alert
        console.log(`Device left safe zone: ${zone.name}`);
      }
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Call Logs
  async saveCallLog(call: Omit<CallLogEntry, 'id'>): Promise<void> {
    try {
      const existingLogs = await this.getCallLogs();
      const newCall: CallLogEntry = {
        ...call,
        id: Date.now().toString(),
      };
      
      existingLogs.unshift(newCall);
      
      // Keep only last 100 calls
      if (existingLogs.length > 100) {
        existingLogs.pop();
      }
      
      await AsyncStorage.setItem('callLogs', JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Error saving call log:', error);
    }
  }

  async getCallLogs(): Promise<CallLogEntry[]> {
    try {
      const data = await AsyncStorage.getItem('callLogs');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting call logs:', error);
      return [];
    }
  }

  // Messages
  async saveMessage(message: Omit<MessageEntry, 'id'>): Promise<void> {
    try {
      const existingMessages = await this.getMessages();
      const newMessage: MessageEntry = {
        ...message,
        id: Date.now().toString(),
      };
      
      existingMessages.unshift(newMessage);
      
      // Keep only last 100 messages
      if (existingMessages.length > 100) {
        existingMessages.pop();
      }
      
      await AsyncStorage.setItem('messages', JSON.stringify(existingMessages));
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  async getMessages(): Promise<MessageEntry[]> {
    try {
      const data = await AsyncStorage.getItem('messages');
      if (data) {
        return JSON.parse(data);
      }
      
      // Return mock data if no messages exist
      const mockMessages: MessageEntry[] = [
        {
          id: '1',
          contact: 'Unknown',
          number: '+1 (555) 987-6543',
          preview: "You have won a prize! Click here to...",
          type: 'received',
          timestamp: new Date().toISOString(),
          isBlocked: true,
        },
        {
          id: '2',
          contact: 'John Smith',
          number: '+1 (555) 123-4567',
          preview: "Hey, how are you doing?",
          type: 'received',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isBlocked: false,
        },
        {
          id: '3',
          contact: 'Mom',
          number: '+1 (555) 234-5678',
          preview: "Call me when you get a chance",
          type: 'sent',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          isBlocked: false,
        },
      ];
      
      await AsyncStorage.setItem('messages', JSON.stringify(mockMessages));
      return mockMessages;
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async toggleMessageBlocked(messageId: string): Promise<void> {
    try {
      const messages = await this.getMessages();
      const updatedMessages = messages.map(msg => 
        msg.id === messageId ? { ...msg, isBlocked: !msg.isBlocked } : msg
      );
      await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error toggling message blocked status:', error);
    }
  }

  // Reports
  async generateReport(type: 'activity' | 'location' | 'communication' | 'safety'): Promise<any> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Last 7 days

      switch (type) {
        case 'activity':
          return {
            deviceStats: await this.getDeviceStats(),
            // Add app usage stats here
          };
        case 'location':
          return {
            locationHistory: await this.getLocationHistory(),
            safeZones: await this.getSafeZones(),
          };
        case 'communication':
          return {
            calls: await this.getCallLogs(),
            messages: await this.getMessages(),
          };
        case 'safety':
          return {
            blockedMessages: (await this.getMessages()).filter(msg => msg.isBlocked),
            // Add other safety metrics here
          };
        default:
          throw new Error('Invalid report type');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

export default DeviceMonitoringService.getInstance();
