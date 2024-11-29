import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function ReportDetailScreen() {
  const { type } = useLocalSearchParams();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: `${type?.toString().charAt(0).toUpperCase()}${type?.toString().slice(1)} Report`,
        }}
      />
      <ScrollView style={styles.content}>
        <ThemedText style={styles.text}>
          Detailed report for {type} will be displayed here
        </ThemedText>
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
    padding: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
