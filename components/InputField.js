import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const colors = {
  inputBg: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  primary: "#4F7CFF",
  primarySoft: "rgba(79,124,255,0.15)",
  textPrimary: "#E5E7EB",
  textSecondary: "#6B7280",
};

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  rightElement = null,
  containerStyle,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const wrapperStyle = useMemo(
    () => [
      styles.inputWrapper,
      isFocused && styles.inputWrapperFocused,
      containerStyle,
    ],
    [isFocused, containerStyle]
  );

  return (
    <View style={styles.group}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={wrapperStyle}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {rightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: "500",
  },
  inputWrapper: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    paddingVertical: 14,
  },
});
