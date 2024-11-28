import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import MapView, { Marker, Circle } from 'react-native-maps';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { IconSymbol } from '../../components/ui/IconSymbol';
import Colors from '../../constants/Colors';
import DeviceMonitoringService, { LocationData, SafeZone } from '../../services/device-monitoring.service';

type LocationHistory = {
  id: string;
  location: string;
  timestamp: string;
  duration: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

const mockLocations: LocationHistory[] = [
  {
    id: '1',
    location: 'Home',
    timestamp: '2 hours ago',
    duration: '1h 30m',
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  {
    id: '2',
    location: 'School',
    timestamp: '4 hours ago',
    duration: '6h 15m',
    coordinates: {
      latitude: 37.7739,
      longitude: -122.4312,
    },
  },
];

export default function LocationTrackingScreen() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');

  useEffect(() => {
    loadLocations();
    loadSafeZones();
  }, []);

  useEffect(() => {
    if (isLiveTracking) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [isLiveTracking]);

  const loadLocations = async () => {
    try {
      const history = await DeviceMonitoringService.getLocationHistory();
      setLocations(history);
      if (history.length > 0) {
        setSelectedLocation(history[0]);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const loadSafeZones = async () => {
    try {
      const zones = await DeviceMonitoringService.getSafeZones();
      setSafeZones(zones);
    } catch (error) {
      console.error('Error loading safe zones:', error);
    }
  };

  const startTracking = async () => {
    try {
      await DeviceMonitoringService.startLocationTracking();
      // Refresh locations every 5 seconds
      const interval = setInterval(loadLocations, 5000);
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error starting tracking:', error);
      setIsLiveTracking(false);
    }
  };

  const stopTracking = async () => {
    await DeviceMonitoringService.stopLocationTracking();
  };

  const handleAddSafeZone = async () => {
    if (selectedLocation && newZoneName) {
      try {
        await DeviceMonitoringService.addSafeZone({
          name: newZoneName,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          radius: 100, // Default radius of 100 meters
        });
        setNewZoneName('');
        setIsAddingZone(false);
        loadSafeZones();
      } catch (error) {
        console.error('Error adding safe zone:', error);
      }
    }
  };

  const toggleLiveTracking = () => {
    setIsLiveTracking(!isLiveTracking);
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Location Tracking',
          headerLargeTitle: true,
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Live Tracking Toggle */}
          <TouchableOpacity
            style={[styles.liveTrackingButton, isLiveTracking && styles.liveTrackingActive]}
            onPress={toggleLiveTracking}
          >
            <View style={[styles.statusDot, isLiveTracking && styles.statusDotActive]} />
            <ThemedText style={styles.liveTrackingText}>
              {isLiveTracking ? 'Live Tracking Active' : 'Enable Live Tracking'}
            </ThemedText>
          </TouchableOpacity>

          {/* Map View */}
          <View style={styles.mapContainer}>
            {selectedLocation && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {/* Current Location Marker */}
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                  title="Current Location"
                  description={selectedLocation.address}
                />

                {/* Safe Zones */}
                {safeZones.map((zone) => (
                  <React.Fragment key={zone.id}>
                    <Marker
                      coordinate={{
                        latitude: zone.latitude,
                        longitude: zone.longitude,
                      }}
                      title={zone.name}
                      pinColor="green"
                    />
                    <Circle
                      center={{
                        latitude: zone.latitude,
                        longitude: zone.longitude,
                      }}
                      radius={zone.radius}
                      fillColor="rgba(0, 255, 0, 0.1)"
                      strokeColor="rgba(0, 255, 0, 0.5)"
                    />
                  </React.Fragment>
                ))}

                {/* Location History Path */}
                {locations.map((location, index) => (
                  <Marker
                    key={location.timestamp}
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    title={`Location ${index + 1}`}
                    description={location.address}
                    pinColor="blue"
                    opacity={0.7}
                  />
                ))}
              </MapView>
            )}
          </View>

          {/* Location History */}
          <View style={styles.section}>
            <ThemedText type="title" style={styles.sectionTitle}>Location History</ThemedText>
            {locations.map((location, index) => (
              <TouchableOpacity
                key={location.timestamp}
                style={styles.locationItem}
                onPress={() => setSelectedLocation(location)}
              >
                <View style={styles.locationIcon}>
                  <IconSymbol name="location.fill" size={24} color={Colors.light.tint} />
                </View>
                <View style={styles.locationInfo}>
                  <ThemedText type="defaultSemiBold">
                    {location.address || 'Unknown Location'}
                  </ThemedText>
                  <ThemedText style={styles.locationTimestamp}>
                    {new Date(location.timestamp).toLocaleString()}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Safe Zones */}
          <View style={styles.section}>
            <ThemedText type="title" style={styles.sectionTitle}>Safe Zones</ThemedText>
            {safeZones.map((zone) => (
              <View key={zone.id} style={styles.locationItem}>
                <View style={[styles.locationIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                  <IconSymbol name="shield.fill" size={24} color="#4CAF50" />
                </View>
                <View style={styles.locationInfo}>
                  <ThemedText type="defaultSemiBold">{zone.name}</ThemedText>
                  <ThemedText style={styles.locationTimestamp}>
                    Radius: {zone.radius}m
                  </ThemedText>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addZoneButton}
              onPress={() => {
                if (selectedLocation) {
                  setIsAddingZone(true);
                }
              }}
            >
              <IconSymbol name="plus.circle.fill" size={24} color={Colors.light.tint} />
              <ThemedText style={styles.addZoneText}>Add Safe Zone</ThemedText>
            </TouchableOpacity>
          </View>
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
  liveTrackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  liveTrackingActive: {
    backgroundColor: Colors.light.tint + '10',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#757575',
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: '#4CAF50',
  },
  liveTrackingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    height: 300,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  locationItem: {
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
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.tint + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTimestamp: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addZoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addZoneText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: '600',
  },
});
