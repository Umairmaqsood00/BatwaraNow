import { Colors, CommonStyles, Typography } from '@/constants/DesignSystem';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function AuthCheckScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>BatwaraNow</Text>
      <ActivityIndicator size="large" color={Colors.primary[500]} style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    ...CommonStyles.textH1,
    fontSize: 32,
    color: Colors.primary[500],
    fontWeight: 'bold',
  },
});
