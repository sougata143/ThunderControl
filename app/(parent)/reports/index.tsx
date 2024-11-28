import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { IconSymbol } from '../../components/ui/IconSymbol';
import Colors from '../../constants/Colors';
import DeviceMonitoringService from '../../services/device-monitoring.service';

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

export default function ReportsScreen() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleReportPress = async (report: ReportType) => {
    try {
      setIsGenerating(true);
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
      Alert.alert('Error', 'Failed to generate report');
    } finally {
      setIsGenerating(false);
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
        report += `Location History:\n`;
        data.locationHistory.forEach((loc: any, index: number) => {
          report += `${index + 1}. ${loc.address || 'Unknown Location'}\n`;
          report += `   Time: ${new Date(loc.timestamp).toLocaleString()}\n`;
        });
        report += `\nSafe Zones:\n`;
        data.safeZones.forEach((zone: any) => {
          report += `- ${zone.name} (Radius: ${zone.radius}m)\n`;
        });
        break;

      case 'communication':
        report += `Call Statistics:\n`;
        const calls = data.calls;
        const incoming = calls.filter((c: any) => c.type === 'incoming').length;
        const outgoing = calls.filter((c: any) => c.type === 'outgoing').length;
        const missed = calls.filter((c: any) => c.type === 'missed').length;
        report += `- Incoming Calls: ${incoming}\n`;
        report += `- Outgoing Calls: ${outgoing}\n`;
        report += `- Missed Calls: ${missed}\n`;

        report += `\nMessage Statistics:\n`;
        const messages = data.messages;
        const sent = messages.filter((m: any) => m.type === 'sent').length;
        const received = messages.filter((m: any) => m.type === 'received').length;
        const blocked = messages.filter((m: any) => m.isBlocked).length;
        report += `- Sent Messages: ${sent}\n`;
        report += `- Received Messages: ${received}\n`;
        report += `- Blocked Messages: ${blocked}\n`;
        break;

      case 'safety':
        report += `Blocked Messages:\n`;
        data.blockedMessages.forEach((msg: any) => {
          report += `- From: ${msg.contact || msg.number}\n`;
          report += `  Preview: ${msg.preview}\n`;
          report += `  Time: ${new Date(msg.timestamp).toLocaleString()}\n\n`;
        });
        break;
    }

    return report;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Reports',
          headerLargeTitle: true,
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Report Types */}
          <View style={styles.grid}>
            {reportTypes.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportCard}
                onPress={() => handleReportPress(report)}
                disabled={isGenerating}
              >
                <View style={[styles.iconContainer, { backgroundColor: report.color + '10' }]}>
                  <IconSymbol name={report.icon} size={32} color={report.color} />
                </View>
                <ThemedText type="defaultSemiBold" style={styles.reportTitle}>
                  {report.title}
                </ThemedText>
                <ThemedText style={styles.reportDescription}>
                  {report.description}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <ThemedText type="title" style={styles.sectionTitle}>Quick Actions</ThemedText>
            <View style={styles.actionsList}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={async () => {
                  try {
                    setIsGenerating(true);
                    const reports = await Promise.all(
                      reportTypes.map(report => 
                        DeviceMonitoringService.generateReport(report.type)
                      )
                    );
                    
                    // Combine all reports
                    const combinedReport = reportTypes.map((report, index) => 
                      formatReportData(report.type, reports[index])
                    ).join('\n\n' + '='.repeat(50) + '\n\n');
                    
                    await Share.share({
                      title: 'ThunderControl Complete Report',
                      message: combinedReport,
                    });
                  } catch (error) {
                    console.error('Error generating complete report:', error);
                    Alert.alert('Error', 'Failed to generate complete report');
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                disabled={isGenerating}
              >
                <IconSymbol name="square.and.arrow.down" size={24} color={Colors.light.tint} />
                <ThemedText style={styles.actionText}>Download All Reports</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  reportCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  reportTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  actionsList: {
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});
