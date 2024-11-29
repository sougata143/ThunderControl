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
        name="location-tracking/index"
        options={{
          title: 'Location Tracking'
        }}
      />
      <Stack.Screen
        name="call-logs/index"
        options={{
          title: 'Call Logs'
        }}
      />
      <Stack.Screen
        name="messages/index"
        options={{
          title: 'Messages'
        }}
      />
      <Stack.Screen
        name="devices/index"
        options={{
          title: 'Devices'
        }}
      />
      <Stack.Screen
        name="devices/[id]/index"
        options={{
          title: 'Device Details'
        }}
      />
      <Stack.Screen
        name="reports/index"
        options={{
          title: 'Reports'
        }}
      />
      <Stack.Screen
        name="reports/[type]"
        options={{
          title: 'Report Details'
        }}
      />
      <Stack.Screen
        name="restrictions/index"
        options={{
          title: 'Restrictions'
        }}
      />
    </Stack>
  );
}
