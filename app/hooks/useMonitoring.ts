import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setDeviceStats,
  addLocationData,
  setLocationHistory,
  addSafeZone,
  removeSafeZone,
  setSafeZones,
  addCallLog,
  setCallLogs,
  addMessage,
  setMessages,
  toggleMessageBlocked,
  setLiveTracking,
  clearAllData,
} from '../store/monitoring.slice';
import { DeviceMonitoringService } from '../services/device-monitoring.service';
import type { LocationData, SafeZone, CallLogEntry, MessageEntry, DeviceStats } from '../services/device-monitoring.service';

export const useMonitoring = () => {
  const dispatch = useDispatch();
  const monitoringState = useSelector((state: RootState) => state.monitoring);
  const monitoringService = DeviceMonitoringService.getInstance();

  // Device Stats
  const updateDeviceStats = useCallback(async () => {
    const stats = await monitoringService.getDeviceStats();
    dispatch(setDeviceStats(stats));
    return stats;
  }, [dispatch]);

  // Location Tracking
  const startLocationTracking = useCallback(async () => {
    dispatch(setLiveTracking(true));
    const unsubscribe = await monitoringService.startLocationTracking((location) => {
      dispatch(addLocationData(location));
    });
    return unsubscribe;
  }, [dispatch]);

  const stopLocationTracking = useCallback(async () => {
    dispatch(setLiveTracking(false));
    await monitoringService.stopLocationTracking();
  }, [dispatch]);

  const loadLocationHistory = useCallback(async () => {
    const history = await monitoringService.getLocationHistory();
    dispatch(setLocationHistory(history));
    return history;
  }, [dispatch]);

  // Safe Zones
  const createSafeZone = useCallback(async (zone: Omit<SafeZone, 'id'>) => {
    const newZone = await monitoringService.createSafeZone(zone);
    dispatch(addSafeZone(newZone));
    return newZone;
  }, [dispatch]);

  const deleteSafeZone = useCallback(async (zoneId: string) => {
    await monitoringService.deleteSafeZone(zoneId);
    dispatch(removeSafeZone(zoneId));
  }, [dispatch]);

  const loadSafeZones = useCallback(async () => {
    const zones = await monitoringService.getSafeZones();
    dispatch(setSafeZones(zones));
    return zones;
  }, [dispatch]);

  // Call Logs
  const loadCallLogs = useCallback(async () => {
    const logs = await monitoringService.getCallLogs();
    dispatch(setCallLogs(logs));
    return logs;
  }, [dispatch]);

  const updateCallLogs = useCallback(async () => {
    const newLog = await monitoringService.getLatestCallLog();
    if (newLog) {
      dispatch(addCallLog(newLog));
    }
    return newLog;
  }, [dispatch]);

  // Messages
  const loadMessages = useCallback(async () => {
    const messages = await monitoringService.getMessages();
    dispatch(setMessages(messages));
    return messages;
  }, [dispatch]);

  const updateMessages = useCallback(async () => {
    const newMessage = await monitoringService.getLatestMessage();
    if (newMessage) {
      dispatch(addMessage(newMessage));
    }
    return newMessage;
  }, [dispatch]);

  const blockMessage = useCallback(async (messageId: string) => {
    await monitoringService.toggleMessageBlocked(messageId);
    dispatch(toggleMessageBlocked(messageId));
  }, [dispatch]);

  // Data Management
  const clearMonitoringData = useCallback(async () => {
    await monitoringService.clearAllData();
    dispatch(clearAllData());
  }, [dispatch]);

  return {
    // State
    deviceStats: monitoringState.deviceStats,
    locationHistory: monitoringState.locationHistory,
    safeZones: monitoringState.safeZones,
    callLogs: monitoringState.callLogs,
    messages: monitoringState.messages,
    isLiveTracking: monitoringState.isLiveTracking,
    lastUpdated: monitoringState.lastUpdated,

    // Actions
    updateDeviceStats,
    startLocationTracking,
    stopLocationTracking,
    loadLocationHistory,
    createSafeZone,
    deleteSafeZone,
    loadSafeZones,
    loadCallLogs,
    updateCallLogs,
    loadMessages,
    updateMessages,
    blockMessage,
    clearMonitoringData,
  };
};
