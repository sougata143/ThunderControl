import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { IconSymbol } from '../../components/ui/IconSymbol';
import Colors from '../../constants/Colors';

type ChildDevice = {
  id: string;
  name: string;
  deviceType: string;
  lastActive: string;
  status: 'online' | 'offline';
  icon: string;
};

const mockDevices: ChildDevice[] = [
  {
    id: '1',
    name: "Sarah's iPhone",
    deviceType: 'iPhone 13',
    lastActive: '2 mins ago',
    status: 'online',
    icon: 'iphone',
  },
  {
    id: '2',
    name: "Tom's iPad",
    deviceType: 'iPad Air',
    lastActive: '15 mins ago',
    status: 'online',
    icon: 'ipad',
  },
];

export default function DevicesScreen() {
  const router = useRouter();
  const [devices] = useState<ChildDevice[]>(mockDevices);

  const handleAddDevice = () => {
    router.push('/add-device');
  };

  const handleDevicePress = (deviceId: string) => {
    router.push(`/device-details/${deviceId}`);
  };

  const handleDeviceAction = (deviceId: string, action: string) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this device?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => console.log(`${action} device ${deviceId}`),
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Managed Devices',
          headerLargeTitle: true,
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <ThemedText type="title">Connected Devices</ThemedText>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddDevice}
            >
              <IconSymbol name="plus.circle.fill" size={24} color={Colors.light.tint} />
              <ThemedText style={styles.addButtonText}>Add Device</ThemedText>
            </TouchableOpacity>
          </View>

          {devices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceCard}
              onPress={() => handleDevicePress(device.id)}
            >
              <View style={styles.deviceIcon}>
                <IconSymbol name={device.icon} size={32} color={Colors.light.tint} />
              </View>
              <View style={styles.deviceInfo}>
                <ThemedText type="defaultSemiBold">{device.name}</ThemedText>
                <ThemedText style={styles.deviceType}>{device.deviceType}</ThemedText>
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: device.status === 'online' ? '#4CAF50' : '#757575' }
                  ]} />
                  <ThemedText style={styles.lastActive}>
                    {device.status === 'online' ? 'Online' : device.lastActive}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeviceAction(device.id, 'pause')}
                >
                  <IconSymbol name="pause.circle.fill" size={24} color="#FF9800" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeviceAction(device.id, 'block')}
                >
                  <IconSymbol name="xmark.circle.fill" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {devices.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol name="devices" size={64} color={Colors.light.tint} />
              <ThemedText type="title" style={styles.emptyStateTitle}>
                No Devices Added
              </ThemedText>
              <ThemedText style={styles.emptyStateText}>
                Add your child's device to start monitoring and managing their digital activities.
              </ThemedText>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.tint + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 4,
    color: Colors.light.tint,
    fontWeight: '600',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.tint + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  lastActive: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyStateTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 32,
  },
});
