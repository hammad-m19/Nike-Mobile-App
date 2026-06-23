import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ForgotPasswordScreen() {
  const { navigate, goBack } = useApp();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);

  const handleResetPassword = () => {
    setEmailError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Success - Mock sending reset link
    setIsResetSent(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Floating Top Header Back Button */}
        <View style={styles.header}>
          <Pressable onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>Password Recovery</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Brand header */}
          <View style={styles.brandHeader}>
            <Text style={styles.brandText}>NIKE</Text>
            <View style={styles.dot} />
          </View>

          {!isResetSent ? (
            /* Reset Password Input Form */
            <View style={styles.formContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Reset your password.</Text>
                <Text style={styles.subtitle}>
                  Enter your Nike Member email address and we will send you instructions to reset your account credentials.
                </Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[styles.input, emailError ? styles.inputError : null]}
                  placeholder="email@example.com"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              {/* Reset CTA Button */}
              <Pressable style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Send Reset Link</Text>
              </Pressable>

              {/* Footer link to sign in */}
              <Pressable onPress={() => navigate('Login')} style={styles.backToLoginLink}>
                <Text style={styles.backToLoginText}>Return to Sign In</Text>
              </Pressable>
            </View>
          ) : (
            /* Success confirmation card */
            <View style={styles.successContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="mail-open-outline" size={44} color="#FF5A00" />
              </View>
              
              <Text style={styles.successTitle}>Reset link sent!</Text>
              
              <Text style={styles.successSubtitle}>
                We have sent a verification code and recovery instructions to:
              </Text>
              <Text style={styles.successEmail}>{email}</Text>
              
              <Text style={styles.successNote}>
                Please check your spam or promotions folder if you don't receive it in a few minutes.
              </Text>

              <Pressable style={styles.button} onPress={() => navigate('Login')}>
                <Text style={styles.buttonText}>Back to Sign In</Text>
              </Pressable>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.5,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 40,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 40,
    alignSelf: 'center',
  },
  brandText: {
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -2,
    color: '#111111',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF5A00',
    marginLeft: 2,
  },
  formContainer: {
    width: '100%',
  },
  titleContainer: {
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#8D8D8D',
    lineHeight: 19,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111111',
    fontWeight: '500',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#E01E35',
  },
  errorText: {
    color: '#E01E35',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  button: {
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  backToLoginLink: {
    alignSelf: 'center',
    padding: 10,
  },
  backToLoginText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    textDecorationLine: 'underline',
  },
  // Success Container Styles
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF2EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#8D8D8D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  successEmail: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 20,
  },
  successNote: {
    fontSize: 12,
    color: '#8D8D8D',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
  },
});
