import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { ListItem, Icon, Button, Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { AuthService } from '../../services/auth.service';
import { setUser } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { GuestConversionModal } from '../../components/GuestConversionModal';

const SettingsScreen: React.FC = () => {
  const [showConversionModal, setShowConversionModal] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isGuest = AuthService.isGuest();

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      dispatch(setUser(null));
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: handleSignOut,
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <ListItem>
          <Icon name="account-circle" type="material" />
          <ListItem.Content>
            <ListItem.Title>Account Type</ListItem.Title>
            <ListItem.Subtitle>
              {isGuest ? 'Guest Account' : 'Full Account'}
            </ListItem.Subtitle>
          </ListItem.Content>
          {isGuest && (
            <Button
              title="Upgrade"
              type="outline"
              onPress={() => setShowConversionModal(true)}
            />
          )}
        </ListItem>

        {!isGuest && (
          <ListItem>
            <Icon name="email" type="material" />
            <ListItem.Content>
              <ListItem.Title>Email</ListItem.Title>
              <ListItem.Subtitle>{user?.email}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      </View>

      <View style={styles.section}>
        <ListItem>
          <Icon name="notifications" type="material" />
          <ListItem.Content>
            <ListItem.Title>Notifications</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem>
          <Icon name="security" type="material" />
          <ListItem.Content>
            <ListItem.Title>Privacy & Security</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem>
          <Icon name="help" type="material" />
          <ListItem.Content>
            <ListItem.Title>Help & Support</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem>
          <Icon name="info" type="material" />
          <ListItem.Content>
            <ListItem.Title>About</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>

      <View style={styles.section}>
        <ListItem onPress={confirmSignOut}>
          <Icon name="logout" type="material" color="#FF3B30" />
          <ListItem.Content>
            <ListItem.Title style={styles.signOutText}>Sign Out</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>

      {isGuest && (
        <View style={styles.guestWarning}>
          <Icon
            name="warning"
            type="material"
            color="#FF9500"
            size={20}
            containerStyle={styles.warningIcon}
          />
          <Text style={styles.warningText}>
            Guest account data will be lost after signing out
          </Text>
        </View>
      )}

      <GuestConversionModal
        isVisible={showConversionModal}
        onClose={() => setShowConversionModal(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  signOutText: {
    color: '#FF3B30',
  },
  guestWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF9E6',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  warningIcon: {
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    color: '#996300',
    fontSize: 14,
  },
});

export default SettingsScreen;
