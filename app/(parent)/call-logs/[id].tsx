import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { RootState } from '@/store';
import Colors from '@/constants/Colors';

export default function CallDetailScreen() {
  const { id } = useLocalSearchParams();
  const call = useSelector((state: RootState) =>
    state.communication.callLogs.find((c) => c.id === id)
  );

  if (!call) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Call Details' }} />
        <View style={styles.centerContent}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={Colors.light.error} />
          <ThemedText style={styles.errorText}>Call not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return <IconSymbol name="phone.arrow.down.left" size={32} color={Colors.light.success} />;
      case 'outgoing':
        return <IconSymbol name="phone.arrow.up.right" size={32} color={Colors.light.primary} />;
      case 'missed':
        return <IconSymbol name="phone.down" size={32} color={Colors.light.error} />;
      default:
        return <IconSymbol name="phone" size={32} color={Colors.light.text} />;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Call Details',
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <IconSymbol name="square.and.arrow.up" size={24} color={Colors.light.tint} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>{getCallIcon(call.type)}</View>
          <ThemedText style={styles.name}>{call.name || 'Unknown'}</ThemedText>
          <ThemedText style={styles.number}>{call.number}</ThemedText>
          <ThemedText style={styles.type}>
            {call.type.charAt(0).toUpperCase() + call.type.slice(1)} Call
          </ThemedText>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <IconSymbol name="clock" size={20} color="#666" />
            <View style={styles.detailTexts}>
              <ThemedText style={styles.detailLabel}>Time</ThemedText>
              <ThemedText style={styles.detailValue}>
                {new Date(call.timestamp).toLocaleString()}
              </ThemedText>
            </View>
          </View>

          <View style={styles.detailRow}>
            <IconSymbol name="hourglass" size={20} color="#666" />
            <View style={styles.detailTexts}>
              <ThemedText style={styles.detailLabel}>Duration</ThemedText>
              <ThemedText style={styles.detailValue}>{call.duration}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="phone" size={24} color={Colors.light.primary} />
            <ThemedText style={styles.actionText}>Call</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="message" size={24} color={Colors.light.primary} />
            <ThemedText style={styles.actionText}>Message</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="person.crop.circle.badge.plus" size={24} color={Colors.light.primary} />
            <ThemedText style={styles.actionText}>Add Contact</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  number: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  type: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailTexts: {
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: Colors.light.primary,
    marginTop: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.error,
    marginTop: 16,
    textAlign: 'center',
  },
  headerButton: {
    marginRight: 16,
  },
});
