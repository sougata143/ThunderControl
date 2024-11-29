import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import DeviceManagementService, { ChildDevice } from '@/services/device-management.service';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function LocationTrackingScreen() {
  const [devices, setDevices] = useState<ChildDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const deviceList = await DeviceManagementService.getChildDevices();
      setDevices(deviceList.filter(device => device.location));
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Location Tracking',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      {devices.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateTitle}>No Location Data</ThemedText>
          <ThemedText style={styles.emptyStateText}>
            No devices are currently sharing their location
          </ThemedText>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: devices[0].location?.latitude || 0,
              longitude: devices[0].location?.longitude || 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {devices.map((device) => (
              device.location && (
                <Marker
                  key={device.id}
                  coordinate={{
                    latitude: device.location.latitude,
                    longitude: device.location.longitude,
                  }}
                  title={device.name}
                  description={`Last updated: ${new Date(device.location.timestamp).toLocaleString()}`}
                />
              )
            ))}
          </MapView>
        </View>
      )}

      <View style={styles.deviceList}>
        {devices.map((device) => (
          <View key={device.id} style={styles.deviceItem}>
            <View>
              <ThemedText style={styles.deviceName}>{device.name}</ThemedText>
              {device.location ? (
                <ThemedText style={styles.lastUpdate}>
                  Last updated: {new Date(device.location.timestamp).toLocaleString()}
                </ThemedText>
              ) : (
                <ThemedText style={styles.noLocation}>Location not available</ThemedText>
              )}
            </View>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  deviceList: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#666',
  },
  noLocation: {
    fontSize: 12,
    color: '#ff3b30',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
