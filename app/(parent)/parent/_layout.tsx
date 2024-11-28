import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Redirect } from 'expo-router';

export default function ParentLayout() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isParent = useSelector((state: RootState) => 
    state.device.info?.isParent ?? false
  );

  // Protect parent routes
  if (!user || !isParent) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Parent Dashboard',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="activities"
        options={{
          title: 'Activities',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="restrictions"
        options={{
          title: 'Restrictions',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="device-monitoring"
        options={{
          title: 'Device Monitoring',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="location-tracking"
        options={{
          title: 'Location Tracking',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="communication"
        options={{
          title: 'Communication',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="add-child"
        options={{
          title: 'Add Child Device',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="monitoring-report"
        options={{
          title: 'Monitoring Report',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
