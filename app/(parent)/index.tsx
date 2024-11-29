import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

const features = [
  {
    id: 'location',
    title: 'Location Tracking',
    icon: '📍',
    route: 'location',
    description: 'Track device location and set safe zones'
  },
  {
    id: 'calls',
    title: 'Call Logs',
    icon: '📞',
    route: 'call-logs',
    description: 'Monitor call history and contacts'
  },
  {
    id: 'messages',
    title: 'Messages',
    icon: '💬',
    route: 'messages',
    description: 'View and filter text messages'
  },
  {
    id: 'devices',
    title: 'Devices',
    icon: '📱',
    route: 'devices',
    description: 'Manage connected devices'
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: '📊',
    route: 'reports',
    description: 'View detailed activity reports'
  },
  {
    id: 'restrictions',
    title: 'Restrictions',
    icon: '🔒',
    route: 'device-restrictions',
    description: 'Set app and content restrictions'
  }
];

export default function ParentDashboard() {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(`/(parent)/${route}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Dashboard</ThemedText>
          <ThemedText style={styles.subtitle}>Monitor and manage connected devices</ThemedText>
        </View>
        <View style={styles.grid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.card}
              onPress={() => handleNavigation(feature.route)}
            >
              <View style={styles.iconContainer}>
                <ThemedText style={styles.icon}>{feature.icon}</ThemedText>
              </View>
              <ThemedText style={styles.cardTitle}>{feature.title}</ThemedText>
              <ThemedText style={styles.cardDescription}>{feature.description}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
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
  iconContainer: {
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});
