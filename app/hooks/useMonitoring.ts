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

export default function useMonitoring() {
  const dispatch = useDispatch();
  const monitoringState = useSelector((state: RootState) => state.monitoring);

  const updateDeviceStats = useCallback((stats: DeviceStats) => {
    dispatch(setDeviceStats(stats));
  }, [dispatch]);

  const updateLocation = useCallback((location: LocationData) => {
    dispatch(addLocationData(location));
  }, [dispatch]);

  const updateLocationHistory = useCallback((history: LocationData[]) => {
    dispatch(setLocationHistory(history));
  }, [dispatch]);

  const addNewSafeZone = useCallback((zone: SafeZone) => {
    dispatch(addSafeZone(zone));
  }, [dispatch]);

  const deleteSafeZone = useCallback((zoneId: string) => {
    dispatch(removeSafeZone(zoneId));
  }, [dispatch]);

  const updateSafeZones = useCallback((zones: SafeZone[]) => {
    dispatch(setSafeZones(zones));
  }, [dispatch]);

  const addNewCallLog = useCallback((log: CallLogEntry) => {
    dispatch(addCallLog(log));
  }, [dispatch]);

  const updateCallLogs = useCallback((logs: CallLogEntry[]) => {
    dispatch(setCallLogs(logs));
  }, [dispatch]);

  const addNewMessage = useCallback((message: MessageEntry) => {
    dispatch(addMessage(message));
  }, [dispatch]);

  const updateMessages = useCallback((messages: MessageEntry[]) => {
    dispatch(setMessages(messages));
  }, [dispatch]);

  const toggleBlockedMessage = useCallback((messageId: string) => {
    dispatch(toggleMessageBlocked(messageId));
  }, [dispatch]);

  const setTracking = useCallback((isTracking: boolean) => {
    dispatch(setLiveTracking(isTracking));
  }, [dispatch]);

  const clearMonitoringData = useCallback(() => {
    dispatch(clearAllData());
  }, [dispatch]);

  return {
    monitoringState,
    updateDeviceStats,
    updateLocation,
    updateLocationHistory,
    addNewSafeZone,
    deleteSafeZone,
    updateSafeZones,
    addNewCallLog,
    updateCallLogs,
    addNewMessage,
    updateMessages,
    toggleBlockedMessage,
    setTracking,
    clearMonitoringData,
  };
}
