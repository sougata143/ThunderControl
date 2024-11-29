import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Redirect } from 'expo-router';

export default function ParentLayout() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isParent = useSelector((state: RootState) => 
    state.device.info?.isParent ?? false
  );

  // Protect parent routes
  if (!user || !isParent) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="location"
        options={{
          title: 'Location Tracking'
        }}
      />
      <Stack.Screen
        name="call-logs"
        options={{
          title: 'Call Logs'
        }}
      />
      <Stack.Screen
        name="messages"
        options={{
          title: 'Messages'
        }}
      />
      <Stack.Screen
        name="devices"
        options={{
          title: 'Devices'
        }}
      />
      <Stack.Screen
        name="device-restrictions"
        options={{
          title: 'Restrictions'
        }}
      />
      <Stack.Screen
        name="reports"
        options={{
          title: 'Reports'
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings'
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile'
        }}
      />
    </Stack>
  );
}
