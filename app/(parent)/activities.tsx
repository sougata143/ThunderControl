import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { IconSymbol } from '../components/ui/IconSymbol';
import Colors from '../constants/Colors';

type Activity = {
  id: string;
  type: 'app' | 'web' | 'location' | 'screen';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
};

const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'app',
    title: 'YouTube',
    description: 'App used for 2 hours',
    timestamp: '2 hours ago',
    icon: 'play.circle.fill',
  },
  {
    id: '2',
    type: 'web',
    title: 'Web Browsing',
    description: 'Visited educational websites',
    timestamp: '3 hours ago',
    icon: 'safari.fill',
  },
  {
    id: '3',
    type: 'location',
    title: 'Location Update',
    description: 'Device location changed',
    timestamp: '4 hours ago',
    icon: 'location.fill',
  },
  {
    id: '4',
    type: 'screen',
    title: 'Screen Time',
    description: 'Screen time limit reached',
    timestamp: '5 hours ago',
    icon: 'timer',
  },
];

export default function ActivitiesScreen() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Recent Activities',
          headerLargeTitle: true,
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {recentActivities.map((activity) => (
            <TouchableOpacity key={activity.id} style={styles.activityItem}>
              <View style={styles.iconContainer}>
                <IconSymbol 
                  name={activity.icon} 
                  size={24} 
                  color={Colors.light.tint}
                />
              </View>
              <View style={styles.activityContent}>
                <ThemedText type="defaultSemiBold">{activity.title}</ThemedText>
                <ThemedText style={styles.description}>{activity.description}</ThemedText>
                <ThemedText style={styles.timestamp}>{activity.timestamp}</ThemedText>
              </View>
              <IconSymbol 
                name="chevron.right" 
                size={20} 
                color={Colors.light.text} 
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  chevron: {
    marginLeft: 8,
  },
});
