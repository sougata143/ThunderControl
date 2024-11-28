import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { setUser, setLoading } from '../store/slices/authSlice';
import { setDeviceInfo } from '../store/slices/deviceSlice';

export default function LoginScreen() {
  const dispatch = useDispatch();

  const handleGuestLogin = async () => {
    try {
      dispatch(setLoading(true));
      
      // Create a guest user
      const guestUser = {
        id: 'guest_' + Date.now(),
        email: null,
        isGuest: true,
        role: 'parent'
      };

      // Set device info for guest
      const deviceInfo = {
        deviceId: 'device_' + Date.now(),
        deviceName: 'Guest Device',
        deviceType: 'mobile',
        osVersion: 'unknown',
        batteryLevel: 100,
        isOnline: true,
        isParent: true
      };

      // Update Redux state
      await Promise.all([
        dispatch(setUser(guestUser)),
        dispatch(setDeviceInfo(deviceInfo))
      ]);

      // Navigate to parent dashboard
      router.replace('/parent/dashboard');
    } catch (error) {
      console.error('Guest login error:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ThunderControl</Text>
      <Text style={styles.subtitle}>Parental Control & Monitoring</Text>
      
      {/* Regular login options will go here */}
      <View style={styles.loginOptions}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign in with Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Guest login option */}
      <TouchableOpacity 
        style={[styles.button, styles.guestButton]} 
        onPress={handleGuestLogin}
      >
        <Text style={[styles.buttonText, styles.guestButtonText]}>
          Continue as Guest
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.registerLink}
        onPress={handleRegister}
      >
        <Text style={styles.registerText}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  loginOptions: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: '#E5E5EA',
  },
  guestButtonText: {
    color: '#007AFF',
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
