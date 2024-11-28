import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Device {
  id: string;
  name: string;
  type: string;
  userId: string;
  lastSeen: number;
  restrictions: {
    screenTimeLimit?: number;
    blockedApps?: string[];
    schedules?: {
      start: number;
      end: number;
      days: number[];
    }[];
  };
}

export interface DeviceInfo {
  isParent: boolean;
  deviceId?: string;
  deviceName?: string;
}

interface DeviceState {
  devices: { [key: string]: Device };
  selectedDeviceId: string | null;
  info: DeviceInfo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DeviceState = {
  devices: {},
  selectedDeviceId: null,
  info: null,
  isLoading: false,
  error: null,
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<{ [key: string]: Device }>) => {
      state.devices = action.payload;
      state.error = null;
    },
    addDevice: (state, action: PayloadAction<Device>) => {
      state.devices[action.payload.id] = action.payload;
      state.error = null;
    },
    updateDevice: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Device> }>
    ) => {
      const { id, updates } = action.payload;
      if (state.devices[id]) {
        state.devices[id] = { ...state.devices[id], ...updates };
      }
    },
    removeDevice: (state, action: PayloadAction<string>) => {
      delete state.devices[action.payload];
    },
    setSelectedDevice: (state, action: PayloadAction<string | null>) => {
      state.selectedDeviceId = action.payload;
    },
    setDeviceInfo: (state, action: PayloadAction<DeviceInfo>) => {
      state.info = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearDevices: (state) => {
      state.devices = {};
      state.selectedDeviceId = null;
      state.info = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setDevices,
  addDevice,
  updateDevice,
  removeDevice,
  setSelectedDevice,
  setDeviceInfo,
  setLoading,
  setError,
  clearDevices,
} = deviceSlice.actions;

export default deviceSlice.reducer;
