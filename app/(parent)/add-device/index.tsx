import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { IconSymbol } from '../../components/ui/IconSymbol';
import Colors from '../../constants/Colors';

type DeviceType = {
  id: string;
  name: string;
  icon: string;
};

const deviceTypes: DeviceType[] = [
  { id: '1', name: 'iPhone', icon: 'iphone' },
  { id: '2', name: 'iPad', icon: 'ipad' },
  { id: '3', name: 'Android Phone', icon: 'phone.android' },
  { id: '4', name: 'Android Tablet', icon: 'tablet.android' },
];

export default function AddDeviceScreen() {
  const router = useRouter();
  const [deviceName, setDeviceName] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleAddDevice = () => {
    if (!deviceName.trim()) {
      Alert.alert('Error', 'Please enter a device name');
      return;
    }
    if (!selectedType) {
      Alert.alert('Error', 'Please select a device type');
      return;
    }

    // Here we would typically make an API call to add the device
    console.log('Adding device:', { name: deviceName, type: selectedType });
    Alert.alert(
      'Success',
      'Device added successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Add New Device',
          headerLargeTitle: true,
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <ThemedText type="title" style={styles.sectionTitle}>Device Name</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter device name (e.g. Sarah's iPhone)"
              value={deviceName}
              onChangeText={setDeviceName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.section}>
            <ThemedText type="title" style={styles.sectionTitle}>Device Type</ThemedText>
            <View style={styles.deviceTypes}>
              {deviceTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.deviceTypeCard,
                    selectedType === type.id && styles.selectedCard,
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <View style={[
                    styles.deviceIcon,
                    selectedType === type.id && styles.selectedIcon,
                  ]}>
                    <IconSymbol
                      name={type.icon}
                      size={32}
                      color={selectedType === type.id ? '#fff' : Colors.light.tint}
                    />
                  </View>
                  <ThemedText
                    style={[
                      styles.deviceTypeName,
                      selectedType === type.id && styles.selectedText,
                    ]}
                  >
                    {type.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="title" style={styles.sectionTitle}>Setup Instructions</ThemedText>
            <View style={styles.instructionCard}>
              <View style={styles.instructionStep}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>1</ThemedText>
                </View>
                <ThemedText style={styles.instructionText}>
                  Install ThunderControl Child App on the device you want to monitor
                </ThemedText>
              </View>
              <View style={styles.instructionStep}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>2</ThemedText>
                </View>
                <ThemedText style={styles.instructionText}>
                  Open the app and enter the following pairing code when prompted:
                </ThemedText>
              </View>
              <View style={styles.pairingCode}>
                <ThemedText style={styles.pairingCodeText}>ABC123</ThemedText>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.addButton,
              (!deviceName || !selectedType) && styles.disabledButton,
            ]}
            onPress={handleAddDevice}
            disabled={!deviceName || !selectedType}
          >
            <IconSymbol name="plus.circle.fill" size={24} color="#fff" />
            <ThemedText style={styles.addButtonText}>Add Device</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  deviceTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  deviceTypeCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: Colors.light.tint,
  },
  deviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.tint + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedIcon: {
    backgroundColor: Colors.light.tint,
  },
  deviceTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedText: {
    color: Colors.light.tint,
  },
  instructionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  pairingCode: {
    backgroundColor: Colors.light.tint + '10',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  pairingCodeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.tint,
    letterSpacing: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.tint,
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
