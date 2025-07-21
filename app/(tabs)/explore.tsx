import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { storage, type SettlementHistory } from '@/utils/storage';

export default function SettingsScreen() {
  const [history, setHistory] = useState<SettlementHistory[]>([]);

  useEffect(() => {
    storage.getSettlementHistory().then(setHistory);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Text style={styles.appName}>BatwaraNow</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.developer}>Developed by Umair</Text>
            <Text style={styles.tech}>React Native • Expo • TypeScript</Text>
            <Text style={styles.description}>
              A simple and elegant app to split expenses between friends and family during trips and events.
            </Text>
          </View>
        </View>

        {/* Settlement History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settlement History</Text>
          <View style={styles.card}>
            {history.length === 0 ? (
              <Text style={styles.description}>No settlements yet.</Text>
            ) : (
              history.slice().reverse().map(entry => (
                <View key={entry.id} style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {entry.from} paid {entry.to} Rs.{entry.amount.toFixed(2)}
                  </Text>
                  <Text style={{ color: '#7f8c8d', fontSize: 12 }}>
                    {new Date(entry.settledAt).toLocaleString()} • Trip: {entry.tripName}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.card}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✈️</Text>
              <Text style={styles.featureText}>Create and manage trips</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💰</Text>
              <Text style={styles.featureText}>Add and track expenses</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚖️</Text>
              <Text style={styles.featureText}>Automatic balance calculation</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <View style={styles.card}>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Create a new trip and add participants</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Add expenses with who paid and who should split</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>View automatic balance calculations</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={styles.stepText}>Settle up with friends easily!</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Export Data</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Clear All Data</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  developer: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 12,
  },
  tech: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3498db',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  stepText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  menuText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  menuArrow: {
    fontSize: 16,
    color: '#7f8c8d',
  },
});
