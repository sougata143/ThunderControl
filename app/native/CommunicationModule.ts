import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'CommunicationModule' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export interface CallLogEntry {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed' | 'unknown';
  duration: string;
  timestamp: string;
}

export interface MessageEntry {
  id: string;
  number: string;
  preview: string;
  type: 'sent' | 'received' | 'unknown';
  timestamp: string;
}

// Mock implementation for development
const MockCommunicationModule = {
  getCallLogs: async (): Promise<CallLogEntry[]> => {
    // Generate mock call logs for development
    return [
      {
        id: '1',
        name: 'John Doe',
        number: '+1 (555) 123-4567',
        type: 'incoming',
        duration: '2:30',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: '2',
        name: 'Jane Smith',
        number: '+1 (555) 987-6543',
        type: 'outgoing',
        duration: '5:15',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      },
      {
        id: '3',
        name: 'Unknown',
        number: '+1 (555) 555-5555',
        type: 'missed',
        duration: '0:00',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      },
    ];
  },
  getMessages: async (): Promise<MessageEntry[]> => {
    // Generate mock messages for development
    return [
      {
        id: '1',
        number: '+1 (555) 123-4567',
        preview: 'Hey, how are you?',
        type: 'received',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      },
      {
        id: '2',
        number: '+1 (555) 987-6543',
        preview: 'I\'ll be there in 10 minutes',
        type: 'sent',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      },
      {
        id: '3',
        number: '+1 (555) 555-5555',
        preview: 'Meeting at 3 PM today',
        type: 'received',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
      },
    ];
  },
  startMonitoring: () => {
    // Simulate periodic updates
    const interval = setInterval(async () => {
      const callLogs = await MockCommunicationModule.getCallLogs();
      const messages = await MockCommunicationModule.getMessages();
      
      eventEmitter.emit(CommunicationEvents.CALL_LOGS_UPDATE, {
        callLogs: callLogs,
      });
      eventEmitter.emit(CommunicationEvents.MESSAGES_UPDATE, {
        messages: messages,
      });
    }, 30000); // Update every 30 seconds
    
    return interval;
  },
  stopMonitoring: (intervalId: number) => {
    clearInterval(intervalId);
  },
};

const CommunicationModule = Platform.select({
  android: NativeModules.CommunicationModule
    ? NativeModules.CommunicationModule
    : MockCommunicationModule,
  default: MockCommunicationModule,
});

export const eventEmitter = new NativeEventEmitter(
  Platform.OS === 'android' ? NativeModules.CommunicationModule : null
);

export const CommunicationEvents = {
  CALL_LOGS_UPDATE: 'onCallLogsUpdate',
  MESSAGES_UPDATE: 'onMessagesUpdate',
};

export default CommunicationModule;
