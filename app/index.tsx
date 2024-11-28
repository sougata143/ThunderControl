import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setLoading } from '../store/slices/authSlice';

export default function Index() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const isParent = useSelector((state: RootState) => 
    state.device.info?.isParent ?? false
  );

  useEffect(() => {
    // Initialize auth state
    dispatch(setLoading(true));
    // Add any auth initialization logic here
    dispatch(setLoading(false));
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return isParent ? (
    <Redirect href="/(parent)/dashboard" />
  ) : (
    <Redirect href="/(child)/dashboard" />
  );
}
