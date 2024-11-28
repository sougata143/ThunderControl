import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Icon, ListItem } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { MonitoringService } from '../../services/monitoring.service';
import { updateLinkedDevices } from '../../store/slices/deviceSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParentStackParamList } from '../../navigation/types';
import { AuthService } from '../../services/auth.service';
import { GuestConversionModal } from '../../components/GuestConversionModal';

type Props = {
  navigation: NativeStackNavigationProp<ParentStackParamList, 'Dashboard'>;
};

interface DeviceSummary {
  deviceId: string;
  deviceName: string;
  lastSeen: string;
  batteryLevel: number;
  isOnline: boolean;
  screenTimeToday: number;
}

const ParentDashboardScreen = ({ navigation }: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [deviceSummaries, setDeviceSummaries] = useState<DeviceSummary[]>([]);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const linkedDevices = useSelector((state: RootState) => state.device.linkedDevices);
  const isGuest = AuthService.isGuest();

  const fetchDeviceSummaries = async () => {
    if (!user) return;
    
    try {
      const summaries: DeviceSummary[] = [];
      for (const deviceId of linkedDevices) {
        const deviceStats = await MonitoringService.getDeviceStats(deviceId, 1);
        const deviceInfo = deviceStats.deviceInfo;
        
        summaries.push({
          deviceId,
          deviceName: deviceInfo.deviceName,
          lastSeen: new Date(deviceInfo.lastUpdated).toLocaleString(),
          batteryLevel: deviceInfo.batteryLevel,
          isOnline: deviceInfo.isOnline,
          screenTimeToday: Object.values(deviceStats.screenTime || {})
            .reduce((total: number, app: any) => total + app.duration, 0),
        });
      }
      setDeviceSummaries(summaries);
    } catch (error) {
      console.error('Error fetching device summaries:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDeviceSummaries();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDeviceSummaries();
  }, [linkedDevices]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="settings"
          type="material"
          size={24}
          color="#007AFF"
          containerStyle={{ marginRight: 15 }}
          onPress={() => navigation.navigate('Settings')}
        />
      ),
    });
  }, [navigation]);

  const navigateToDeviceDetails = (deviceId: string) => {
    navigation.navigate('DeviceMonitoring', { deviceId });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {isGuest && (
        <Card 
          containerStyle={styles.guestBanner}
        >
          <View style={styles.guestBannerContent}>
            <Icon
              name="info"
              type="material"
              color="#007AFF"
              size={24}
              containerStyle={styles.guestBannerIcon}
            />
            <View style={styles.guestBannerText}>
              <Text style={styles.guestBannerTitle}>
                You're using a guest account
              </Text>
              <Text style={styles.guestBannerSubtitle}>
                Create a full account to access all features and save your data
              </Text>
            </View>
          </View>
          <Button
            title="Create Account"
            type="outline"
            onPress={() => setShowConversionModal(true)}
            containerStyle={styles.guestBannerButton}
          />
        </Card>
      )}

      <Card containerStyle={styles.summaryCard}>
        <Card.Title>Monitored Devices</Card.Title>
        <Text style={styles.summaryText}>
          {linkedDevices.length} {linkedDevices.length === 1 ? 'device' : 'devices'} connected
        </Text>
        <Button
          title="Add Device"
          onPress={() => navigation.navigate('AddChild')}
          icon={<Icon name="add" color="white" />}
          buttonStyle={styles.addButton}
        />
      </Card>

      {deviceSummaries.map((device) => (
        <Card key={device.deviceId} containerStyle={styles.deviceCard}>
          <ListItem onPress={() => navigateToDeviceDetails(device.deviceId)}>
            <Icon
              name="phone-android"
              type="material"
              color={device.isOnline ? '#4CAF50' : '#757575'}
            />
            <ListItem.Content>
              <ListItem.Title>{device.deviceName}</ListItem.Title>
              <ListItem.Subtitle>
                Last seen: {device.lastSeen}
              </ListItem.Subtitle>
            </ListItem.Content>
            <View style={styles.deviceActions}>
              <Icon
                name="timer"
                type="material"
                color="#007AFF"
                size={24}
                onPress={() => navigation.navigate('ScreenTime', { deviceId: device.deviceId })}
                containerStyle={styles.actionIcon}
              />
              <Icon
                name="message"
                type="material"
                color="#4CAF50"
                size={24}
                onPress={() => navigation.navigate('Communication', { deviceId: device.deviceId })}
                containerStyle={styles.actionIcon}
              />
              <View style={styles.deviceStats}>
                <Text style={styles.batteryText}>
                  {Math.round(device.batteryLevel * 100)}%
                </Text>
                <Text style={styles.screenTimeText}>
                  {Math.round(device.screenTimeToday / (60 * 1000))} min today
                </Text>
              </View>
            </View>
            <ListItem.Chevron />
          </ListItem>
        </Card>
      ))}

      {deviceSummaries.length === 0 && (
        <Card containerStyle={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No devices connected yet. Add a device to start monitoring.
          </Text>
          <Button
            title="Add Your First Device"
            onPress={() => navigation.navigate('AddChild')}
            icon={<Icon name="add" color="white" />}
            buttonStyle={styles.addButton}
          />
        </Card>
      )}
      <GuestConversionModal
        isVisible={showConversionModal}
        onClose={() => setShowConversionModal(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceCard: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 0,
  },
  emptyCard: {
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    borderRadius: 25,
    paddingHorizontal: 30,
  },
  deviceActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 15,
    padding: 5,
  },
  deviceStats: {
    alignItems: 'flex-end',
  },
  batteryText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  screenTimeText: {
    fontSize: 12,
    color: '#666',
  },
  guestBanner: {
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F5F8FF',
    borderColor: '#007AFF',
  },
  guestBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  guestBannerIcon: {
    marginRight: 10,
  },
  guestBannerText: {
    flex: 1,
  },
  guestBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  guestBannerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  guestBannerButton: {
    marginHorizontal: 0,
  },
});

export default ParentDashboardScreen;
