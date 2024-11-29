import React from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedText from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import Colors from '@/constants/Colors';
import type { Device as DeviceType } from '@/types/device';

interface DeviceProps {
  device: DeviceType;
  onPress?: () => void;
}

const Device: React.FC<DeviceProps> = ({ device, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconSymbol 
          name={device.status === 'online' ? 'iphone' : 'iphone.slash'} 
          size={24} 
          color={device.status === 'online' ? Colors.light.success : Colors.light.error} 
        />
      </View>
      <View style={styles.infoContainer}>
        <ThemedText style={styles.name}>{device.name}</ThemedText>
        <ThemedText style={styles.model}>{device.deviceModel}</ThemedText>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: device.status === 'online' ? Colors.light.success : Colors.light.error }]} />
          <ThemedText style={styles.status}>{device.status}</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
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
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  model: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
});

export default Device;
