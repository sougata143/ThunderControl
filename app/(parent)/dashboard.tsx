import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import GuestConversionModal from '../components/GuestConversionModal';

interface DeviceCard {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
  batteryLevel: number;
}

interface ActivityCard {
  id: string;
  type: string;
  title: string;
  duration: string;
  timestamp: string;
}

const mockDevices: DeviceCard[] = [
  {
    id: '1',
    name: 'iPhone 13',
    type: 'mobile',
    status: 'online',
    batteryLevel: 85,
  },
  {
    id: '2',
    name: 'iPad Pro',
    type: 'tablet',
    status: 'offline',
    batteryLevel: 20,
  },
];

const mockActivities: ActivityCard[] = [
  {
    id: '1',
    type: 'app',
    title: 'TikTok',
    duration: '45 min',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'web',
    title: 'YouTube',
    duration: '1 hour',
    timestamp: '3 hours ago',
  },
];

export default function ParentDashboardScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const isGuest = user?.isGuest ?? false;

  const renderDeviceCard = (device: DeviceCard) => (
    <View key={device.id} style={styles.deviceCard}>
      <Text style={styles.deviceName}>{device.name}</Text>
      <Text style={[
        styles.deviceStatus,
        { color: device.status === 'online' ? '#34C759' : '#FF3B30' }
      ]}>
        {device.status}
      </Text>
      <Text style={styles.batteryLevel}>{device.batteryLevel}%</Text>
    </View>
  );

  const renderActivityCard = (activity: ActivityCard) => (
    <View key={activity.id} style={styles.activityCard}>
      <Text style={styles.activityTitle}>{activity.title}</Text>
      <Text style={styles.activityDuration}>{activity.duration}</Text>
      <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
    </View>
  );

  const renderFeatureCard = (title: string, isLocked: boolean = false) => (
    <TouchableOpacity 
      style={[styles.featureCard, isLocked && styles.lockedFeature]}
      disabled={isLocked}
    >
      <Text style={styles.featureTitle}>{title}</Text>
      {isLocked && (
        <Text style={styles.lockedText}>
          {isGuest ? 'Guest Preview' : 'Locked'}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {isGuest && (
        <TouchableOpacity 
          style={styles.guestBanner}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.guestBannerText}>
            👋 You're in guest mode. Create an account to unlock all features!
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Devices</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mockDevices.map(renderDeviceCard)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.featureGrid}>
          {renderFeatureCard('Screen Time', isGuest)}
          {renderFeatureCard('App Usage', false)}
          {renderFeatureCard('Location', isGuest)}
          {renderFeatureCard('Communication', isGuest)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {mockActivities.map(renderActivityCard)}
      </View>

      <GuestConversionModal 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  guestBanner: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 10,
    borderRadius: 10,
  },
  guestBannerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  deviceCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    width: 150,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  deviceStatus: {
    fontSize: 14,
    marginBottom: 5,
  },
  batteryLevel: {
    fontSize: 14,
    color: '#666',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    marginBottom: 15,
  },
  lockedFeature: {
    opacity: 0.7,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  lockedText: {
    fontSize: 12,
    color: '#FF3B30',
  },
  activityCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  activityDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  activityTimestamp: {
    fontSize: 12,
    color: '#999',
  },
});
