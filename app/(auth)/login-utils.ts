import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/store/hooks';

/**
 * Redirects to the main app if a session is already active when the
 * login screen mounts (e.g. returning from biometric setup).
 */
export function useAppReady() {
  const router = useRouter();
  const session = useAppSelector((s) => s.auth.session);
  useEffect(() => {
    if (session) router.replace('/(tabs)');
  }, [session, router]);
}
