import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, ListItem, Icon, Button, Tab, TabView } from 'react-native-elements';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ParentStackParamList } from '../../navigation/types';
import { CommunicationService, CallRecord, MessageRecord } from '../../services/communication.service';
import { format } from 'date-fns';

type RouteProps = RouteProp<ParentStackParamList, 'Communication'>;

const CommunicationScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const { deviceId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [messageHistory, setMessageHistory] = useState<MessageRecord[]>([]);
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d'>('24h');

  const fetchHistory = async () => {
    try {
      const endTime = Date.now();
      let startTime: number;

      switch (timeFilter) {
        case '24h':
          startTime = endTime - 24 * 60 * 60 * 1000;
          break;
        case '7d':
          startTime = endTime - 7 * 24 * 60 * 60 * 1000;
          break;
        case '30d':
          startTime = endTime - 30 * 24 * 60 * 60 * 1000;
          break;
      }

      const [calls, messages] = await Promise.all([
        CommunicationService.getCallHistory(deviceId, startTime, endTime),
        CommunicationService.getMessageHistory(deviceId, startTime, endTime),
      ]);

      setCallHistory(calls);
      setMessageHistory(messages);
    } catch (error) {
      console.error('Error fetching communication history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
    
    const callUnsubscribe = CommunicationService.subscribeToCallHistory(deviceId, setCallHistory);
    const messageUnsubscribe = CommunicationService.subscribeToMessageHistory(deviceId, setMessageHistory);

    return () => {
      callUnsubscribe();
      messageUnsubscribe();
    };
  }, [deviceId, timeFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const renderCallHistory = () => (
    <Card containerStyle={styles.card}>
      <Card.Title>Call History</Card.Title>
      {callHistory.map((call, index) => (
        <ListItem key={index} bottomDivider>
          <Icon
            name={
              call.callType === 'incoming'
                ? 'call-received'
                : call.callType === 'outgoing'
                ? 'call-made'
                : 'call-missed'
            }
            type="material"
            color={
              call.callType === 'incoming'
                ? '#4CAF50'
                : call.callType === 'outgoing'
                ? '#2196F3'
                : '#F44336'
            }
          />
          <ListItem.Content>
            <ListItem.Title>{call.contactName || call.phoneNumber}</ListItem.Title>
            <ListItem.Subtitle>
              {format(call.timestamp, 'MMM d, h:mm a')}
              {call.callType !== 'missed' && ` • ${formatDuration(call.duration)}`}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      {callHistory.length === 0 && (
        <Text style={styles.emptyText}>No call history found</Text>
      )}
    </Card>
  );

  const renderMessageHistory = () => (
    <Card containerStyle={styles.card}>
      <Card.Title>Message History</Card.Title>
      {messageHistory.map((message, index) => (
        <ListItem key={index} bottomDivider>
          <Icon
            name={message.messageType === 'sent' ? 'send' : 'inbox'}
            type="material"
            color={message.messageType === 'sent' ? '#2196F3' : '#4CAF50'}
          />
          <ListItem.Content>
            <ListItem.Title>{message.contactName || message.phoneNumber}</ListItem.Title>
            <ListItem.Subtitle>
              {format(message.timestamp, 'MMM d, h:mm a')}
            </ListItem.Subtitle>
            {message.messagePreview && (
              <Text style={styles.messagePreview} numberOfLines={1}>
                {message.messagePreview}
              </Text>
            )}
          </ListItem.Content>
        </ListItem>
      ))}
      {messageHistory.length === 0 && (
        <Text style={styles.emptyText}>No message history found</Text>
      )}
    </Card>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.filterContainer}>
        <Button
          title="24h"
          type={timeFilter === '24h' ? 'solid' : 'outline'}
          onPress={() => setTimeFilter('24h')}
          containerStyle={styles.filterButton}
        />
        <Button
          title="7 days"
          type={timeFilter === '7d' ? 'solid' : 'outline'}
          onPress={() => setTimeFilter('7d')}
          containerStyle={styles.filterButton}
        />
        <Button
          title="30 days"
          type={timeFilter === '30d' ? 'solid' : 'outline'}
          onPress={() => setTimeFilter('30d')}
          containerStyle={styles.filterButton}
        />
      </View>

      <Tab
        value={tabIndex}
        onChange={setTabIndex}
        indicatorStyle={styles.tabIndicator}
      >
        <Tab.Item
          title="Calls"
          titleStyle={(active) => ({
            color: active ? '#007AFF' : '#666',
          })}
        />
        <Tab.Item
          title="Messages"
          titleStyle={(active) => ({
            color: active ? '#007AFF' : '#666',
          })}
        />
      </Tab>

      <TabView value={tabIndex} onChange={setTabIndex} animationType="spring">
        <TabView.Item style={styles.tabViewItem}>
          {renderCallHistory()}
        </TabView.Item>
        <TabView.Item style={styles.tabViewItem}>
          {renderMessageHistory()}
        </TabView.Item>
      </TabView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    marginHorizontal: 5,
  },
  tabIndicator: {
    backgroundColor: '#007AFF',
  },
  tabViewItem: {
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  messagePreview: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CommunicationScreen;
