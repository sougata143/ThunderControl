import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import { RootState } from '@/store';
import CommunicationMonitoringService from '@/services/communication-monitoring.service';

export const useCommunicationMonitoring = () => {
  const { callLogs, messages, isLoading, error } = useSelector(
    (state: RootState) => state.communication
  );

  useEffect(() => {
    const startMonitoring = async () => {
      try {
        if (Platform.OS === 'android') {
          await CommunicationMonitoringService.startMonitoring();
        }
      } catch (error) {
        console.error('Error starting communication monitoring:', error);
      }
    };

    startMonitoring();

    return () => {
      if (Platform.OS === 'android') {
        CommunicationMonitoringService.stopMonitoring();
      }
    };
  }, []);

  const refreshData = async () => {
    try {
      await Promise.all([
        CommunicationMonitoringService.refreshCallLogs(),
        CommunicationMonitoringService.refreshMessages(),
      ]);
    } catch (error) {
      console.error('Error refreshing communication data:', error);
    }
  };

  return {
    callLogs,
    messages,
    isLoading,
    error,
    refreshData,
  };
};

export default useCommunicationMonitoring;
