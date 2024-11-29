import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import DeviceManagementService, { ChildDevice } from '@/services/device-management.service';

type Restriction = {
  id: keyof ChildDevice['restrictions'];
  title: string;
  description: string;
  icon: string;
};

const restrictions: Restriction[] = [
  {
    id: 'appUsageLimits',
    title: 'App Usage Limits',
    description: 'Set daily time limits for specific apps',
    icon: 'timer',
  },
  {
    id: 'contentFiltering',
    title: 'Content Filtering',
    description: 'Block inappropriate content and websites',
    icon: 'shield',
  },
  {
    id: 'screenTime',
    title: 'Screen Time',
    description: 'Set daily screen time limits and schedules',
    icon: 'clock',
  },
  {
    id: 'appInstallation',
    title: 'App Installation',
    description: 'Require permission for new app installations',
    icon: 'app.badge',
  },
];

export default function DeviceRestrictionsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [device, setDevice] = useState<ChildDevice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDevice();
  }, [id]);

  const loadDevice = async () => {
    try {
      setLoading(true);
      const devices = await DeviceManagementService.getChildDevices();
      const deviceData = devices.find((d) => d.id === id);
      if (!deviceData) {
        Alert.alert('Error', 'Device not found');
        router.back();
        return;
      }
      setDevice(deviceData);
    } catch (error) {
      console.error('Error loading device:', error);
      Alert.alert('Error', 'Failed to load device restrictions');
    } finally {
      setLoading(false);
    }
  };

  const handleRestrictionToggle = async (restrictionId: keyof ChildDevice['restrictions']) => {
    if (!device) return;

    try {
      setSaving(true);
      const updatedRestrictions = {
        ...device.restrictions,
        [restrictionId]: !device.restrictions[restrictionId],
      };

      await DeviceManagementService.updateDeviceRestrictions(device.id, updatedRestrictions);
      setDevice({
        ...device,
        restrictions: updatedRestrictions,
      });
    } catch (error) {
      console.error('Error updating restriction:', error);
      Alert.alert('Error', 'Failed to update restriction');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ThemedView>
    );
  }

  if (!device) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Device Restrictions',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.deviceInfo}>
          <View style={styles.deviceIcon}>
            <IconSymbol
              name={device.deviceModel.toLowerCase().includes('iphone') ? 'iphone' : 'phone.android'}
              size={24}
              color={Colors.light.primary}
            />
          </View>
          <View style={styles.deviceDetails}>
            <ThemedText style={styles.deviceName}>{device.name}</ThemedText>
            <ThemedText style={styles.deviceModel}>{device.deviceModel}</ThemedText>
          </View>
        </View>

        <View style={styles.restrictionsContainer}>
          {restrictions.map((restriction) => (
            <View key={restriction.id} style={styles.restrictionCard}>
              <View style={styles.restrictionInfo}>
                <View style={styles.restrictionIcon}>
                  <IconSymbol name={restriction.icon} size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.restrictionDetails}>
                  <ThemedText style={styles.restrictionTitle}>{restriction.title}</ThemedText>
                  <ThemedText style={styles.restrictionDescription}>
                    {restriction.description}
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={device.restrictions[restriction.id]}
                onValueChange={() => handleRestrictionToggle(restriction.id)}
                disabled={saving}
                trackColor={{ false: '#767577', true: Colors.light.primary + '50' }}
                thumbColor={device.restrictions[restriction.id] ? Colors.light.primary : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        <View style={styles.note}>
          <IconSymbol name="info.circle" size={20} color="#666" />
          <ThemedText style={styles.noteText}>
            Changes to restrictions will be applied immediately to the device when it's online.
          </ThemedText>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
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
    backgroundColor: Colors.light.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  deviceModel: {
    fontSize: 14,
    color: '#666',
  },
  restrictionsContainer: {
    gap: 16,
  },
  restrictionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restrictionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  restrictionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  restrictionDetails: {
    flex: 1,
  },
  restrictionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  restrictionDescription: {
    fontSize: 14,
    color: '#666',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});
