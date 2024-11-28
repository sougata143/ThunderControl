import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Input, Button, Text, Divider } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { AuthService } from '../../services/auth.service';
import { setUser, setLoading, setError } from '../../store/slices/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      dispatch(setLoading(true));
      const user = await AuthService.signIn(email, password);
      dispatch(setUser(user));
    } catch (error: any) {
      dispatch(setError(error.message));
      Alert.alert('Error', error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGuestLogin = async () => {
    try {
      dispatch(setLoading(true));
      const user = await AuthService.signInAsGuest();
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
      <View style={styles.formContainer}>
        <Text h3 style={styles.title}>
          ThunderControl
        </Text>
        <Text style={styles.subtitle}>
          Monitor and protect your child's digital experience
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

        <Button
          title="Login"
          onPress={handleLogin}
          containerStyle={styles.buttonContainer}
        />

        <Button
          title="Create Account"
          type="outline"
          onPress={() => navigation.navigate('Register')}
          containerStyle={styles.buttonContainer}
        />

        <Button
          title="Forgot Password?"
          type="clear"
          onPress={() => navigation.navigate('ForgotPassword')}
        />

        <Divider style={styles.divider} />

        <Button
          title="Continue as Guest"
          type="outline"
          icon={{
            name: 'person-outline',
            type: 'material',
            color: '#666',
          }}
          titleStyle={styles.guestButtonTitle}
          buttonStyle={styles.guestButton}
          containerStyle={styles.buttonContainer}
          onPress={handleGuestLogin}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
  buttonContainer: {
    marginVertical: 5,
  },
  divider: {
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  guestButton: {
    borderColor: '#666',
  },
  guestButtonTitle: {
    color: '#666',
  },
});

export default LoginScreen;
