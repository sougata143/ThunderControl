import { Stack } from 'expo-router';

export default function ChildLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="activities"
        options={{
          title: 'Activities',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="restrictions"
        options={{
          title: 'Restrictions',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
