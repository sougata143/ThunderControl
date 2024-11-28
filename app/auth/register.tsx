import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../services/auth.service';
import { setUser, setLoading, setError } from '../store/slices/authSlice';
import { router } from 'expo-router';
import { RootState } from '../store';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isParent, setIsParent] = useState(true);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      dispatch(setLoading(true));
      let user;
      
      // Check if converting from guest account
      if (currentUser?.isAnonymous) {
        user = await AuthService.convertGuestToFull(email, password, isParent);
      } else {
        user = await AuthService.signUp(email, password, isParent);
      }
      
      dispatch(setUser(user));
      
      // Navigate to the appropriate dashboard
      if (isParent) {
        router.replace('/parent/dashboard');
      } else {
        router.replace('/child/home');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      Alert.alert('Error', error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={[styles.title, { fontSize: 28, fontWeight: 'bold' }]}>
            Create Account
          </Text>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setIsParent(!isParent)}
          >
            <View style={[styles.checkbox, isParent && styles.checkboxChecked]}>
              {isParent && <Ionicons name="checkmark" size={18} color="white" />}
            </View>
            <Text style={styles.checkboxLabel}>Register as Parent</Text>
          </TouchableOpacity>
          <Button
            title="Sign Up"
            onPress={handleRegister}
            containerStyle={styles.buttonContainer}
          />
          <Button
            title="Back to Login"
            type="clear"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2089dc',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2089dc',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#86939e',
  },
});
