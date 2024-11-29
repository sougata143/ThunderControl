import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import DeviceManagementService from '@/services/device-management.service';
import { Device } from '@/types/device';
import { useFocusEffect } from '@react-navigation/native';

export default function DevicesScreen() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
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

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {devices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol name="iphone.slash" size={48} color={Colors.light.text} />
            <ThemedText style={styles.emptyText}>
              No devices added yet
            </ThemedText>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddDevice}
            >
              <ThemedText style={styles.addButtonText}>
                Add Device
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          devices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceCard}
              onPress={() => handleDevicePress(device.id)}
            >
              <View style={styles.deviceIcon}>
                <IconSymbol
                  name={device.status === 'online' ? 'iphone' : 'iphone.slash'}
                  size={24}
                  color={device.status === 'online' ? Colors.light.success : Colors.light.error}
                />
              </View>
              <View style={styles.deviceInfo}>
                <ThemedText style={styles.deviceName}>{device.name}</ThemedText>
                <ThemedText style={styles.deviceModel}>{device.deviceModel}</ThemedText>
                <View style={styles.deviceStatus}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          device.status === 'online'
                            ? Colors.light.success
                            : Colors.light.error,
                      },
                    ]}
                  />
                  <ThemedText style={styles.statusText}>
                    {device.status}
                  </ThemedText>
                </View>
              </View>
              <IconSymbol
                name="chevron.right"
                size={20}
                color={Colors.light.text}
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 16,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deviceModel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  chevron: {
    marginLeft: 8,
  },
});
