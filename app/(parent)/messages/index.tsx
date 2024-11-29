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
import type { MessageFilter, TimeRange } from '@/utils/communication-filters';
import PermissionsService from '@/services/permissions.service';
import Colors from '@/constants/Colors';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'sent', label: 'Sent' },
  { value: 'received', label: 'Received' },
];

const MessagesScreen: React.FC = () => {
  const router = useRouter();
  const { messages, isLoading, error, refreshData } = useCommunicationMonitoring();
  const [filter, setFilter] = useState<MessageFilter>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const permissions = await PermissionsService.checkCommunicationPermissions();
    if (!permissions.messages) {
      const result = await PermissionsService.requestCommunicationPermissions();
      setHasPermission(result.messages);
    } else {
      setHasPermission(true);
    }
  };

  const renderMessageIcon = useCallback((type: string) => {
    switch (type) {
      case 'sent':
        return <IconSymbol name="message.fill" size={24} color={Colors.light.primary} />;
      case 'received':
        return <IconSymbol name="message" size={24} color={Colors.light.success} />;
      default:
        return <IconSymbol name="message.circle" size={24} color={Colors.light.text} />;
    }
  }, []);

  const renderItem = useCallback(({ item }) => {
    if (!item) return null;
    
    return (
      <TouchableOpacity
        style={styles.messageItem}
        onPress={() => router.push(`/messages/${item.id}`)}
      >
        <View style={styles.iconContainer}>
          {renderMessageIcon(item.type)}
        </View>
        <View style={styles.messageInfo}>
          <ThemedText style={styles.number}>{item.number}</ThemedText>
          <ThemedText style={styles.preview} numberOfLines={2}>
            {item.preview}
          </ThemedText>
          <ThemedText style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString()}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  }, [renderMessageIcon, router]);

  if (!hasPermission) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Messages' }} />
        <View style={styles.centerContent}>
          <IconSymbol name="lock" size={48} color={Colors.light.error} />
          <ThemedText style={styles.errorText}>
            Permission to access messages is required
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
        <Stack.Screen options={{ title: 'Messages' }} />
        <View style={styles.centerContent}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={Colors.light.error} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const filteredMessages = CommunicationFilters.filterMessages(messages, filter, timeRange, searchQuery);
  const sortedMessages = CommunicationFilters.sortCommunicationItems(filteredMessages, 'desc');

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Messages',
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
        placeholder="Search messages..."
      />

      <FilterBar
        options={filterOptions}
        selectedFilter={filter}
        onFilterChange={(value) => setFilter(value as MessageFilter)}
      />

      <TimeRangeSelector
        selectedRange={timeRange}
        onRangeChange={setTimeRange}
      />

      {sortedMessages.length === 0 ? (
        <View style={styles.centerContent}>
          <IconSymbol name="message.slash" size={48} color={Colors.light.text} />
          <ThemedText style={styles.emptyText}>No messages found</ThemedText>
        </View>
      ) : (
        <FlatList
          data={sortedMessages}
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

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  messageItem: {
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
  messageInfo: {
    flex: 1,
  },
  number: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    color: Colors.light.error,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    color: Colors.light.text,
  },
  permissionButton: {
    marginTop: 16,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerLoader: {
    marginRight: 16,
  },
});
