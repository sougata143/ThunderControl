import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  osVersion: string;
  batteryLevel: number;
  isOnline: boolean;
}

interface DeviceState {
  info: DeviceInfo | null;
  isChild: boolean;
  linkedDevices: string[];
  settings: {
    screenTimeLimit: number;
    contentFilterEnabled: boolean;
    locationTrackingEnabled: boolean;
    notificationsEnabled: boolean;
  };
}

const initialState: DeviceState = {
  info: null,
  isChild: false,
  linkedDevices: [],
  settings: {
    screenTimeLimit: 0,
    contentFilterEnabled: false,
    locationTrackingEnabled: false,
    notificationsEnabled: true,
  },
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDeviceInfo: (state, action: PayloadAction<DeviceInfo>) => {
      state.info = action.payload;
    },
    setIsChild: (state, action: PayloadAction<boolean>) => {
      state.isChild = action.payload;
    },
    updateLinkedDevices: (state, action: PayloadAction<string[]>) => {
      state.linkedDevices = action.payload;
    },
    updateSettings: (
      state,
      action: PayloadAction<Partial<DeviceState['settings']>>
    ) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    resetDevice: (state) => {
      state.info = null;
      state.isChild = false;
      state.linkedDevices = [];
      state.settings = initialState.settings;
    },
  },
});

export const {
  setDeviceInfo,
  setIsChild,
  updateLinkedDevices,
  updateSettings,
  resetDevice,
} = deviceSlice.actions;

export default deviceSlice.reducer;
