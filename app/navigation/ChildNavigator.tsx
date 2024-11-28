import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { ChildStackParamList } from './types';
import ChildHomeScreen from '../screens/child/ChildHomeScreen';
import ChildActivitiesScreen from '../screens/child/ChildActivitiesScreen';
import ChildRestrictionsScreen from '../screens/child/ChildRestrictionsScreen';
import ChildProfileScreen from '../screens/child/ChildProfileScreen';

const Tab = createBottomTabNavigator<ChildStackParamList>();

const ChildNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Activities':
              iconName = 'history';
              break;
            case 'Restrictions':
              iconName = 'block';
              break;
            case 'Profile':
              iconName = 'person';
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
        name="Home"
        component={ChildHomeScreen}
        options={{
          title: 'Home'
        }}
      />
      <Tab.Screen
        name="Activities"
        component={ChildActivitiesScreen}
        options={{
          title: 'Activities'
        }}
      />
      <Tab.Screen
        name="Restrictions"
        component={ChildRestrictionsScreen}
        options={{
          title: 'Restrictions'
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ChildProfileScreen}
        options={{
          title: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
};

export default ChildNavigator;
