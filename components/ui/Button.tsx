import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({ title, onPress, variant = 'primary', loading, disabled, fullWidth }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        fullWidth && styles.fullWidth,
        (pressed || loading) && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : theme.colors.surface} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'primary' && styles.textPrimary,
            variant === 'secondary' && styles.textSecondary,
            variant === 'outline' && styles.textOutline,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  textPrimary: {
    color: theme.colors.surface,
  },
  textSecondary: {
    color: theme.colors.surface,
  },
  textOutline: {
    color: theme.colors.primary,
  },
});
