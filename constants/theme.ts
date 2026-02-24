export const theme = {
  colors: {
    primary: '#1E1E2D', // Dark navy
    primaryBackground: '#EAEEFF',
    accent: '#FF9D42', // Orange for accents
    secondary: '#9D9DFF', // Soft purple
    background: '#F5F7FF', // Main background
    pink: '#FDE2F3', // Baby Pink
    blue: '#E3F2FD', // Light Blue
    surface: '#FFFFFF',
    surfaceDark: '#EDEEF7',

    // Status colors (pill-style mapping)
    pending: '#FF9D42',
    inProgress: '#9D9DFF',
    resolved: '#4ADE80',

    // Role colors
    student: '#9D9DFF',
    admin: '#FF9D42',
    staff: '#6366F1',

    // Text
    text: '#1E1E2D',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',

    // Semantic
    success: '#4ADE80',
    error: '#F87171',
    warning: '#FB923C',
    info: '#60A5FA',

    // UI Elements
    border: '#E5E7EB',
    divider: '#F3F4F6',
    shadow: '#000000',
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 18,
    lg: 26,
    xl: 34,
    xxl: 50,
  },

  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    full: 9999,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 30,
    xxxl: 38,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '800' as const, // Thicker bold for the reference style
  },

  shadows: {
    sm: {
      shadowColor: '#1E1E2D',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#1E1E2D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },
    lg: {
      shadowColor: '#1E1E2D',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
