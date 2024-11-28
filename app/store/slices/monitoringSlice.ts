import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface ScreenTime {
  appName: string;
  duration: number;
  lastUsed: number;
}

interface MonitoringState {
  location: Location | null;
  screenTime: ScreenTime[];
  isTracking: boolean;
  blockedApps: string[];
  deviceLocked: boolean;
}

const initialState: MonitoringState = {
  location: null,
  screenTime: [],
  isTracking: false,
  blockedApps: [],
  deviceLocked: false,
};

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    updateLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload;
    },
    updateScreenTime: (state, action: PayloadAction<ScreenTime>) => {
      const index = state.screenTime.findIndex(
        (app) => app.appName === action.payload.appName
      );
      if (index !== -1) {
        state.screenTime[index] = action.payload;
      } else {
        state.screenTime.push(action.payload);
      }
    },
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.isTracking = action.payload;
    },
    updateBlockedApps: (state, action: PayloadAction<string[]>) => {
      state.blockedApps = action.payload;
    },
    setDeviceLock: (state, action: PayloadAction<boolean>) => {
      state.deviceLocked = action.payload;
    },
    resetMonitoring: (state) => {
      state.location = null;
      state.screenTime = [];
      state.isTracking = false;
      state.blockedApps = [];
      state.deviceLocked = false;
    },
  },
});

export const {
  updateLocation,
  updateScreenTime,
  setTracking,
  updateBlockedApps,
  setDeviceLock,
  resetMonitoring,
} = monitoringSlice.actions;

export default monitoringSlice.reducer;
