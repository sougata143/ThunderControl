import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { IconSymbol } from '../../components/ui/IconSymbol';
import Colors from '../../constants/Colors';
import DeviceMonitoringService, { MessageEntry } from '../../services/device-monitoring.service';

export default function MessagesScreen() {
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'blocked'>('all');

  useEffect(() => {
    loadMessages();
    // Refresh messages every 30 seconds
    const interval = setInterval(loadMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const msgs = await DeviceMonitoringService.getMessages();
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleToggleBlocked = async (messageId: string) => {
    try {
      await DeviceMonitoringService.toggleMessageBlocked(messageId);
      loadMessages(); // Reload messages to reflect changes
    } catch (error) {
      console.error('Error toggling message blocked status:', error);
      Alert.alert('Error', 'Failed to update message status');
    }
  };

  const getFilteredMessages = () => {
    switch (filter) {
      case 'sent':
        return messages.filter(msg => msg.type === 'sent');
      case 'received':
        return messages.filter(msg => msg.type === 'received');
      case 'blocked':
        return messages.filter(msg => msg.isBlocked);
      default:
        return messages;
    }
  };

  const filteredMessages = getFilteredMessages();

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Messages',
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
              style={[styles.filterButton, filter === 'sent' && styles.filterActive]}
              onPress={() => setFilter('sent')}
            >
              <ThemedText style={[styles.filterText, filter === 'sent' && styles.filterTextActive]}>
                Sent
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'received' && styles.filterActive]}
              onPress={() => setFilter('received')}
            >
              <ThemedText style={[styles.filterText, filter === 'received' && styles.filterTextActive]}>
                Received
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'blocked' && styles.filterActive]}
              onPress={() => setFilter('blocked')}
            >
              <ThemedText style={[styles.filterText, filter === 'blocked' && styles.filterTextActive]}>
                Blocked
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Message List */}
          <View style={styles.messageList}>
            {filteredMessages.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="message.fill" size={48} color="#ccc" />
                <ThemedText style={styles.emptyStateText}>No messages found</ThemedText>
              </View>
            ) : (
              filteredMessages.map((message) => (
                <View key={message.id} style={styles.messageItem}>
                  <View style={[
                    styles.messageIcon,
                    { backgroundColor: message.isBlocked ? '#F44336' + '20' : Colors.light.tint + '20' }
                  ]}>
                    <IconSymbol 
                      name={message.isBlocked ? 'xmark.circle.fill' : message.type === 'sent' ? 'arrow.up.circle.fill' : 'arrow.down.circle.fill'} 
                      size={24} 
                      color={message.isBlocked ? '#F44336' : Colors.light.tint} 
                    />
                  </View>
                  <View style={styles.messageInfo}>
                    <View style={styles.messageHeader}>
                      <ThemedText type="defaultSemiBold">{message.contact || "Unknown"}</ThemedText>
                      <ThemedText style={styles.messageTimestamp}>
                        {new Date(message.timestamp).toLocaleString()}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.messageNumber}>{message.number}</ThemedText>
                    <ThemedText style={styles.messagePreview} numberOfLines={2}>
                      {message.preview}
                    </ThemedText>
                  </View>
                  <TouchableOpacity 
                    style={styles.blockButton}
                    onPress={() => handleToggleBlocked(message.id)}
                  >
                    <IconSymbol 
                      name={message.isBlocked ? 'lock.fill' : 'lock.open.fill'} 
                      size={20} 
                      color={message.isBlocked ? '#F44336' : '#666'} 
                    />
                  </TouchableOpacity>
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
  messageList: {
    paddingHorizontal: 16,
  },
  messageItem: {
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
  messageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageInfo: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  messagePreview: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  blockButton: {
    padding: 8,
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
