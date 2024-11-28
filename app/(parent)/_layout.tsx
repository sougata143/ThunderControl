import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Main Dashboard */}
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Parent Dashboard',
          headerLargeTitle: true,
        }}
      />

      {/* Device Management */}
      <Stack.Screen
        name="devices/index"
        options={{
          title: 'Managed Devices',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="devices/[id]/index"
        options={{
          title: 'Device Details',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="add-device/index"
        options={{
          title: 'Add New Device',
          presentation: 'modal',
        }}
      />

      {/* Monitoring & Reports */}
      <Stack.Screen
        name="activities"
        options={{
          title: 'Activities',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="location-tracking"
        options={{
          title: 'Location Tracking',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="call-logs"
        options={{
          title: 'Call Records',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="messages"
        options={{
          title: 'Messages',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="reports/index"
        options={{
          title: 'Reports',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="reports/[type]"
        options={{
          title: 'Report Details',
          headerLargeTitle: true,
        }}
      />

      {/* Settings & Profile */}
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
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
        name="restrictions"
        options={{
          title: 'Restrictions',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
