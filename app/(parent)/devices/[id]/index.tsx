import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';

type DeviceStat = {
  id: string;
  title: string;
  value: string;
  icon: string;
  color: string;
};

type MonitoringControl = {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
};

const deviceStats: DeviceStat[] = [
  {
    id: '1',
    title: 'Screen Time Today',
    value: '4h 30m',
    icon: 'timer',
    color: '#FF6B6B',
  },
  {
    id: '2',
    title: 'Apps Used',
    value: '8 apps',
    icon: 'apps.iphone',
    color: '#4ECDC4',
  },
  {
    id: '3',
    title: 'Battery Level',
    value: '75%',
    icon: 'battery.75',
    color: '#45B7D1',
  },
  {
    id: '4',
    title: 'Storage Used',
    value: '45.2 GB',
    icon: 'internaldrive',
    color: '#96CEB4',
  },
];

const monitoringControls: MonitoringControl[] = [
  {
    id: '1',
    title: 'App Usage Tracking',
    description: 'Monitor which apps are being used and for how long',
    icon: 'chart.bar',
    enabled: true,
  },
  {
    id: '2',
    title: 'Web History',
    description: 'Track websites visited on the device',
    icon: 'safari',
    enabled: true,
  },
  {
    id: '3',
    title: 'Location Tracking',
    description: 'Monitor device location in real-time',
    icon: 'location',
    enabled: false,
  },
  {
    id: '4',
    title: 'Screen Time Limits',
    description: 'Set and enforce daily screen time limits',
    icon: 'hourglass',
    enabled: true,
  },
];

export default function DeviceDetailsScreen() {
  const { id } = useLocalSearchParams();
  
  const toggleControl = (controlId: string) => {
    // Implement toggle functionality
    console.log('Toggle control:', controlId);
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Sarah's iPhone",
          headerLargeTitle: true,
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.statsGrid}>
            {deviceStats.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                  <IconSymbol name={stat.icon} size={24} color={stat.color} />
                </View>
                <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                <ThemedText style={styles.statTitle}>{stat.title}</ThemedText>
              </View>
            ))}
          </View>

          <ThemedText type="title" style={styles.sectionTitle}>Monitoring Controls</ThemedText>

          {monitoringControls.map((control) => (
            <TouchableOpacity
              key={control.id}
              style={styles.controlItem}
              onPress={() => toggleControl(control.id)}
            >
              <View style={styles.controlIcon}>
                <IconSymbol name={control.icon} size={24} color={Colors.light.tint} />
              </View>
              <View style={styles.controlContent}>
                <ThemedText type="defaultSemiBold">{control.title}</ThemedText>
                <ThemedText style={styles.controlDescription}>{control.description}</ThemedText>
              </View>
              <View style={[styles.toggle, control.enabled && styles.toggleEnabled]} />
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  controlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  controlIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  controlContent: {
    flex: 1,
  },
  controlDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
    marginLeft: 12,
  },
  toggleEnabled: {
    backgroundColor: Colors.light.tint,
  },
});
