import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
          router.replace('/login');
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
      default:
        return theme.colors.primary;
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.blue, theme.colors.pink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        style={{ flex: 1, paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={[styles.avatarContainer, { backgroundColor: `${getRoleColor()}20` }]}>
              <MaterialIcons
                name={user?.role === 'admin' ? 'admin-panel-settings' :
                  user?.role === 'manager' ? 'engineering' : 'work'}
                size={48}
                color={getRoleColor()}
              />
            </View>
            <Text style={styles.name}>{user?.name}</Text>
            <View style={[styles.roleBadge, { backgroundColor: getRoleColor() }]}>
              <Text style={styles.roleText}>
                {user?.role?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardSection}>
          <View style={styles.infoCard}>
            <InfoItem icon="email" label="Email" value={user?.email || ''} />
            <View style={styles.divider} />
            {user?.department && (
              <InfoItem icon="business" label="Department" value={user.department} />
            )}
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="notifications"
              title="Alerts"
              onPress={() => showAlert('Coming Soon', 'Settings check is empty')}
            />
            <MenuItem
              icon="help"
              title="Support"
              onPress={() => showAlert('Help', 'Contact maintenance team')}
            />
            <MenuItem
              icon="info"
              title="App Info"
              isLast
              onPress={() => showAlert('About', 'Version 1.0.0')}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color={theme.colors.error} />
            <Text style={styles.logoutText}>Sign Out from Task</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function InfoItem({ icon, label, value }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <MaterialIcons name={icon} size={18} color={theme.colors.primary} />
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
  onPress,
  isLast,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed, !isLast && styles.menuBorder]}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>
        <MaterialIcons name={icon} size={22} color={theme.colors.textSecondary} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <MaterialIcons name="chevron-right" size={20} color={theme.colors.textLight} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  profileSection: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: 22,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
  },
  roleText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
    letterSpacing: 1,
  },
  cardSection: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(157, 157, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginHorizontal: theme.spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
  },
  menuSection: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xs,
    ...theme.shadows.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuIcon: {
    marginRight: theme.spacing.md,
  },
  menuTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    flex: 1,
  },
  actions: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderRadius: theme.borderRadius.xl,
  },
  logoutText: {
    color: theme.colors.error,
    fontWeight: theme.fontWeight.bold,
  },
});
