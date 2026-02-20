export const theme = {
  colors: {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    secondary: '#f59e0b',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceDark: '#f1f5f9',
    
    // Status colors
    pending: '#f59e0b',
    inProgress: '#3b82f6',
    resolved: '#10b981',
    
    // Role colors
    student: '#8b5cf6',
    admin: '#ef4444',
    staff: '#06b6d4',
    
    // Text
    text: '#0f172a',
    textSecondary: '#64748b',
    textLight: '#94a3b8',
    
    // Semantic
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // UI Elements
    border: '#e2e8f0',
    divider: '#e2e8f0',
    shadow: '#000000',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export type Theme = typeof theme;
