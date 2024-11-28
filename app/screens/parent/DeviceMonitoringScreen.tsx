import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Icon, ListItem, Switch } from 'react-native-elements';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ParentStackParamList } from '../../navigation/types';
import { MonitoringService } from '../../services/monitoring.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type RouteProps = RouteProp<ParentStackParamList, 'DeviceMonitoring'>;

interface AppUsage {
  appName: string;
  duration: number;
  lastUsed: number;
}

const DeviceMonitoringScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const { deviceId } = route.params;
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchDeviceInfo();
    fetchAppUsage();
    subscribeToDeviceLock();
  }, [deviceId]);

  const fetchDeviceInfo = async () => {
    try {
      const stats = await MonitoringService.getDeviceStats(deviceId, 1);
      setDeviceInfo(stats.deviceInfo);
    } catch (error) {
      console.error('Error fetching device info:', error);
    }
  };

  const fetchAppUsage = async () => {
    try {
      const stats = await MonitoringService.getDeviceStats(deviceId, 1);
      const apps = Object.entries(stats.screenTime || {}).map(([appName, data]: [string, any]) => ({
        appName,
        duration: data.duration,
        lastUsed: data.lastUsed,
      }));
      setAppUsage(apps.sort((a, b) => b.duration - a.duration));
    } catch (error) {
      console.error('Error fetching app usage:', error);
    }
  };

  const subscribeToDeviceLock = () => {
    MonitoringService.subscribeToDeviceLock(deviceId, (locked) => {
      setIsLocked(locked);
    });
  };

  const handleLockToggle = async () => {
    try {
      await MonitoringService.setDeviceLock(deviceId, !isLocked);
      Alert.alert(
        'Success',
        `Device has been ${!isLocked ? 'locked' : 'unlocked'}`
      );
    } catch (error) {
      console.error('Error toggling device lock:', error);
      Alert.alert('Error', 'Failed to toggle device lock');
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!deviceInfo) {
    return (
      <View style={styles.container}>
        <Text>Loading device information...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.deviceCard}>
        <View style={styles.deviceHeader}>
          <Icon
            name="phone-android"
            type="material"
            size={40}
            color={deviceInfo.isOnline ? '#4CAF50' : '#757575'}
          />
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{deviceInfo.deviceName}</Text>
            <Text style={styles.deviceStatus}>
              {deviceInfo.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Icon name="battery-std" type="material" color="#666" />
            <Text style={styles.statText}>
              {Math.round(deviceInfo.batteryLevel * 100)}%
            </Text>
          </View>
          <View style={styles.stat}>
            <Icon name="access-time" type="material" color="#666" />
            <Text style={styles.statText}>
              {formatDuration(
                appUsage.reduce((total, app) => total + app.duration, 0) / 60
              )}
            </Text>
          </View>
        </View>

        <View style={styles.lockContainer}>
          <Text style={styles.lockText}>Device Lock</Text>
          <Switch value={isLocked} onValueChange={handleLockToggle} />
        </View>
      </Card>

      <Card containerStyle={styles.usageCard}>
        <Card.Title>App Usage Today</Card.Title>
        {appUsage.map((app, index) => (
          <ListItem key={index} bottomDivider>
            <Icon name="android" type="material" />
            <ListItem.Content>
              <ListItem.Title>{app.appName}</ListItem.Title>
              <ListItem.Subtitle>
                Last used: {new Date(app.lastUsed).toLocaleTimeString()}
              </ListItem.Subtitle>
            </ListItem.Content>
            <Text>{formatDuration(app.duration / 60)}</Text>
          </ListItem>
        ))}
        {appUsage.length === 0 && (
          <Text style={styles.noDataText}>No app usage data available</Text>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  deviceCard: {
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  deviceInfo: {
    marginLeft: 15,
  },
  deviceName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  deviceStatus: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statText: {
    marginTop: 5,
    color: '#666',
  },
  lockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  lockText: {
    fontSize: 16,
  },
  usageCard: {
    borderRadius: 10,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
});

export default DeviceMonitoringScreen;
