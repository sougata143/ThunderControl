import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import DeviceManagementService from '@/services/device-management.service';

export type MessageEntry = {
  id: string;
  type: 'sent' | 'received';
  contact: {
    name: string;
    number: string;
  };
  content: string;
  timestamp: string;
  isBlocked: boolean;
  deviceId: string;
};

// Mock data for demonstration
const mockMessages: MessageEntry[] = [
  {
    id: '1',
    type: 'received',
    contact: {
      name: 'Mom',
      number: '+1234567890',
    },
    content: 'How was school today?',
    timestamp: new Date().toISOString(),
    isBlocked: false,
    deviceId: '1',
  },
  {
    id: '2',
    type: 'sent',
    contact: {
      name: 'Mom',
      number: '+1234567890',
    },
    content: 'It was great! Got an A on my math test.',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    isBlocked: false,
    deviceId: '1',
  },
  {
    id: '3',
    type: 'received',
    contact: {
      name: 'Unknown',
      number: '+0987654321',
    },
    content: 'Hey, check out this cool website!',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isBlocked: true,
    deviceId: '1',
  },
];

export default function MessagesScreen() {
  const [messages, setMessages] = useState<MessageEntry[]>(mockMessages);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'blocked'>('all');
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

      // In a real implementation, we would load actual messages here
      // const msgs = await MessagesService.getMessages();
      // setMessages(msgs);
      
      // Using mock data for now
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlocked = async (messageId: string) => {
    try {
      const updatedMessages = messages.map(msg =>
        msg.id === messageId ? { ...msg, isBlocked: !msg.isBlocked } : msg
      );
      setMessages(updatedMessages);
      
      // In a real implementation, we would update the server here
      // await MessagesService.toggleMessageBlocked(messageId);
      
      Alert.alert(
        'Success',
        'Message status updated successfully'
      );
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

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ThemedView>
    );
  }

  const filteredMessages = getFilteredMessages();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Messages',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <View style={styles.filterContainer}>
        {(['all', 'sent', 'received', 'blocked'] as const).map((type) => (
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
        {filteredMessages.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="message" size={64} color={Colors.light.primary} />
            <ThemedText style={styles.emptyStateTitle}>No Messages</ThemedText>
            <ThemedText style={styles.emptyStateText}>
              There are no messages matching your filter
            </ThemedText>
          </View>
        ) : (
          filteredMessages.map((message) => (
            <View key={message.id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <View style={styles.contactInfo}>
                  <ThemedText style={styles.contactName}>
                    {message.contact.name || 'Unknown'}
                  </ThemedText>
                  <ThemedText style={styles.contactNumber}>
                    {message.contact.number}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={[
                    styles.blockButton,
                    message.isBlocked && styles.unblockButton,
                  ]}
                  onPress={() => handleToggleBlocked(message.id)}
                >
                  <IconSymbol
                    name={message.isBlocked ? 'shield.slash' : 'shield'}
                    size={16}
                    color={message.isBlocked ? '#ff3b30' : Colors.light.primary}
                  />
                  <ThemedText
                    style={[
                      styles.blockButtonText,
                      message.isBlocked && styles.unblockButtonText,
                    ]}
                  >
                    {message.isBlocked ? 'Unblock' : 'Block'}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.messageContent}>
                <View
                  style={[
                    styles.messageBubble,
                    message.type === 'sent'
                      ? styles.sentBubble
                      : styles.receivedBubble,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.messageText,
                      message.type === 'sent'
                        ? styles.sentText
                        : styles.receivedText,
                    ]}
                  >
                    {message.content}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.messageFooter}>
                <ThemedText style={styles.timestamp}>
                  {new Date(message.timestamp).toLocaleString()}
                </ThemedText>
                <ThemedText style={styles.deviceName}>
                  {devices[message.deviceId] || 'Unknown Device'}
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
    padding: 16,
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
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
  blockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.light.primary + '10',
  },
  unblockButton: {
    backgroundColor: '#ff3b3010',
  },
  blockButtonText: {
    fontSize: 12,
    marginLeft: 4,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  unblockButtonText: {
    color: '#ff3b30',
  },
  messageContent: {
    marginBottom: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  sentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#000',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
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
