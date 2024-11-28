import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { IconSymbol } from '../../components/ui/IconSymbol';
import Colors from '../../constants/Colors';
import DeviceMonitoringService, { CallLogEntry } from '../../services/device-monitoring.service';

type CallLog = {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  timestamp: string;
};

export default function CallLogsScreen() {
  const [calls, setCalls] = useState<CallLogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing' | 'missed'>('all');

  useEffect(() => {
    loadCallLogs();
    // Refresh call logs every minute
    const interval = setInterval(loadCallLogs, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadCallLogs = async () => {
    try {
      const logs = await DeviceMonitoringService.getCallLogs();
      setCalls(logs);
    } catch (error) {
      console.error('Error loading call logs:', error);
    }
  };

  const getCallIcon = (type: CallLogEntry['type']) => {
    switch (type) {
      case 'incoming':
        return 'arrow.down.left';
      case 'outgoing':
        return 'arrow.up.right';
      case 'missed':
        return 'xmark';
      default:
        return 'phone';
    }
  };

  const getCallColor = (type: CallLogEntry['type']) => {
    switch (type) {
      case 'incoming':
        return '#4CAF50';
      case 'outgoing':
        return '#2196F3';
      case 'missed':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const filteredCalls = filter === 'all' 
    ? calls 
    : calls.filter(call => call.type === filter);

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Call Logs',
          headerLargeTitle: true,
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.filterActive]}
              onPress={() => setFilter('all')}
            >
              <ThemedText style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                All
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'incoming' && styles.filterActive]}
              onPress={() => setFilter('incoming')}
            >
              <ThemedText style={[styles.filterText, filter === 'incoming' && styles.filterTextActive]}>
                Incoming
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'outgoing' && styles.filterActive]}
              onPress={() => setFilter('outgoing')}
            >
              <ThemedText style={[styles.filterText, filter === 'outgoing' && styles.filterTextActive]}>
                Outgoing
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'missed' && styles.filterActive]}
              onPress={() => setFilter('missed')}
            >
              <ThemedText style={[styles.filterText, filter === 'missed' && styles.filterTextActive]}>
                Missed
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Call List */}
          <View style={styles.callList}>
            {filteredCalls.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="phone.fill" size={48} color="#ccc" />
                <ThemedText style={styles.emptyStateText}>No call logs found</ThemedText>
              </View>
            ) : (
              filteredCalls.map((call) => (
                <View key={call.id} style={styles.callItem}>
                  <View style={[styles.callIcon, { backgroundColor: getCallColor(call.type) + '20' }]}>
                    <IconSymbol 
                      name={getCallIcon(call.type)} 
                      size={24} 
                      color={getCallColor(call.type)} 
                    />
                  </View>
                  <View style={styles.callInfo}>
                    <ThemedText type="defaultSemiBold">{call.name || 'Unknown'}</ThemedText>
                    <ThemedText style={styles.callNumber}>{call.number}</ThemedText>
                    <View style={styles.callDetails}>
                      <ThemedText style={styles.callTimestamp}>
                        {new Date(call.timestamp).toLocaleString()}
                      </ThemedText>
                      {call.type !== 'missed' && (
                        <ThemedText style={styles.callDuration}>{call.duration}</ThemedText>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  filterActive: {
    backgroundColor: Colors.light.tint,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  callList: {
    paddingHorizontal: 16,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  callInfo: {
    flex: 1,
  },
  callNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  callDetails: {
    flexDirection: 'row',
    marginTop: 4,
  },
  callTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  callDuration: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
