import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Redirect } from 'expo-router';

export default function ChildLayout() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isParent = useSelector((state: RootState) => 
    state.device.info?.isParent ?? false
  );

  // Protect child routes
  if (!user || isParent) {
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
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'My Dashboard',
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
