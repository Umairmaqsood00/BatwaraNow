import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/DesignSystem';
import React from 'react';
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function GradientButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: GradientButtonProps) {
  const getGradientColors = (): [string, string] => {
    switch (variant) {
      case 'secondary':
        return ['#4CAF50', '#388E3C'];
      case 'success':
        return ['#4CAF50', '#388E3C'];
      case 'warning':
        return ['#FF9800', '#F57C00'];
      case 'error':
        return ['#F44336', '#D32F2F'];
      default:
        return ['#2196F3', '#1976D2'];
    }
  };

  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const baseStyle = styles.button;
    const sizeStyle = styles[size];
    const disabledStyle = disabled ? styles.disabled : {};
    
    return [baseStyle, sizeStyle, disabledStyle, style];
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseTextStyle = styles.text;
    const sizeTextStyle = styles[`${size}Text`];
    const disabledTextStyle = disabled ? styles.disabledText : {};
    
    return [baseTextStyle, sizeTextStyle, disabledTextStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={styles.gradient}>
        {loading ? (
          <ActivityIndicator color={Colors.text.inverse} size="small" />
        ) : (
          <>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.md,
  } as ViewStyle,
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  } as ViewStyle,
  text: {
    color: Colors.text.inverse,
    fontWeight: '600' as const,
    textAlign: 'center',
  } as TextStyle,
  icon: {
    fontSize: Typography.sizes.lg,
    marginRight: Spacing.sm,
  } as TextStyle,
  // Size variants
  small: {
    paddingVertical: Spacing.sm,
  } as ViewStyle,
  medium: {
    paddingVertical: Spacing.md,
  } as ViewStyle,
  large: {
    paddingVertical: Spacing.lg,
  } as ViewStyle,
  smallText: {
    fontSize: Typography.sizes.sm,
  } as TextStyle,
  mediumText: {
    fontSize: Typography.sizes.base,
  } as TextStyle,
  largeText: {
    fontSize: Typography.sizes.lg,
  } as TextStyle,
  // State variants
  disabled: {
    opacity: 0.6,
  } as ViewStyle,
  disabledText: {
    color: Colors.text.tertiary,
  } as TextStyle,
}); 