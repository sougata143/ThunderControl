import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device } from '@/types/device';
import * as ExpoDevice from 'expo-device';
import * as Battery from 'expo-battery';
import * as Location from 'expo-location';

interface AddDeviceParams {
  name: string;
  deviceModel: string;
}

class DeviceManagementService {
  private readonly DEVICES_STORAGE_KEY = '@thunder_control:devices';

  async addChildDevice(params: AddDeviceParams): Promise<Device> {
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

    const newDevice: Device = {
      id: Math.random().toString(36).substring(7),
      name: params.name,
      deviceModel: params.deviceModel,
      status: 'online',
      batteryLevel: batteryLevel * 100,
      lastSeen: new Date().toISOString(),
      location,
      restrictions: {
        screenTimeLimit: 120, // 2 hours default
        appRestrictions: {},
        contentFiltering: {
          webFiltering: true,
          explicitContentBlocking: true,
          ageRestriction: 13,
        },
        schedules: [],
      },
    };

    const devices = await this.getChildDevices();
    devices.push(newDevice);
    await AsyncStorage.setItem(this.DEVICES_STORAGE_KEY, JSON.stringify(devices));

    return newDevice;
  }

  async getChildDevices(): Promise<Device[]> {
    try {
      const devicesJson = await AsyncStorage.getItem(this.DEVICES_STORAGE_KEY);
      return devicesJson ? JSON.parse(devicesJson) : [];
    } catch (error) {
      console.error('Error getting devices:', error);
      return [];
    }
  }

  async updateDeviceStatus(deviceId: string, isOnline: boolean): Promise<void> {
    const devices = await this.getChildDevices();
    const deviceIndex = devices.findIndex(d => d.id === deviceId);
    
    if (deviceIndex !== -1) {
      devices[deviceIndex].status = isOnline ? 'online' : 'offline';
      devices[deviceIndex].lastSeen = new Date().toISOString();
      await AsyncStorage.setItem(this.DEVICES_STORAGE_KEY, JSON.stringify(devices));
    }
  }

  async updateDeviceRestrictions(deviceId: string, restrictions: Device['restrictions']): Promise<void> {
    const devices = await this.getChildDevices();
    const deviceIndex = devices.findIndex(d => d.id === deviceId);
    
    if (deviceIndex !== -1) {
      devices[deviceIndex].restrictions = restrictions;
      await AsyncStorage.setItem(this.DEVICES_STORAGE_KEY, JSON.stringify(devices));
    }
  }
}

export default new DeviceManagementService();
