import { Tabs } from 'expo-router';
import { Home, ScanLine, Shield, Activity, User } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useAppSelector } from '@/store/hooks';
import { Redirect } from 'expo-router';

export default function TabsLayout() {
  const theme = useTheme();
  const session = useAppSelector((s) => s.auth.session);

  if (!session) return <Redirect href="/(auth)/onboarding" />;

  const { colors, spacing, typography } = theme;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingHorizontal: spacing.xs,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamilyMedium,
          fontSize: typography.sizes.xs,
          marginTop: -2,
        },
        tabBarItemStyle: { paddingVertical: spacing.xs },
        tabBarIconStyle: { marginBottom: -2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <ScanLine size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="protection"
        options={{
          title: 'Protection',
          tabBarIcon: ({ color }) => <Shield size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Activity size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={22} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
