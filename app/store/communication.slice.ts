import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallLogEntry, MessageEntry } from '@/native/CommunicationModule';

interface CommunicationState {
  callLogs: CallLogEntry[];
  messages: MessageEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CommunicationState = {
  callLogs: [],
  messages: [],
  isLoading: false,
  error: null,
};

const communicationSlice = createSlice({
  name: 'communication',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateCallLogs: (state, action: PayloadAction<CallLogEntry[]>) => {
      state.callLogs = action.payload;
      state.error = null;
    },
    updateMessages: (state, action: PayloadAction<MessageEntry[]>) => {
      state.messages = action.payload;
      state.error = null;
    },
    clearCommunicationData: (state) => {
      state.callLogs = [];
      state.messages = [];
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  updateCallLogs,
  updateMessages,
  clearCommunicationData,
} = communicationSlice.actions;

export default communicationSlice.reducer;
