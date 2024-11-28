import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { AuthService } from '../services/auth.service';
import { setUser, setLoading, setError } from '../store/slices/authSlice';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const GuestConversionModal: React.FC<Props> = ({ visible, onClose }) => {
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

  const handleCancel = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>Create Your Account</Text>
          
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

          <View style={styles.buttonGroup}>
            <Button
              title="Create Account"
              onPress={handleConversion}
              containerStyle={styles.buttonContainer}
              raised
            />
            
            <Button
              title="Not Now"
              onPress={handleCancel}
              type="outline"
              containerStyle={styles.buttonContainer}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },
  buttonContainer: {
    marginVertical: 5,
  },
});

export default GuestConversionModal;
