import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Share, Platform } from 'react-native';
import { Text, Card, Button, Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { database } from '../../config/firebase';
import { ref, get } from 'firebase/database';

interface MonitoringData {
  deviceId: string;
  deviceName: string;
  screenTime: number;
  batteryLevel: number;
  lastSeen: string;
  location?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

const MonitoringReportScreen: React.FC = () => {
  const [reportData, setReportData] = useState<MonitoringData[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    fetchMonitoringData();
  }, []);

  const fetchMonitoringData = async () => {
    try {
      const devicesRef = ref(database, `users/${userId}/devices`);
      const snapshot = await get(devicesRef);
      
      if (snapshot.exists()) {
        const devices = snapshot.val();
        const monitoringData: MonitoringData[] = [];
        
        for (const [deviceId, device] of Object.entries(devices)) {
          const deviceData = device as any;
          monitoringData.push({
            deviceId,
            deviceName: deviceData.deviceName || 'Unknown Device',
            screenTime: deviceData.screenTimeToday || 0,
            batteryLevel: deviceData.batteryLevel || 0,
            lastSeen: deviceData.lastSeen || 'Never',
            location: deviceData.location || undefined,
          });
        }
        
        setReportData(monitoringData);
      }
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    let reportContent = `ThunderControl Monitoring Report - ${timestamp}\n\n`;

    reportData.forEach((device) => {
      reportContent += `Device: ${device.deviceName} (${device.deviceId})\n`;
      reportContent += `Screen Time: ${Math.round(device.screenTime / 60)} minutes\n`;
      reportContent += `Battery Level: ${device.batteryLevel}%\n`;
      reportContent += `Last Seen: ${device.lastSeen}\n`;
      
      if (device.location) {
        reportContent += `Location: ${device.location.latitude}, ${device.location.longitude}\n`;
        reportContent += `Location Time: ${device.location.timestamp}\n`;
      }
      
      reportContent += '\n---\n\n';
    });

    return reportContent;
  };

  const exportReport = async () => {
    try {
      const report = generateReport();
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `monitoring-report-${timestamp}.txt`;

      if (Platform.OS === 'web') {
        // Web export
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
      } else {
        // Mobile export
        const filePath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(filePath, report);
        
        if (Platform.OS === 'ios') {
          await Sharing.shareAsync(filePath);
        } else {
          await Share.share({
            title: 'Monitoring Report',
            message: report,
          });
        }
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.headerCard}>
        <Text style={styles.headerTitle}>Monitoring Report</Text>
        <Text style={styles.headerSubtitle}>
          View and export device monitoring data
        </Text>
        <Button
          title="Export Report"
          icon={
            <Icon
              name="download"
              type="font-awesome"
              color="white"
              size={15}
              style={{ marginRight: 10 }}
            />
          }
          onPress={exportReport}
          containerStyle={styles.exportButton}
        />
      </Card>

      {loading ? (
        <Card>
          <Text>Loading report data...</Text>
        </Card>
      ) : reportData.length === 0 ? (
        <Card>
          <Text>No devices found to generate report.</Text>
        </Card>
      ) : (
        reportData.map((device) => (
          <Card key={device.deviceId} containerStyle={styles.deviceCard}>
            <Text style={styles.deviceName}>{device.deviceName}</Text>
            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Icon
                  name="screen-smartphone"
                  type="simple-line-icon"
                  size={20}
                  color="#007AFF"
                />
                <Text style={styles.statLabel}>Screen Time</Text>
                <Text style={styles.statValue}>
                  {formatDuration(Math.round(device.screenTime / 60))}
                </Text>
              </View>
              <View style={styles.stat}>
                <Icon
                  name="battery"
                  type="font-awesome"
                  size={20}
                  color="#007AFF"
                />
                <Text style={styles.statLabel}>Battery</Text>
                <Text style={styles.statValue}>{device.batteryLevel}%</Text>
              </View>
            </View>
            <Text style={styles.lastSeen}>Last seen: {device.lastSeen}</Text>
            {device.location && (
              <Text style={styles.location}>
                Location: {device.location.latitude.toFixed(6)},
                {device.location.longitude.toFixed(6)}
              </Text>
            )}
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    borderRadius: 10,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  exportButton: {
    marginTop: 10,
  },
  deviceCard: {
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3,
  },
  lastSeen: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default MonitoringReportScreen;
