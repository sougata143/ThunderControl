import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import monitoringReducer from './monitoring.slice';
import deviceReducer from './slices/deviceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    monitoring: monitoringReducer,
    device: deviceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
