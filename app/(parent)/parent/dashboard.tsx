import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import GuestConversionModal from '../../components/GuestConversionModal';
import { Card, Icon, Button } from 'react-native-elements';
import { router } from 'expo-router';

export default function ParentDashboardScreen() {
  const [showConversionModal, setShowConversionModal] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const isGuest = user?.isGuest ?? false;

  // Mock data for guest preview
  const mockDevices = [
    { id: 'demo1', name: 'Demo Device 1', type: 'Smartphone', status: 'Online' },
    { id: 'demo2', name: 'Demo Device 2', type: 'Tablet', status: 'Offline' },
  ];

  const mockActivities = [
    { id: 1, app: 'Social Media', duration: '45 min', time: '2 hours ago' },
    { id: 2, app: 'Games', duration: '30 min', time: '3 hours ago' },
    { id: 3, app: 'Educational', duration: '1 hour', time: '4 hours ago' },
  ];

  // Show conversion modal after a delay for guest users
  useEffect(() => {
    if (isGuest) {
      const timer = setTimeout(() => {
        setShowConversionModal(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isGuest]);

  const renderFeatureCard = (title: string, icon: string, description: string, action: () => void, locked: boolean = false) => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name={icon} type="material" size={24} color="#007AFF" />
        <Text style={styles.cardTitle}>{title}</Text>
        {locked && <Icon name="lock" type="material" size={20} color="#666" />}
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
      <Button
        title={locked ? "Unlock Feature" : "View"}
        onPress={action}
        type={locked ? "outline" : "solid"}
        buttonStyle={[styles.cardButton, locked && styles.lockedButton]}
        disabled={locked}
      />
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      {isGuest && (
        <View style={styles.guestBanner}>
          <Text style={styles.guestText}>
            You're using a guest account. Some features are limited.
          </Text>
          <TouchableOpacity
            style={styles.convertButton}
            onPress={() => setShowConversionModal(true)}
          >
            <Text style={styles.convertButtonText}>
              Convert to Full Account
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Devices</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deviceList}>
          {mockDevices.map((device) => (
            <Card key={device.id} containerStyle={styles.deviceCard}>
              <Icon
                name={device.type === 'Smartphone' ? 'phone-android' : 'tablet-android'}
                type="material"
                size={32}
                color={device.status === 'Online' ? '#4CAF50' : '#666'}
              />
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={[
                styles.deviceStatus,
                { color: device.status === 'Online' ? '#4CAF50' : '#666' }
              ]}>
                {device.status}
              </Text>
            </Card>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {renderFeatureCard(
          "Screen Time",
          "timer",
          "Monitor and control device usage time",
          () => router.push('/parent/screen-time'),
          isGuest
        )}
        {renderFeatureCard(
          "App Usage",
          "apps",
          "Track application usage statistics",
          () => {},
          false
        )}
        {renderFeatureCard(
          "Location Tracking",
          "location-on",
          "Track device location in real-time",
          () => router.push('/parent/location-tracking'),
          isGuest
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {mockActivities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <Icon name="access-time" type="material" size={24} color="#666" />
            <View style={styles.activityInfo}>
              <Text style={styles.activityApp}>{activity.app}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
            <Text style={styles.activityDuration}>{activity.duration}</Text>
          </View>
        ))}
      </View>

      <GuestConversionModal
        isVisible={showConversionModal}
        onClose={() => setShowConversionModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  guestBanner: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  guestText: {
    color: '#856404',
    fontSize: 14,
    marginBottom: 10,
  },
  convertButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginVertical: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  deviceList: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  deviceCard: {
    width: 120,
    marginRight: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  deviceStatus: {
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
  cardDescription: {
    color: '#666',
    marginBottom: 15,
  },
  cardButton: {
    borderRadius: 5,
  },
  lockedButton: {
    borderColor: '#666',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityInfo: {
    flex: 1,
    marginLeft: 15,
  },
  activityApp: {
    fontSize: 16,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  activityDuration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
});
