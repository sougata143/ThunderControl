import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import DeviceManagementService from '@/services/device-management.service';

type DeviceType = {
  id: string;
  name: string;
  icon: string;
  platform: 'ios' | 'android';
};

const deviceTypes: DeviceType[] = [
  { id: '1', name: 'iPhone', icon: 'iphone', platform: 'ios' },
  { id: '2', name: 'iPad', icon: 'ipad', platform: 'ios' },
  { id: '3', name: 'Android Phone', icon: 'phone.android', platform: 'android' },
  { id: '4', name: 'Android Tablet', icon: 'tablet.android', platform: 'android' },
];

export default function AddDeviceScreen() {
  const router = useRouter();
  const [deviceName, setDeviceName] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddDevice = async () => {
    if (!deviceName.trim()) {
      Alert.alert('Error', 'Please enter a device name');
      return;
    }
    if (!selectedType) {
      Alert.alert('Error', 'Please select a device type');
      return;
    }

    const selectedDevice = deviceTypes.find(type => type.id === selectedType);
    if (!selectedDevice) {
      Alert.alert('Error', 'Invalid device type selected');
      return;
    }

    try {
      setLoading(true);
      await DeviceManagementService.addChildDevice({
        name: deviceName.trim(),
        deviceModel: selectedDevice.name,
        platform: selectedDevice.platform,
      });
      Alert.alert(
        'Success',
        'Device added successfully! You can now install ThunderControl on the device.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(parent)/devices'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add device. Please try again.');
      console.error('Add device error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Add Device',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Device Information</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Enter a name for the device and select its type
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Device Name</ThemedText>
          <TextInput
            style={styles.input}
            value={deviceName}
            onChangeText={setDeviceName}
            placeholder="Enter device name (e.g. John's iPhone)"
            placeholderTextColor="#999"
            autoFocus
            returnKeyType="next"
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Device Type</ThemedText>
          <View style={styles.deviceTypes}>
            {deviceTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.deviceType,
                  selectedType === type.id && styles.selectedType,
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <IconSymbol
                  name={type.icon}
                  size={32}
                  color={selectedType === type.id ? Colors.light.primary : '#666'}
                />
                <ThemedText
                  style={[
                    styles.deviceTypeName,
                    selectedType === type.id && styles.selectedTypeName,
                  ]}
                >
                  {type.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addButton, loading && styles.disabledButton]}
          onPress={handleAddDevice}
          disabled={loading || !deviceName.trim() || !selectedType}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <IconSymbol name="plus.circle.fill" size={20} color="#fff" style={styles.addButtonIcon} />
              <ThemedText style={styles.addButtonText}>Add Device</ThemedText>
            </>
          )}
        </TouchableOpacity>
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
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  deviceTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deviceType: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedType: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },
  deviceTypeName: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selectedTypeName: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonIcon: {
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
