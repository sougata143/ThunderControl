import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MonitoringData {
  deviceId: string;
  screenTime: number;
  appUsage: { [key: string]: number };
  lastUpdated: number;
}

interface MonitoringState {
  data: { [key: string]: MonitoringData };
  isLoading: boolean;
  error: string | null;
}

const initialState: MonitoringState = {
  data: {},
  isLoading: false,
  error: null,
};

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    setMonitoringData: (
      state,
      action: PayloadAction<{ deviceId: string; data: MonitoringData }>
    ) => {
      const { deviceId, data } = action.payload;
      state.data[deviceId] = data;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearMonitoringData: (state) => {
      state.data = {};
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setMonitoringData, setLoading, setError, clearMonitoringData } =
  monitoringSlice.actions;
export default monitoringSlice.reducer;
