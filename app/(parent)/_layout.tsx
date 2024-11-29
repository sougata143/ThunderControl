import { Tabs } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol name="chart.bar" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: 'Devices',
          tabBarIcon: ({ color }) => <IconSymbol name="iphone" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="call-logs"
        options={{
          title: 'Calls',
          tabBarIcon: ({ color }) => <IconSymbol name="phone" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <IconSymbol name="message" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => <IconSymbol name="doc.text" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
