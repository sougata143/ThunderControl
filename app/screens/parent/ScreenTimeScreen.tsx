import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Icon, ListItem, Slider } from 'react-native-elements';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ParentStackParamList } from '../../navigation/types';
import { MonitoringService } from '../../services/monitoring.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type RouteProps = RouteProp<ParentStackParamList, 'ScreenTime'>;

interface AppLimit {
  appName: string;
  dailyLimit: number;
  usedToday: number;
}

const ScreenTimeScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const { deviceId } = route.params;
  const [appLimits, setAppLimits] = useState<AppLimit[]>([]);
  const [totalDailyLimit, setTotalDailyLimit] = useState(120); // 2 hours default
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchAppLimits();
  }, [deviceId]);

  const fetchAppLimits = async () => {
    try {
      const stats = await MonitoringService.getDeviceStats(deviceId, 1);
      const screenTime = stats.screenTime || {};
      const limits = Object.entries(screenTime).map(([appName, data]: [string, any]) => ({
        appName,
        dailyLimit: data.dailyLimit || 60, // 1 hour default
        usedToday: data.duration || 0,
      }));
      setAppLimits(limits.sort((a, b) => b.usedToday - a.usedToday));
    } catch (error) {
      console.error('Error fetching app limits:', error);
    }
  };

  const updateAppLimit = async (appName: string, newLimit: number) => {
    try {
      const updatedLimits = appLimits.map(app =>
        app.appName === appName ? { ...app, dailyLimit: newLimit } : app
      );
      setAppLimits(updatedLimits);
      
      // Update in Firebase
      await MonitoringService.updateScreenTimeLimit(deviceId, appName, newLimit);
      Alert.alert('Success', `Updated daily limit for ${appName}`);
    } catch (error) {
      console.error('Error updating app limit:', error);
      Alert.alert('Error', 'Failed to update app limit');
    }
  };

  const updateTotalLimit = async (newLimit: number) => {
    try {
      setTotalDailyLimit(newLimit);
      await MonitoringService.updateTotalScreenTimeLimit(deviceId, newLimit);
      Alert.alert('Success', 'Updated total daily screen time limit');
    } catch (error) {
      console.error('Error updating total limit:', error);
      Alert.alert('Error', 'Failed to update total screen time limit');
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const calculateProgress = (used: number, limit: number): number => {
    return Math.min((used / (limit * 60)) * 100, 100);
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.totalLimitCard}>
        <Card.Title>Total Daily Screen Time</Card.Title>
        <View style={styles.totalLimitContainer}>
          <Text style={styles.limitText}>
            {formatDuration(totalDailyLimit)}
          </Text>
          <Slider
            value={totalDailyLimit}
            onValueChange={setTotalDailyLimit}
            onSlidingComplete={updateTotalLimit}
            minimumValue={30}
            maximumValue={720}
            step={30}
            style={styles.slider}
            thumbStyle={styles.sliderThumb}
            trackStyle={styles.sliderTrack}
          />
        </View>
      </Card>

      <Card containerStyle={styles.appsCard}>
        <Card.Title>App Limits</Card.Title>
        {appLimits.map((app, index) => (
          <ListItem key={index} bottomDivider>
            <Icon name="android" type="material" />
            <ListItem.Content>
              <ListItem.Title>{app.appName}</ListItem.Title>
              <View style={styles.progressContainer}>
                <View style={[
                  styles.progressBar,
                  {
                    width: `${calculateProgress(app.usedToday, app.dailyLimit)}%`,
                    backgroundColor: calculateProgress(app.usedToday, app.dailyLimit) >= 100
                      ? '#FF6B6B'
                      : '#4CAF50',
                  },
                ]} />
              </View>
              <ListItem.Subtitle>
                Used: {formatDuration(Math.floor(app.usedToday / 60))} / Limit: {formatDuration(app.dailyLimit)}
              </ListItem.Subtitle>
            </ListItem.Content>
            <Button
              title="Edit"
              type="clear"
              onPress={() => {
                Alert.prompt(
                  'Set Daily Limit',
                  `Enter daily limit in minutes for ${app.appName}`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Save',
                      onPress: (value) => {
                        const minutes = parseInt(value || '60', 10);
                        if (!isNaN(minutes) && minutes > 0) {
                          updateAppLimit(app.appName, minutes);
                        }
                      },
                    },
                  ],
                  'plain-text',
                  app.dailyLimit.toString(),
                );
              }}
            />
          </ListItem>
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  totalLimitCard: {
    borderRadius: 10,
    marginBottom: 10,
  },
  totalLimitContainer: {
    alignItems: 'center',
  },
  limitText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#007AFF',
  },
  sliderTrack: {
    height: 4,
  },
  appsCard: {
    borderRadius: 10,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginVertical: 8,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default ScreenTimeScreen;
