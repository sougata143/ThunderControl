import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommunicationModule, {
  CallLogEntry,
  MessageEntry,
  eventEmitter,
  CommunicationEvents,
} from '@/native/CommunicationModule';
import { store } from '@/store';
import { updateCallLogs, updateMessages, setLoading, setError } from '@/store/communication.slice';

class CommunicationMonitoringService {
  private static instance: CommunicationMonitoringService;
  private callLogsListener: any;
  private messagesListener: any;
  private isMonitoring: boolean = false;

  private constructor() {}

  public static getInstance(): CommunicationMonitoringService {
    if (!CommunicationMonitoringService.instance) {
      CommunicationMonitoringService.instance = new CommunicationMonitoringService();
    }
    return CommunicationMonitoringService.instance;
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring || Platform.OS !== 'android') return;

    try {
      store.dispatch(setLoading(true));
      
      this.callLogsListener = eventEmitter.addListener(
        CommunicationEvents.CALL_LOGS_UPDATE,
        this.handleCallLogsUpdate
      );

      this.messagesListener = eventEmitter.addListener(
        CommunicationEvents.MESSAGES_UPDATE,
        this.handleMessagesUpdate
      );

      await this.refreshCallLogs();
      await this.refreshMessages();

      CommunicationModule.startMonitoring();
      this.isMonitoring = true;
    } catch (error) {
      console.error('Error starting monitoring:', error);
      store.dispatch(setError('Failed to start monitoring'));
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    CommunicationModule.stopMonitoring();
    this.callLogsListener?.remove();
    this.messagesListener?.remove();
    this.isMonitoring = false;
  }

  async refreshCallLogs(): Promise<void> {
    try {
      store.dispatch(setLoading(true));
      const callLogs = await CommunicationModule.getCallLogs();
      store.dispatch(updateCallLogs(callLogs));
    } catch (error) {
      console.error('Error refreshing call logs:', error);
      store.dispatch(setError('Failed to refresh call logs'));
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  async refreshMessages(): Promise<void> {
    try {
      store.dispatch(setLoading(true));
      const messages = await CommunicationModule.getMessages();
      store.dispatch(updateMessages(messages));
    } catch (error) {
      console.error('Error refreshing messages:', error);
      store.dispatch(setError('Failed to refresh messages'));
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  private handleCallLogsUpdate = (event: { callLogs: CallLogEntry[] }) => {
    if (event && Array.isArray(event.callLogs)) {
      store.dispatch(updateCallLogs(event.callLogs));
    }
  };

  private handleMessagesUpdate = (event: { messages: MessageEntry[] }) => {
    if (event && Array.isArray(event.messages)) {
      store.dispatch(updateMessages(event.messages));
    }
  };
}

const communicationMonitoringService = CommunicationMonitoringService.getInstance();
export default communicationMonitoringService;
