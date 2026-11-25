import { Redirect } from 'expo-router';
import { useAppSelector } from '@/store/hooks';

/**
 * App entry. Routes to the auth flow when there is no session, or to the
 * main tabs when the user is signed in.
 */
export default function Index() {
  const session = useAppSelector((s) => s.auth.session);
  return <Redirect href={session ? '/(tabs)' : '/(auth)/onboarding'} />;
}
