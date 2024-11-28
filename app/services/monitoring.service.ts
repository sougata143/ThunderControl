import { ref, push, query, orderByChild, startAt, get, set } from 'firebase/database';
import { db } from '../config/firebase';
import Geolocation from 'react-native-geolocation-service';

class MonitoringService {
  private static locationUpdateInterval: number | null = null;
  private static screenTimeInterval: number | null = null;

  static async logLocation(deviceId: string, location: { latitude: number; longitude: number }) {
    try {
      await push(ref(db, `locations/${deviceId}`), {
        ...location,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error logging location:', error);
      throw error;
    }
  }

  static async startLocationTracking(deviceId: string) {
    try {
      // Start watching location
      Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.logLocation(deviceId, { latitude, longitude });
        },
        (error) => {
          console.error('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10, // Minimum distance (in meters) between updates
          interval: 5000, // Minimum time (in milliseconds) between updates
          fastestInterval: 2000, // Fastest rate at which your app can handle updates
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
      throw error;
    }
  }

  static async getDeviceStats(deviceId: string, days: number = 1) {
    try {
      const startTime = Date.now() - days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
      const locationRef = ref(db, `locations/${deviceId}`);
      const locationQuery = query(locationRef, orderByChild('timestamp'), startAt(startTime));
      const snapshot = await get(locationQuery);
      
      return {
        locations: snapshot.val() || {},
      };
    } catch (error) {
      console.error('Error fetching device stats:', error);
      throw error;
    }
  }

  static async updateDeviceStatus(deviceId: string, status: any) {
    try {
      await set(ref(db, `deviceStatus/${deviceId}`), {
        ...status,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      console.error('Error updating device status:', error);
      throw error;
    }
  }

  static async updateDeviceInfo(userId: string): Promise<void> {
    try {
      const deviceInfo = {
        deviceId: await DeviceInfo.getUniqueId(),
        deviceName: await DeviceInfo.getDeviceName(),
        deviceType: await DeviceInfo.getDeviceType(),
        osVersion: await DeviceInfo.getSystemVersion(),
        batteryLevel: await DeviceInfo.getBatteryLevel(),
        isOnline: true,
        lastUpdated: Date.now(),
      };

      await set(ref(db, `devices/${userId}`), deviceInfo);
    } catch (error) {
      console.error('Error updating device info:', error);
      throw error;
    }
  }

  static async updateScreenTime(userId: string, appName: string, duration: number): Promise<void> {
    try {
      const screenTimeRef = ref(db, `screenTime/${userId}/${appName}`);
      await set(screenTimeRef, {
        duration: duration,
        lastUsed: Date.now(),
      });
    } catch (error) {
      console.error('Error updating screen time:', error);
      throw error;
    }
  }

  static async updateBlockedApps(userId: string, apps: string[]): Promise<void> {
    try {
      await set(ref(db, `blockedApps/${userId}`), apps);
    } catch (error) {
      console.error('Error updating blocked apps:', error);
      throw error;
    }
  }

  static async setDeviceLock(userId: string, locked: boolean): Promise<void> {
    try {
      await set(ref(db, `devices/${userId}/locked`), locked);
    } catch (error) {
      console.error('Error setting device lock:', error);
      throw error;
    }
  }

  static subscribeToDeviceLock(userId: string, callback: (locked: boolean) => void): () => void {
    const ref = ref(db, `devices/${userId}/locked`);
    get(ref).then((snapshot) => {
      callback(snapshot.val() || false);
    });
    return () => {};
  }

  static async getDeviceStats(userId: string, days: number = 7): Promise<any> {
    try {
      const endTime = Date.now();
      const startTime = endTime - (days * 24 * 60 * 60 * 1000);
      
      const screenTimeSnapshot = await get(query(ref(db, `screenTime/${userId}`), orderByChild('lastUsed'), limitToLast(1)));
      const locationSnapshot = await get(query(ref(db, `locations/${userId}`), orderByChild('timestamp'), limitToLast(1)));

      return {
        screenTime: screenTimeSnapshot.val() || {},
        locations: locationSnapshot.val() || {},
      };
    } catch (error) {
      console.error('Error getting device stats:', error);
      throw error;
    }
  }

  static async updateScreenTimeLimit(userId: string, appName: string, limitMinutes: number): Promise<void> {
    try {
      await set(ref(db, `screenTime/${userId}/${appName}/dailyLimit`), limitMinutes);
    } catch (error) {
      console.error('Error updating screen time limit:', error);
      throw error;
    }
  }

  static async updateTotalScreenTimeLimit(userId: string, limitMinutes: number): Promise<void> {
    try {
      await set(ref(db, `devices/${userId}/totalScreenTimeLimit`), limitMinutes);
    } catch (error) {
      console.error('Error updating total screen time limit:', error);
      throw error;
    }
  }

  static subscribeToScreenTime(userId: string, callback: (screenTime: any) => void): () => void {
    const ref = ref(db, `screenTime/${userId}`);
    get(ref).then((snapshot) => {
      callback(snapshot.val() || {});
    });
    return () => {};
  }

  static async checkAndEnforceScreenTimeLimits(userId: string): Promise<void> {
    try {
      const deviceRef = ref(db, `devices/${userId}`);
      const screenTimeRef = ref(db, `screenTime/${userId}`);

      const [deviceSnapshot, screenTimeSnapshot] = await Promise.all([
        get(deviceRef),
        get(screenTimeRef),
      ]);

      const deviceData = deviceSnapshot.val() || {};
      const screenTimeData = screenTimeSnapshot.val() || {};
      const totalLimit = deviceData.totalScreenTimeLimit || 120; // 2 hours default
      
      let totalUsed = 0;
      Object.values(screenTimeData).forEach((app: any) => {
        totalUsed += app.duration || 0;
      });

      // Convert total used from milliseconds to minutes
      totalUsed = Math.floor(totalUsed / (60 * 1000));

      if (totalUsed >= totalLimit) {
        // Lock device if total limit exceeded
        await this.setDeviceLock(userId, true);
        return;
      }

      // Check individual app limits
      Object.entries(screenTimeData).forEach(async ([appName, data]: [string, any]) => {
        const appLimit = data.dailyLimit || 60; // 1 hour default
        const appUsed = Math.floor((data.duration || 0) / (60 * 1000));
        
        if (appUsed >= appLimit) {
          // Add to blocked apps if limit exceeded
          const currentBlocked = deviceData.blockedApps || [];
          if (!currentBlocked.includes(appName)) {
            await this.updateBlockedApps(userId, [...currentBlocked, appName]);
          }
        }
      });
    } catch (error) {
      console.error('Error checking screen time limits:', error);
      throw error;
    }
  }
}

export default MonitoringService;
