import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { setUser, setLoading } from '../../store/slices/authSlice';
import { setDeviceInfo } from '../../store/slices/deviceSlice';
import { Input, Button } from 'react-native-elements';
import AuthService from '../services/auth.service';
import GoogleAuthService from '../services/google-auth.service';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen: React.FC = () => {
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
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      dispatch(setLoading(true));
      const user = await GoogleAuthService.signIn();
      if (user) {
        dispatch(setUser(user));
        dispatch(setDeviceInfo({ isParent: true }));
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
    } finally {
      dispatch(setLoading(false));
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
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.guestButton}
          titleStyle={styles.guestButtonText}
          icon={<Ionicons name="person-outline" size={24} color="#0a7ea4" style={styles.guestIcon} />}
        />
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    padding: 15,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 15,
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0a7ea4',
    borderRadius: 8,
    padding: 15,
  },
  googleIcon: {
    marginRight: 10,
  },
  guestIcon: {
    marginRight: 10,
  },
  guestButtonText: {
    color: '#0a7ea4',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#666',
  },
  signUpLink: {
    fontSize: 16,
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
