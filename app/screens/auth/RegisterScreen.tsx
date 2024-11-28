import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Input, Button, Text, CheckBox } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../services/auth.service';
import { setUser, setLoading, setError } from '../../store/slices/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { RootState } from '../../store';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
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
    } catch (error: any) {
      dispatch(setError(error.message));
      Alert.alert('Error', error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text h3 style={styles.title}>
            Create Account
          </Text>
          <Text style={styles.subtitle}>
            Join ThunderControl to protect your family's digital life
          </Text>

          <Input
            placeholder="Email"
            leftIcon={{ type: 'material', name: 'email' }}
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            placeholder="Password"
            leftIcon={{ type: 'material', name: 'lock' }}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />

          <Input
            placeholder="Confirm Password"
            leftIcon={{ type: 'material', name: 'lock' }}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry
          />

          <CheckBox
            title="I am a parent"
            checked={isParent}
            onPress={() => setIsParent(!isParent)}
            containerStyle={styles.checkboxContainer}
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            containerStyle={styles.buttonContainer}
          />

          <Button
            title="Already have an account? Login"
            type="clear"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default RegisterScreen;
