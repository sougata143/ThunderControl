import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const user = useSelector((state: RootState) => state.auth.user);
  const deviceInfo = useSelector((state: RootState) => state.device.info);

  // If user is logged in, redirect to appropriate dashboard
  if (user) {
    if (deviceInfo?.isParent) {
      return <Redirect href="/(parent)/dashboard" />;
    } else {
      return <Redirect href="/(child)/dashboard" />;
    }
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Register',
        }}
      />
    </Stack>
  );
}
