import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import DeviceManagementService from '@/services/device-management.service';

export type CallLogEntry = {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: number; // in seconds
  timestamp: string;
  deviceId: string;
};

const mockCallLogs: CallLogEntry[] = [
  {
    id: '1',
    name: 'Mom',
    number: '+1234567890',
    type: 'incoming',
    duration: 120,
    timestamp: new Date().toISOString(),
    deviceId: '1',
  },
  {
    id: '2',
    name: 'Unknown',
    number: '+0987654321',
    type: 'missed',
    duration: 0,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    deviceId: '1',
  },
  {
    id: '3',
    name: 'Friend',
    number: '+1122334455',
    type: 'outgoing',
    duration: 300,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    deviceId: '1',
  },
];

export default function CallLogsScreen() {
  const [calls, setCalls] = useState<CallLogEntry[]>(mockCallLogs);
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing' | 'missed'>('all');
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load devices to map device IDs to names
      const deviceList = await DeviceManagementService.getChildDevices();
      const deviceMap = deviceList.reduce((acc, device) => {
        acc[device.id] = device.name;
        return acc;
      }, {} as Record<string, string>);
      setDevices(deviceMap);

      // In a real implementation, we would load actual call logs here
      // const logs = await CallLogsService.getLogs();
      // setCalls(logs);
      
      // Using mock data for now
      setCalls(mockCallLogs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCallIcon = (type: CallLogEntry['type']) => {
    switch (type) {
      case 'incoming':
        return 'arrow.down.left.circle.fill';
      case 'outgoing':
        return 'arrow.up.right.circle.fill';
      case 'missed':
        return 'xmark.circle.fill';
      default:
        return 'phone.circle.fill';
    }
  };

  const getCallColor = (type: CallLogEntry['type']) => {
    switch (type) {
      case 'incoming':
        return '#34c759';
      case 'outgoing':
        return Colors.light.primary;
      case 'missed':
        return '#ff3b30';
      default:
        return '#666';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'No duration';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredCalls = calls.filter(
    (call) => filter === 'all' || call.type === filter
  );

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
          title: 'Call Logs',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <View style={styles.filterContainer}>
        {(['all', 'incoming', 'outgoing', 'missed'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filter === type && styles.filterButtonActive]}
            onPress={() => setFilter(type)}
          >
            <ThemedText
              style={[
                styles.filterButtonText,
                filter === type && styles.filterButtonTextActive,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {filteredCalls.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="phone" size={64} color={Colors.light.primary} />
            <ThemedText style={styles.emptyStateTitle}>No Call Logs</ThemedText>
            <ThemedText style={styles.emptyStateText}>
              There are no call logs matching your filter
            </ThemedText>
          </View>
        ) : (
          filteredCalls.map((call) => (
            <View key={call.id} style={styles.callItem}>
              <View style={styles.callIcon}>
                <IconSymbol
                  name={getCallIcon(call.type)}
                  size={24}
                  color={getCallColor(call.type)}
                />
              </View>
              <View style={styles.callInfo}>
                <ThemedText style={styles.callName}>{call.name || 'Unknown'}</ThemedText>
                <ThemedText style={styles.callNumber}>{call.number}</ThemedText>
                <View style={styles.callDetails}>
                  <ThemedText style={styles.callTime}>
                    {new Date(call.timestamp).toLocaleString()}
                  </ThemedText>
                  <ThemedText style={styles.callDuration}>
                    {formatDuration(call.duration)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.deviceName}>
                  {devices[call.deviceId] || 'Unknown Device'}
                </ThemedText>
              </View>
            </View>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary + '10',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  callItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  callIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  callNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  callDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  callTime: {
    fontSize: 12,
    color: '#666',
  },
  callDuration: {
    fontSize: 12,
    color: '#666',
  },
  deviceName: {
    fontSize: 12,
    color: Colors.light.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
