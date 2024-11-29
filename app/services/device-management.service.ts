import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device as DeviceType } from '@/types/device';
import * as ExpoDevice from 'expo-device';
import * as Battery from 'expo-battery';
import * as Location from 'expo-location';

export interface ChildDevice {
  id: string;
  name: string;
  deviceModel: string;
  platform: 'ios' | 'android';
  status: 'online' | 'offline';
  batteryLevel: number;
  lastSeen: string;
  location?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  restrictions: {
    appUsageLimits: boolean;
    contentFiltering: boolean;
    screenTime: boolean;
    appInstallation: boolean;
  };
}

interface AddDeviceParams {
  name: string;
  deviceModel: string;
  platform: 'ios' | 'android';
}

class DeviceManagementService {
  private readonly DEVICES_STORAGE_KEY = '@thunder_control:devices';

  async addChildDevice(params: AddDeviceParams): Promise<ChildDevice> {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    const { status } = await Location.requestForegroundPermissionsAsync();
    let location;

    if (status === 'granted') {
      const currentLocation = await Location.getCurrentPositionAsync({});
      location = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        timestamp: new Date().toISOString(),
      };
    }

    const newDevice: ChildDevice = {
      id: Date.now().toString(),
      name: params.name,
      deviceModel: params.deviceModel,
      platform: params.platform,
      status: 'offline', // Start as offline until device connects
      batteryLevel: batteryLevel || 1, // Default to 100% if not available
      lastSeen: new Date().toISOString(),
      location,
      restrictions: {
        appUsageLimits: false,
        contentFiltering: true,
        screenTime: false,
        appInstallation: true,
      },
    };

    const existingDevices = await this.getChildDevices();
    await AsyncStorage.setItem(
      this.DEVICES_STORAGE_KEY,
      JSON.stringify([...existingDevices, newDevice])
    );

    return newDevice;
  }

  async getChildDevices(): Promise<ChildDevice[]> {
    const devices = await AsyncStorage.getItem(this.DEVICES_STORAGE_KEY);
    return devices ? JSON.parse(devices) : [];
  }

  async updateDeviceStatus(deviceId: string, status: 'online' | 'offline'): Promise<void> {
    const devices = await this.getChildDevices();
    const updatedDevices = devices.map(device => 
      device.id === deviceId 
        ? { ...device, status, lastSeen: new Date().toISOString() }
        : device
    );

    await AsyncStorage.setItem(
      this.DEVICES_STORAGE_KEY,
      JSON.stringify(updatedDevices)
    );
  }

  async updateDeviceRestrictions(
    deviceId: string,
    restrictions: Partial<ChildDevice['restrictions']>
  ): Promise<void> {
    const devices = await this.getChildDevices();
    const updatedDevices = devices.map(device =>
      device.id === deviceId
        ? {
            ...device,
            restrictions: { ...device.restrictions, ...restrictions },
          }
        : device
    );

    await AsyncStorage.setItem(
      this.DEVICES_STORAGE_KEY,
      JSON.stringify(updatedDevices)
    );
  }

  async removeDevice(deviceId: string): Promise<void> {
    const devices = await this.getChildDevices();
    const updatedDevices = devices.filter(device => device.id !== deviceId);

    await AsyncStorage.setItem(
      this.DEVICES_STORAGE_KEY,
      JSON.stringify(updatedDevices)
    );
  }
}

export default new DeviceManagementService();
