import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { ParentStackParamList } from './types';
import ParentDashboardScreen from '../screens/parent/ParentDashboardScreen';
import DeviceMonitoringScreen from '../screens/parent/DeviceMonitoringScreen';
import LocationTrackingScreen from '../screens/parent/LocationTrackingScreen';
import ScreenTimeScreen from '../screens/parent/ScreenTimeScreen';
import CommunicationScreen from '../screens/parent/CommunicationScreen';
import SettingsScreen from '../screens/parent/SettingsScreen';
import MonitoringReportScreen from '../screens/parent/MonitoringReportScreen';

const Tab = createBottomTabNavigator<ParentStackParamList>();

const ParentNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'DeviceMonitoring':
              iconName = 'devices';
              break;
            case 'LocationTracking':
              iconName = 'location-on';
              break;
            case 'ScreenTime':
              iconName = 'timer';
              break;
            case 'Communication':
              iconName = 'message';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            case 'MonitoringReport':
              iconName = 'assessment';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <Icon
              name={iconName}
              type="material"
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={ParentDashboardScreen}
        options={{
          title: 'Dashboard'
        }}
      />
      <Tab.Screen
        name="DeviceMonitoring"
        component={DeviceMonitoringScreen}
        options={{
          title: 'Devices'
        }}
      />
      <Tab.Screen
        name="LocationTracking"
        component={LocationTrackingScreen}
        options={{
          title: 'Location'
        }}
      />
      <Tab.Screen
        name="ScreenTime"
        component={ScreenTimeScreen}
        options={{
          title: 'Screen Time'
        }}
      />
      <Tab.Screen
        name="Communication"
        component={CommunicationScreen}
        options={{
          title: 'Messages'
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings'
        }}
      />
      <Tab.Screen
        name="MonitoringReport"
        component={MonitoringReportScreen}
        options={{
          title: 'Reports'
        }}
      />
    </Tab.Navigator>
  );
};

export default ParentNavigator;
