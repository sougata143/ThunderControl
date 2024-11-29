import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import ThemedText from '@/components/ThemedText';
import Colors from '@/constants/Colors';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  options: FilterOption[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterBar({
  options,
  selectedFilter,
  onFilterChange,
}: FilterBarProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.filterButton,
            selectedFilter === option.value && styles.filterButtonActive,
          ]}
          onPress={() => onFilterChange(option.value)}
        >
          <ThemedText
            style={[
              styles.filterButtonText,
              selectedFilter === option.value && styles.filterButtonTextActive,
            ]}
          >
            {option.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
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
    backgroundColor: '#f5f5f5',
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary + '15',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
});
