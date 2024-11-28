import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { setUser, setLoading } from '../../store/slices/authSlice';
import { setDeviceInfo } from '../../store/slices/deviceSlice';
import { Input, Button } from 'react-native-elements';
import AuthService from '../services/auth.service';
import GoogleAuthService from '../services/google-auth.service';
import { Ionicons } from '@expo/vector-icons';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      dispatch(setLoading(true));
      const user = await AuthService.signIn(email, password);
      dispatch(setUser(user));
      dispatch(setDeviceInfo({ isParent: true }));
      router.replace('/(parent)/dashboard');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleAuthService.signIn();
      Alert.alert('Notice', 'Google Sign-In is currently disabled');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  const handleGuestLogin = () => {
    try {
      const guestUser = AuthService.signInAsGuest();
      dispatch(setUser(guestUser));
      dispatch(setDeviceInfo({ isParent: true }));
      router.replace('/(parent)/dashboard');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in as guest');
    }
  };

  const handleSignUp = () => {
    router.push('/(auth)/register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome to ThunderControl</Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          leftIcon={<Ionicons name="mail-outline" size={24} color="#666" />}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={<Ionicons name="lock-closed-outline" size={24} color="#666" />}
        />
        <Button
          title="Sign In"
          onPress={handleEmailSignIn}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
        />
        <Button
          title="Sign in with Google"
          onPress={handleGoogleSignIn}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.googleButton}
          icon={<Ionicons name="logo-google" size={24} color="white" style={styles.googleIcon} />}
        />
        <Button
          title="Continue as Guest"
          onPress={handleGuestLogin}
          type="outline"
          containerStyle={styles.buttonContainer}
        />
        <TouchableOpacity onPress={handleSignUp} style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 5,
    width: '100%',
  },
  button: {
    backgroundColor: '#2089dc',
    borderRadius: 5,
    padding: 12,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    borderRadius: 5,
    padding: 12,
  },
  googleIcon: {
    marginRight: 10,
  },
  signUpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  signUpText: {
    color: '#2089dc',
    fontSize: 16,
  },
});

export default LoginScreen;
