import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import useCommunicationMonitoring from '@/hooks/useCommunicationMonitoring';
import FilterBar from '@/components/communication/FilterBar';
import SearchBar from '@/components/communication/SearchBar';
import TimeRangeSelector from '@/components/communication/TimeRangeSelector';
import CommunicationFilters from '@/utils/communication-filters';
import type { CallFilter, TimeRange } from '@/utils/communication-filters';
import PermissionsService from '@/services/permissions.service';
import Colors from '@/constants/Colors';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'incoming', label: 'Incoming' },
  { value: 'outgoing', label: 'Outgoing' },
  { value: 'missed', label: 'Missed' },
];

const CallLogsScreen: React.FC = () => {
  const router = useRouter();
  const { callLogs, isLoading, error, refreshData } = useCommunicationMonitoring();
  const [filter, setFilter] = useState<CallFilter>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const permissions = await PermissionsService.checkCommunicationPermissions();
    if (!permissions.callLogs) {
      const result = await PermissionsService.requestCommunicationPermissions();
      setHasPermission(result.callLogs);
    } else {
      setHasPermission(true);
    }
  };

  const renderCallIcon = useCallback((type: string) => {
    switch (type) {
      case 'incoming':
        return <IconSymbol name="phone.arrow.down.left" size={24} color={Colors.light.success} />;
      case 'outgoing':
        return <IconSymbol name="phone.arrow.up.right" size={24} color={Colors.light.primary} />;
      case 'missed':
        return <IconSymbol name="phone.down" size={24} color={Colors.light.error} />;
      default:
        return <IconSymbol name="phone" size={24} color={Colors.light.text} />;
    }
  }, []);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.callItem}
      onPress={() => router.push(`/call-logs/${item.id}`)}
    >
      <View style={styles.iconContainer}>
        {renderCallIcon(item.type)}
      </View>
      <View style={styles.callInfo}>
        <ThemedText style={styles.name}>{item.name || 'Unknown'}</ThemedText>
        <ThemedText style={styles.number}>{item.number}</ThemedText>
        <View style={styles.callDetails}>
          <ThemedText style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.duration}>{item.duration}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  ), [renderCallIcon, router]);

  if (!hasPermission) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Call Logs' }} />
        <View style={styles.centerContent}>
          <IconSymbol name="lock" size={48} color={Colors.light.error} />
          <ThemedText style={styles.errorText}>
            Permission to access call logs is required
          </ThemedText>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={checkPermissions}
          >
            <ThemedText style={styles.permissionButtonText}>
              Grant Permission
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Call Logs' }} />
        <View style={styles.centerContent}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={Colors.light.error} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const filteredCalls = CommunicationFilters.filterCalls(callLogs, filter, timeRange, searchQuery);
  const sortedCalls = CommunicationFilters.sortCommunicationItems(filteredCalls, 'desc');

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Call Logs',
          headerRight: () => (
            isLoading ? (
              <ActivityIndicator color={Colors.light.tint} style={styles.headerLoader} />
            ) : null
          ),
        }}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search calls..."
      />

      <FilterBar
        options={filterOptions}
        selectedFilter={filter}
        onFilterChange={(value) => setFilter(value as CallFilter)}
      />

      <TimeRangeSelector
        selectedRange={timeRange}
        onRangeChange={setTimeRange}
      />
      
      {sortedCalls.length === 0 ? (
        <View style={styles.centerContent}>
          <IconSymbol name="phone.slash" size={48} color={Colors.light.text} />
          <ThemedText style={styles.emptyText}>No call logs found</ThemedText>
        </View>
      ) : (
        <FlatList
          data={sortedCalls}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshData}
              tintColor={Colors.light.tint}
            />
          }
        />
      )}
    </ThemedView>
  );
};

export default CallLogsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  callItem: {
    flexDirection: 'row',
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  callInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  number: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  callDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.error,
    marginTop: 16,
    textAlign: 'center',
  },
  headerLoader: {
    marginRight: 16,
  },
  permissionButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
