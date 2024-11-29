import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import DeviceManagementService, { ChildDevice } from '@/services/device-management.service';
import { useFocusEffect } from '@react-navigation/native';

export default function DevicesScreen() {
  const router = useRouter();
  const [devices, setDevices] = useState<ChildDevice[]>([]);
  const [loading, setLoading] = useState(true);

  // Configure header with add button
  React.useLayoutEffect(() => {
    router.setParams({
      header: () => (
        <Stack.Screen
          options={{
            title: 'Devices',
            headerRight: () => (
              <TouchableOpacity
                onPress={handleAddDevice}
                style={styles.headerButton}
              >
                <IconSymbol name="plus.circle.fill" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
            ),
          }}
        />
      ),
    });
  }, [router]);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const deviceList = await DeviceManagementService.getChildDevices();
      setDevices(deviceList);
    } catch (error) {
      console.error('Error loading devices:', error);
      Alert.alert('Error', 'Failed to load devices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reload devices when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadDevices();
    }, [])
  );

  const handleAddDevice = () => {
    router.push('/(parent)/add-device');
  };

  const handleDevicePress = (deviceId: string) => {
    router.push(`/(parent)/devices/${deviceId}`);
  };

  const handleDeviceAction = async (deviceId: string, action: string) => {
    try {
      switch (action) {
        case 'remove':
          Alert.alert(
            'Remove Device',
            'Are you sure you want to remove this device? This action cannot be undone.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Remove',
                style: 'destructive',
                onPress: async () => {
                  await DeviceManagementService.removeDevice(deviceId);
                  loadDevices();
                },
              },
            ]
          );
          break;
        case 'restrictions':
          router.push(`/device-restrictions/${deviceId}`);
          break;
        default:
          console.warn('Unknown action:', action);
      }
    } catch (error) {
      console.error('Error performing device action:', error);
      Alert.alert('Error', 'Failed to perform action. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Devices',
          headerRight: () => (
            <TouchableOpacity
              onPress={handleAddDevice}
              style={styles.headerButton}
            >
              <IconSymbol name="plus.circle.fill" size={24} color={Colors.light.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="devices" size={64} color={Colors.light.primary} />
          <ThemedText style={styles.emptyStateTitle}>No Devices</ThemedText>
          <ThemedText style={styles.emptyStateText}>
            Add a child device to start monitoring
          </ThemedText>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddDevice}
          >
            <IconSymbol name="plus" size={20} color="#fff" />
            <ThemedText style={styles.addButtonText}>Add Device</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {devices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceCard}
              onPress={() => handleDevicePress(device.id)}
            >
              <View style={styles.deviceInfo}>
                <View style={styles.deviceHeader}>
                  <ThemedText style={styles.deviceName}>{device.name}</ThemedText>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: device.status === 'online' ? '#4CAF50' : '#9E9E9E' }
                  ]} />
                </View>
                <ThemedText style={styles.deviceModel}>{device.deviceModel}</ThemedText>
                <View style={styles.deviceStats}>
                  <View style={styles.statItem}>
                    <IconSymbol name="battery.100" size={16} color="#666" />
                    <ThemedText style={styles.statText}>
                      {Math.round((device.batteryLevel || 0) * 100)}%
                    </ThemedText>
                  </View>
                  <View style={styles.statItem}>
                    <IconSymbol name="clock" size={16} color="#666" />
                    <ThemedText style={styles.statText}>
                      Last seen: {new Date(device.lastSeen).toLocaleTimeString()}
                    </ThemedText>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleDeviceAction(device.id, 'remove')}
              >
                <IconSymbol name="trash" size={20} color="#ff3b30" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    marginRight: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deviceModel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  deviceStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  removeButton: {
    padding: 8,
  },
});
