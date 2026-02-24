import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, Redirect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/constants/theme';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/" />;
  }

  const tabBarStyle: any = {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? insets.bottom + 10 : 20,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 0,
    paddingBottom: 0,
    ...Platform.select({
      ios: theme.shadows.lg,
      android: theme.shadows.lg,
      default: theme.shadows.lg,
    }),
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.1,
  };

  const commonScreenOptions = {
    headerShown: false,
    tabBarStyle,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textLight,
    tabBarShowLabel: true,
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    tabBarIconStyle: {
      marginTop: 8,
    }
  };

  // Different tabs based on role
  if (user.role === 'admin') {
    return (
      <Tabs screenOptions={commonScreenOptions as any}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="complaints"
          options={{
            title: 'Complaints',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="assignment" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    );
  }

  if (user.role === 'staff') {
    return (
      <Tabs screenOptions={commonScreenOptions as any}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'My Tasks',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="assignment" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="complaints"
          options={{
            href: null,
          }}
        />
      </Tabs>
    );
  }

  // Student tabs
  return (
    <Tabs screenOptions={commonScreenOptions as any}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'My Complaints',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
