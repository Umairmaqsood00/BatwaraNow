import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
    Typography,
} from "../../constants/DesignSystem";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function GradientButton({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) {
  const getButtonStyle = () => {
    const baseStyle = styles.button;
    const sizeStyle = styles[size];
    const disabledStyle = disabled ? styles.disabled : {};

    return [baseStyle, sizeStyle, disabledStyle, style];
  };

  const getTextStyle = () => {
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
    overflow: "hidden",
    ...Shadows.md,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  text: {
    color: Colors.text.inverse,
    fontWeight: "600",
    textAlign: "center",
  },
  icon: {
    fontSize: Typography.sizes.lg,
    marginRight: Spacing.sm,
  },
  // Size variants
  small: {
    paddingVertical: Spacing.sm,
  },
  medium: {
    paddingVertical: Spacing.md,
  },
  large: {
    paddingVertical: Spacing.lg,
  },
  smallText: {
    fontSize: Typography.sizes.sm,
  },
  mediumText: {
    fontSize: Typography.sizes.base,
  },
  largeText: {
    fontSize: Typography.sizes.lg,
  },
  // State variants
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    color: Colors.text.tertiary,
  },
});
