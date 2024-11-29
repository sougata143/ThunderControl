import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ThemedText from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import { TimeRange } from '@/utils/communication-filters';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const timeRangeOptions: { value: TimeRange; label: string; icon: string }[] = [
  { value: 'today', label: 'Today', icon: 'clock' },
  { value: 'week', label: 'Week', icon: 'calendar' },
  { value: 'month', label: 'Month', icon: 'calendar.badge.clock' },
  { value: 'all', label: 'All Time', icon: 'infinity' },
];

export default function TimeRangeSelector({
  selectedRange,
  onRangeChange,
}: TimeRangeSelectorProps) {
  return (
    <View style={styles.container}>
      {timeRangeOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.rangeButton,
            selectedRange === option.value && styles.rangeButtonActive,
          ]}
          onPress={() => onRangeChange(option.value)}
        >
          <IconSymbol
            name={option.icon}
            size={16}
            color={selectedRange === option.value ? Colors.light.primary : '#666'}
          />
          <ThemedText
            style={[
              styles.rangeButtonText,
              selectedRange === option.value && styles.rangeButtonTextActive,
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
  rangeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
  },
  rangeButtonActive: {
    backgroundColor: Colors.light.primary + '15',
  },
  rangeButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  rangeButtonTextActive: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
});
