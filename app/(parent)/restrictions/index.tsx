import { StyleSheet, ScrollView, View, Switch, TouchableOpacity } from 'react-native';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useState } from 'react';

type Restriction = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export default function RestrictionsScreen() {
  const [restrictions, setRestrictions] = useState<Restriction[]>([
    {
      id: '1',
      title: 'App Usage Limits',
      description: 'Set daily time limits for app usage',
      enabled: false,
    },
    {
      id: '2',
      title: 'Content Filtering',
      description: 'Block inappropriate content and websites',
      enabled: true,
    },
    {
      id: '3',
      title: 'App Installation Control',
      description: 'Require approval for new app installations',
      enabled: true,
    },
    {
      id: '4',
      title: 'Safe Search',
      description: 'Enable safe search on browsers and search engines',
      enabled: true,
    },
    {
      id: '5',
      title: 'Screen Time Schedule',
      description: 'Set allowed hours for device usage',
      enabled: false,
    },
    {
      id: '6',
      title: 'Communication Control',
      description: 'Monitor and filter communications',
      enabled: true,
    },
  ]);

  const toggleRestriction = (id: string) => {
    setRestrictions(prevRestrictions =>
      prevRestrictions.map(restriction =>
        restriction.id === id
          ? { ...restriction, enabled: !restriction.enabled }
          : restriction
      )
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Restrictions</ThemedText>
          <ThemedText style={styles.subtitle}>
            Control device access and content
          </ThemedText>
        </View>

        <View style={styles.restrictionsList}>
          {restrictions.map(restriction => (
            <View key={restriction.id} style={styles.restrictionItem}>
              <View style={styles.restrictionInfo}>
                <ThemedText style={styles.restrictionTitle}>
                  {restriction.title}
                </ThemedText>
                <ThemedText style={styles.restrictionDescription}>
                  {restriction.description}
                </ThemedText>
              </View>
              <Switch
                value={restriction.enabled}
                onValueChange={() => toggleRestriction(restriction.id)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={restriction.enabled ? '#2196F3' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.applyButton}>
          <ThemedText style={styles.applyButtonText}>Apply Changes</ThemedText>
        </TouchableOpacity>
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
  restrictionsList: {
    marginTop: 16,
  },
  restrictionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  restrictionInfo: {
    flex: 1,
    marginRight: 16,
  },
  restrictionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  restrictionDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  applyButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
