import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, Share, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import DeviceMonitoringService from '@/services/device-monitoring.service';

type ReportType = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  type: 'activity' | 'location' | 'communication' | 'safety';
};

const reportTypes: ReportType[] = [
  {
    id: 'activity',
    title: 'Activity Report',
    description: 'App usage, screen time, and digital habits',
    icon: 'chart.bar.fill',
    color: '#4CAF50',
    type: 'activity',
  },
  {
    id: 'location',
    title: 'Location Report',
    description: 'Movement patterns and visited places',
    icon: 'location.fill',
    color: '#2196F3',
    type: 'location',
  },
  {
    id: 'communication',
    title: 'Communication Report',
    description: 'Calls, messages, and contact patterns',
    icon: 'message.fill',
    color: '#9C27B0',
    type: 'communication',
  },
  {
    id: 'safety',
    title: 'Safety Report',
    description: 'Alerts, blocked content, and security events',
    icon: 'shield.fill',
    color: '#F44336',
    type: 'safety',
  },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function ReportsScreen() {
  const router = useRouter();
  const [generating, setGenerating] = useState<string | null>(null);

  const handleReportPress = async (report: ReportType) => {
    try {
      setGenerating(report.id);
      const reportData = await DeviceMonitoringService.generateReport(report.type);
      
      // Format report data as text
      const reportText = formatReportData(report.type, reportData);
      
      // Share report
      await Share.share({
        title: `${report.title} - ThunderControl`,
        message: reportText,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report. Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  const formatReportData = (type: string, data: any): string => {
    const timestamp = new Date().toLocaleString();
    let report = `ThunderControl ${type.charAt(0).toUpperCase() + type.slice(1)} Report\n`;
    report += `Generated: ${timestamp}\n\n`;

    switch (type) {
      case 'activity':
        report += `Device Stats:\n`;
        report += `- Battery Level: ${(data.deviceStats.batteryLevel * 100).toFixed(1)}%\n`;
        report += `- Storage Used: ${formatBytes(data.deviceStats.storageUsed)}\n`;
        report += `- Total Storage: ${formatBytes(data.deviceStats.totalStorage)}\n`;
        break;

      case 'location':
        report += `Current Location:\n`;
        report += `- Latitude: ${data.currentLocation.latitude}\n`;
        report += `- Longitude: ${data.currentLocation.longitude}\n\n`;
        
        report += `Location History (Last ${data.locationHistory.length} locations):\n`;
        data.locationHistory.forEach((loc: any, index: number) => {
          report += `${index + 1}. ${loc.address || 'Unknown Location'}\n`;
          report += `   Time: ${new Date(loc.timestamp).toLocaleString()}\n`;
        });
        
        report += `\nSafe Zones (${data.safeZones.length}):\n`;
        data.safeZones.forEach((zone: any) => {
          report += `- ${zone.name} (Radius: ${zone.radius}m)\n`;
        });
        break;

      case 'communication':
        report += `Communication Summary:\n`;
        report += `- Total Calls: ${data.stats.totalCalls}\n`;
        report += `- Total Messages: ${data.stats.totalMessages}\n`;
        report += `- Blocked Messages: ${data.stats.blockedMessages}\n\n`;

        report += `Recent Calls:\n`;
        data.callLogs.slice(0, 5).forEach((call: any) => {
          report += `- ${call.name} (${call.number})\n`;
          report += `  ${call.type} call, Duration: ${call.duration}\n`;
          report += `  Time: ${new Date(call.timestamp).toLocaleString()}\n`;
        });
        break;

      case 'safety':
        report += `Safety Summary:\n`;
        report += `- Total Alerts: ${data.alerts.length}\n`;
        report += `- Blocked Content: ${data.blockedContent.length}\n`;
        report += `- Security Events: ${data.securityEvents.length}\n`;
        break;

      default:
        report += `No data available for this report type.`;
    }

    return report;
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Reports',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Device Reports</ThemedText>
          <ThemedText style={styles.subtitle}>
            Generate and share detailed reports about device usage and activity
          </ThemedText>
        </View>

        <View style={styles.grid}>
          {reportTypes.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={[styles.card, { borderColor: report.color + '40' }]}
              onPress={() => handleReportPress(report)}
              disabled={generating !== null}
            >
              <View style={[styles.iconContainer, { backgroundColor: report.color + '20' }]}>
                <IconSymbol
                  name={report.icon}
                  size={32}
                  color={report.color}
                />
              </View>
              <ThemedText style={styles.cardTitle}>{report.title}</ThemedText>
              <ThemedText style={styles.cardDescription}>{report.description}</ThemedText>
              {generating === report.id && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator color={report.color} />
                </View>
              )}
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
  content: {
    flex: 1,
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
    color: '#666',
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
    borderWidth: 1,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});
