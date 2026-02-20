import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { useAlert } from '@/template';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const handleLogout = () => {
    showAlert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
        return theme.colors.admin;
      case 'staff':
        return theme.colors.staff;
      case 'student':
        return theme.colors.student;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={[styles.avatarContainer, { backgroundColor: `${getRoleColor()}20` }]}>
          <MaterialIcons
            name={user?.role === 'admin' ? 'admin-panel-settings' : 
                  user?.role === 'staff' ? 'work' : 'school'}
            size={48}
            color={getRoleColor()}
          />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <View style={[styles.roleBadge, { backgroundColor: `${getRoleColor()}20` }]}>
          <Text style={[styles.roleText, { color: getRoleColor() }]}>
            {user?.role?.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <InfoItem icon="email" label="Email" value={user?.email || ''} />
        {user?.department && (
          <InfoItem icon="business" label="Department" value={user.department} />
        )}
        {user?.rollNumber && (
          <InfoItem icon="badge" label="Roll Number" value={user.rollNumber} />
        )}
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <MenuItem
          icon="notifications"
          title="Notifications"
          subtitle="Manage notification preferences"
          onPress={() => showAlert('Coming Soon', 'Notification settings will be available soon')}
        />
        <MenuItem
          icon="help"
          title="Help & Support"
          subtitle="Get help and contact support"
          onPress={() => showAlert('Help', 'For support, contact admin@campus.edu')}
        />
        <MenuItem
          icon="info"
          title="About"
          subtitle="App version and information"
          onPress={() => showAlert('About', 'Smart Campus v1.0.0\nComplaint Management System')}
        />
      </View>

      <View style={styles.actions}>
        <Button title="Logout" onPress={handleLogout} variant="outline" fullWidth />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Mock Data Mode - Local Storage</Text>
      </View>
    </ScrollView>
  );
}

function InfoItem({ icon, label, value }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <MaterialIcons name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>
        <MaterialIcons name={icon} size={24} color={theme.colors.textSecondary} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={theme.colors.textLight} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  roleText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
  },
  infoSection: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: `${theme.colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  menuSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  menuItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  menuIcon: {
    marginRight: theme.spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  actions: {
    padding: theme.spacing.lg,
  },
  footer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
});
