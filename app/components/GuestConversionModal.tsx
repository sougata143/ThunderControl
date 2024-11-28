import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text as RNText,
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { AuthService } from '../services/auth.service';
import { setUser, setLoading, setError } from '../store/slices/authSlice';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const GuestConversionModal: React.FC<Props> = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();

  const handleConversion = async () => {
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
      const user = await AuthService.convertGuestToFull(email, password, true);
      dispatch(setUser(user));
      Alert.alert('Success', 'Your account has been created successfully');
      onClose();
    } catch (error: any) {
      dispatch(setError(error.message));
      Alert.alert('Error', error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <RNText style={styles.title}>
            Create Your Account
          </RNText>
          
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={<Icon name="mail" type="feather" size={24} color="#666" />}
          />
          
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Icon name="lock" type="feather" size={24} color="#666" />}
          />
          
          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon={<Icon name="lock" type="feather" size={24} color="#666" />}
          />

          <Button
            title="Create Account"
            onPress={handleConversion}
            containerStyle={styles.buttonContainer}
            raised
          />
          
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <RNText style={styles.cancelText}>Cancel</RNText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  buttonContainer: {
    marginTop: 10,
  },
  cancelButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
});

export default GuestConversionModal;
