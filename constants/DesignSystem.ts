import { StyleSheet } from 'react-native';

export const Colors = {
  background: {
    primary: '#000000',
    secondary: '#1a1a1a',
    tertiary: '#2e2e2e',
    quaternary: '#404040',
  },
  text: {
    primary: '#ffffff',
    secondary: '#d9d9d9',
    tertiary: '#a0a0a0',
    inverse: '#000000',
  },
  accent: {
    teal: '#ffffff',
    cyan: '#e6e6e6',
    purple: '#cccccc',
    orange: '#b3b3b3',
    yellow: '#999999',
  },
  primary: {
    50: '#ffffff',
    100: '#f4f4f4',
    200: '#eaeaea',
    300: '#d4d4d4',
    400: '#cccccc',
    500: '#ffffff',
    600: '#cccccc',
    700: '#525252',
    800: '#404040',
    900: '#262626',
  },
  secondary: {
    50: '#fafafa',
    100: '#e5e5e5',
    200: '#d4d4d4',
    300: '#a3a3a3',
    400: '#737373',
    500: '#525252',
    600: '#404040',
    700: '#262626',
    800: '#1a1a1a',
    900: '#0d0d0d',
  },
  neutral: {
    50: '#f6f8fa',
    100: '#e1e4e8',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
  },
  success: '#ffffff',
  warning: '#d9d9d9',
  error: '#a0a0a0',
  info: '#808080',
  glass: {
    primary: 'rgba(22, 27, 34, 0.8)',
    secondary: 'rgba(33, 38, 45, 0.9)',
    tertiary: 'rgba(48, 54, 61, 0.7)',
    overlay: 'rgba(13, 17, 23, 0.8)',
  },
};
export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
};
export const Glassmorphism = {
  primary: {
    backgroundColor: Colors.glass.primary,
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondary: {
    backgroundColor: Colors.glass.secondary,
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  tertiary: {
    backgroundColor: Colors.glass.tertiary,
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
};
export const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  cardHover: {
    ...Shadows.lg,
    transform: [{ scale: 1.02 }],
    backgroundColor: Colors.background.tertiary,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  buttonSecondary: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    ...Shadows.sm,
  },
  buttonFloating: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  textH1: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: '700' as const,
    color: Colors.text.primary,
    lineHeight: Typography.sizes['3xl'] * Typography.lineHeights.tight,
  },
  textH2: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: '600' as const,
    color: Colors.text.primary,
    lineHeight: Typography.sizes['2xl'] * Typography.lineHeights.tight,
  },
  textH3: {
    fontSize: Typography.sizes.xl,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    lineHeight: Typography.sizes.xl * Typography.lineHeights.tight,
  },
  textBody: {
    fontSize: Typography.sizes.base,
    fontWeight: '400' as const,
    color: Colors.text.primary,
    lineHeight: Typography.sizes.base * Typography.lineHeights.normal,
  },
  textCaption: {
    fontSize: Typography.sizes.sm,
    fontWeight: '400' as const,
    color: Colors.text.secondary,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
  },
  textLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: '500' as const,
    color: Colors.text.primary,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.tight,
  },
  input: {
    backgroundColor: Colors.background.quaternary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    ...Shadows.sm,
  },
  header: {
    backgroundColor: Colors.background.secondary,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
    ...Shadows.sm,
  },
  section: {
    marginVertical: Spacing.lg,
  },
  
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
});

// Gradient Colors for Dark Theme
export const Gradients = {
  primary: [Colors.primary[500], Colors.primary[700]],
  secondary: [Colors.secondary[500], Colors.secondary[700]],
  accent: [Colors.accent.teal, Colors.accent.cyan],
  success: [Colors.success, Colors.primary[600]],
  warning: [Colors.warning, Colors.accent.orange],
  error: [Colors.error, Colors.accent.orange],
  glass: [Colors.glass.primary, Colors.glass.secondary],
};
export const Icons = {
  add: '➕',
  delete: '🗑️',
  edit: '✏️',
  save: '💾',
  cancel: '✕',
  back: '←',
  check: '✓',
  close: '✕',
  
  // Navigation Icons
  home: '🏠',
  settings: '⚙️',
  profile: '👤',
  
  // Financial Icons
  money: '💸',
  expense: '🧾',
  balance: '💰',
  card: '💳',
  wallet: '👛',
  bank: '🏦',
  
  // Trip Icons
  trip: '✈️',
  location: '📍',
  calendar: '📅',
  clock: '🕐',
  
  // People Icons
  user: '👤',
  users: '👥',
  group: '👨‍👩‍👧‍👦',
  
  // Status Icons
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',
  
  // Action Icons
  settle: '🔁',
  pay: '💳',
  receive: '📥',
  send: '📤',
  
  // Category Icons
  food: '🍽️',
  transport: '🚗',
  hotel: '🏨',
  entertainment: '🎮',
  shopping: '🛍️',
  health: '💊',
  education: '📚',
  other: '📦',
}; 