import { Platform } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

class PermissionsService {
  private static instance: PermissionsService;

  private constructor() {}

  public static getInstance(): PermissionsService {
    if (!PermissionsService.instance) {
      PermissionsService.instance = new PermissionsService();
    }
    return PermissionsService.instance;
  }

  async checkCommunicationPermissions(): Promise<{
    callLogs: boolean;
    messages: boolean;
  }> {
    if (Platform.OS !== 'android') {
      return { callLogs: false, messages: false };
    }

    try {
      // For call logs, we need contacts permission
      const contactsPermission = await Contacts.getPermissionsAsync();
      
      // For messages, check if SMS is available
      const isSMSAvailable = await SMS.isAvailableAsync();

      return {
        callLogs: contactsPermission.status === 'granted',
        messages: isSMSAvailable, // SMS availability implies permission on Android
      };
    } catch (error) {
      console.error('Error checking permissions:', error);
      return { callLogs: false, messages: false };
    }
  }

  async requestCommunicationPermissions(): Promise<{
    callLogs: boolean;
    messages: boolean;
  }> {
    if (Platform.OS !== 'android') {
      return { callLogs: false, messages: false };
    }

    try {
      // Request contacts permission for call logs
      const contactsPermission = await Contacts.requestPermissionsAsync();
      
      // For messages, check if SMS is available
      const isSMSAvailable = await SMS.isAvailableAsync();

      return {
        callLogs: contactsPermission.status === 'granted',
        messages: isSMSAvailable, // SMS availability implies permission on Android
      };
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return { callLogs: false, messages: false };
    }
  }

  async checkLocationPermission(): Promise<boolean> {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  }

  async requestLocationPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async checkNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    }
    return true; // Android handles notifications differently
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    }
    return true; // Android handles notifications differently
  }
}

export default PermissionsService.getInstance();
