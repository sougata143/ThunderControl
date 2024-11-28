import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useRoute } from '@react-navigation/native';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../../config/firebase';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RouteParams {
  deviceId: string;
}

const LocationTrackingScreen = () => {
  const route = useRoute();
  const { deviceId } = route.params as RouteParams;
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    let locationRef: any;

    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'granted') {
          subscribeToLocation();
        }
      }

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'ThunderControl needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          subscribeToLocation();
        }
      }
    };

    const subscribeToLocation = () => {
      // Subscribe to location updates from the device
      locationRef = ref(db, `locations/${deviceId}`);
      onValue(locationRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setLocation(data);
        }
      });
    };

    requestLocationPermission();

    return () => {
      if (locationRef) {
        off(locationRef);
      }
    };
  }, [deviceId]);

  if (!location) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Device Location"
          description={`Last updated: ${new Date(location.timestamp).toLocaleString()}`}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default LocationTrackingScreen;
