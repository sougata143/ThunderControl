import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import GuestConversionModal from '../components/GuestConversionModal';
import { router } from 'expo-router';
import { Button } from 'react-native-elements';

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

export default function ParentDashboard() {
  const [showGuestModal, setShowGuestModal] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const isGuest = user?.isGuest;

  // Mock data for demonstration
  const devices: DeviceCard[] = [
    {
      id: '1',
      name: 'iPhone 12',
      type: 'mobile',
      status: 'online',
      batteryLevel: 85,
    },
    {
      id: '2',
      name: 'iPad Pro',
      type: 'tablet',
      status: 'offline',
      batteryLevel: 45,
    },
  ];

  const recentActivities: ActivityCard[] = [
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
      duration: '30 min',
      timestamp: '3 hours ago',
    },
  ];

  const handleDevicePress = (deviceId: string) => {
    router.push(`/devices/${deviceId}`);
  };

  const handleAddDevice = () => {
    router.push('/add-device');
  };

  const handleActivityPress = (activityId: string) => {
    router.push(`/parent/monitoring-report?activityId=${activityId}`);
  };

  const handleCreateAccount = () => {
    setShowGuestModal(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {isGuest && (
          <View style={styles.guestBanner}>
            <Text style={styles.guestText}>You're using ThunderControl as a guest</Text>
            <Button
              title="Create Account"
              onPress={() => setShowGuestModal(true)}
              type="outline"
              containerStyle={styles.createAccountButton}
            />
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Devices</Text>
          {devices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={styles.card}
              onPress={() => handleDevicePress(device.id)}
            >
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceType}>{device.type}</Text>
              </View>
              <View style={styles.deviceStatus}>
                <Text style={[
                  styles.statusText,
                  { color: device.status === 'online' ? '#4CAF50' : '#F44336' }
                ]}>
                  {device.status}
                </Text>
                <Text style={styles.batteryText}>{device.batteryLevel}%</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {recentActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.card}
              onPress={() => handleActivityPress(activity.id)}
            >
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityType}>{activity.type}</Text>
              </View>
              <View style={styles.activityDuration}>
                <Text style={styles.durationText}>{activity.duration}</Text>
                <Text style={styles.timestampText}>{activity.timestamp}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <GuestConversionModal visible={showGuestModal} onClose={() => setShowGuestModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  guestBanner: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 10,
  },
  createAccountButton: {
    minWidth: 120,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deviceType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deviceStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  batteryText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  activityType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  activityDuration: {
    alignItems: 'flex-end',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
