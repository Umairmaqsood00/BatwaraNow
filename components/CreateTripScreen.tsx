import GradientButton from '@/components/ui/GradientButton';
import { BorderRadius, Colors, Icons, Spacing, Typography } from '@/constants/DesignSystem';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type CreateTripScreenProps = {
  onSave: (tripData: { name: string; participants: string[] }) => void;
  onCancel: () => void;
};

export default function CreateTripScreen({ onSave, onCancel }: CreateTripScreenProps) {
  const [tripName, setTripName] = useState('');
  const [participants, setParticipants] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const addParticipant = () => {
    setParticipants([...participants, '']);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      const newParticipants = participants.filter((_, i) => i !== index);
      setParticipants(newParticipants);
    }
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const handleSave = async () => {
    if (!tripName.trim()) {
      Alert.alert('Error', 'Please enter a trip name');
      return;
    }

    const validParticipants = participants
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (validParticipants.length === 0) {
      Alert.alert('Error', 'Please add at least one participant');
      return;
    }

    if (validParticipants.length < 2) {
      Alert.alert('Error', 'Please add at least 2 participants');
      return;
    }

    // Check for duplicate names
    const uniqueParticipants = [...new Set(validParticipants)];
    if (uniqueParticipants.length !== validParticipants.length) {
      Alert.alert('Error', 'Participant names must be unique');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: tripName.trim(),
        participants: uniqueParticipants,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.primary} />
      

      <LinearGradient
        colors={[Colors.background.secondary, Colors.background.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelIcon}>{Icons.close}</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Create New Trip</Text>
            <Text style={styles.headerSubtitle}>Start tracking expenses together</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
    
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>{Icons.trip}</Text> Trip Name
            </Text>
            <TextInput
              style={styles.input}
              value={tripName}
              onChangeText={setTripName}
              placeholder="e.g., Weekend Trip to Kashmir"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>

    
          <View style={styles.inputGroup}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>
                <Text style={styles.labelIcon}>{Icons.users}</Text> Participants
              </Text>
              <TouchableOpacity onPress={addParticipant} style={styles.addButton}>
                <Text style={styles.addButtonText}>{Icons.add}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.participantsContainer}>
              {participants.map((participant, index) => (
                <View key={index} style={styles.participantRow}>
                  <View style={styles.participantAvatar}>
                    <Text style={styles.participantInitial}>
                      {participant.charAt(0).toUpperCase() || '?'}
                    </Text>
                  </View>
                  <TextInput
                    style={styles.participantInput}
                    value={participant}
                    onChangeText={(value) => updateParticipant(index, value)}
                    placeholder={`Participant ${index + 1}`}
                    placeholderTextColor={Colors.text.tertiary}
                  />
                  {participants.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeParticipant(index)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>{Icons.delete}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

    
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={[Colors.primary[50], Colors.primary[100]]}
              style={styles.summaryGradient}
            >
              <Text style={styles.summaryTitle}>Trip Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Trip Name:</Text>
                <Text style={styles.summaryValue}>
                  {tripName.trim() || 'Not set'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Participants:</Text>
                <Text style={styles.summaryValue}>
                  {participants.filter(p => p.trim()).length} people
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>


      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.cancelActionButton} onPress={onCancel}>
          <Text style={styles.cancelActionText}>Cancel</Text>
        </TouchableOpacity>
        <GradientButton
          title="Create Trip"
          onPress={handleSave}
          size="large"
          icon={Icons.trip}
          loading={loading}
          
          style={[styles.saveButton, { backgroundColor: '#e4edf0ff' }]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  } as ViewStyle,
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  cancelIcon: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
  } as TextStyle,
  headerInfo: {
    flex: 1,
  } as ViewStyle,
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  } as TextStyle,
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  } as TextStyle,
  headerSpacer: {
    width: 40,
  } as ViewStyle,
  content: {
    flex: 1,
  } as ViewStyle,
  form: {
    padding: Spacing.lg,
  } as ViewStyle,
  inputGroup: {
    marginBottom: Spacing.xl,
  } as ViewStyle,
  label: {
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  } as TextStyle,
  labelIcon: {
    marginRight: Spacing.sm,
  } as TextStyle,
  input: {
    backgroundColor: Colors.background.quaternary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as TextStyle,
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  } as ViewStyle,
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  addButtonText: {
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
  } as TextStyle,
  participantsContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  } as ViewStyle,
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  } as ViewStyle,
  participantInitial: {
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
    color: Colors.text.inverse,
  } as TextStyle,
  participantInput: {
    flex: 1,
    backgroundColor: Colors.background.quaternary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  } as TextStyle,
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  } as ViewStyle,
  removeButtonText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.inverse,
  } as TextStyle,
  summaryCard: {
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  summaryGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  } as ViewStyle,
  summaryTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  } as TextStyle,
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  } as ViewStyle,
  summaryLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  } as TextStyle,
  summaryValue: {
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  } as TextStyle,
  bottomActions: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[800],
  } as ViewStyle,
  cancelActionButton: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  } as ViewStyle,
  cancelActionText: {
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
    color: Colors.text.secondary,
  } as TextStyle,
  saveButton: {
    flex: 2,
  } as ViewStyle,
}); 