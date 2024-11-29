import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationData, SafeZone, CallLogEntry, MessageEntry, DeviceStats } from '../services/device-monitoring.service';

interface MonitoringState {
  deviceStats: DeviceStats | null;
  locationHistory: LocationData[];
  safeZones: SafeZone[];
  callLogs: CallLogEntry[];
  messages: MessageEntry[];
  isLiveTracking: boolean;
  lastUpdated: string | null;
}

const initialState: MonitoringState = {
  deviceStats: null,
  locationHistory: [],
  safeZones: [],
  callLogs: [],
  messages: [],
  isLiveTracking: false,
  lastUpdated: null,
};

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    setDeviceStats: (state, action: PayloadAction<DeviceStats>) => {
      state.deviceStats = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    addLocationData: (state, action: PayloadAction<LocationData>) => {
      state.locationHistory.unshift(action.payload);
      if (state.locationHistory.length > 100) {
        state.locationHistory.pop();
      }
      state.lastUpdated = new Date().toISOString();
    },
    setLocationHistory: (state, action: PayloadAction<LocationData[]>) => {
      state.locationHistory = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    addSafeZone: (state, action: PayloadAction<SafeZone>) => {
      state.safeZones.push(action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    removeSafeZone: (state, action: PayloadAction<string>) => {
      state.safeZones = state.safeZones.filter(zone => zone.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    setSafeZones: (state, action: PayloadAction<SafeZone[]>) => {
      state.safeZones = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    addCallLog: (state, action: PayloadAction<CallLogEntry>) => {
      state.callLogs.unshift(action.payload);
      if (state.callLogs.length > 100) {
        state.callLogs.pop();
      }
      state.lastUpdated = new Date().toISOString();
    },
    setCallLogs: (state, action: PayloadAction<CallLogEntry[]>) => {
      state.callLogs = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    addMessage: (state, action: PayloadAction<MessageEntry>) => {
      state.messages.unshift(action.payload);
      if (state.messages.length > 100) {
        state.messages.pop();
      }
      state.lastUpdated = new Date().toISOString();
    },
    setMessages: (state, action: PayloadAction<MessageEntry[]>) => {
      state.messages = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    toggleMessageBlocked: (state, action: PayloadAction<string>) => {
      const message = state.messages.find(msg => msg.id === action.payload);
      if (message) {
        message.isBlocked = !message.isBlocked;
      }
      state.lastUpdated = new Date().toISOString();
    },
    setLiveTracking: (state, action: PayloadAction<boolean>) => {
      state.isLiveTracking = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    clearAllData: (state) => {
      state.deviceStats = null;
      state.locationHistory = [];
      state.safeZones = [];
      state.callLogs = [];
      state.messages = [];
      state.isLiveTracking = false;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const {
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
} = monitoringSlice.actions;

export default monitoringSlice.reducer;
