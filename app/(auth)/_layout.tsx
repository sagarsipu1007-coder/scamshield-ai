import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="email-verify" />
      <Stack.Screen name="mfa-setup" />
      <Stack.Screen name="mfa-verify" />
      <Stack.Screen name="recovery-codes" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="biometric" />
    </Stack>
  );
}
