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

type AddExpenseScreenProps = {
  participants: string[];
  onSave: (expense: {
    description: string;
    amount: number;
    paidBy: string;
    splitBetween: string[];
  }) => void;
  onCancel: () => void;
};

export default function AddExpenseScreen({
  participants,
  onSave,
  onCancel,
}: AddExpenseScreenProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(participants[0] || '');
  const [splitBetween, setSplitBetween] = useState<string[]>(participants);

  const toggleParticipant = (participant: string) => {
    setSplitBetween(prev =>
      prev.includes(participant)
        ? prev.filter(p => p !== participant)
        : [...prev, participant]
    );
  };

  const handleSave = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!paidBy) {
      Alert.alert('Error', 'Please select who paid');
      return;
    }

    if (splitBetween.length === 0) {
      Alert.alert('Error', 'Please select at least one person to split with');
      return;
    }

    onSave({
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy,
      splitBetween,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background.primary} />
      

      <LinearGradient
        colors={[Colors.background.secondary, Colors.background.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelIcon}>{Icons.close}</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Add Expense</Text>
            <Text style={styles.headerSubtitle}>Track and split your expense</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
    
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>{Icons.expense}</Text> Description
            </Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="What was this expense for?"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>

    
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>{Icons.money}</Text> Amount (Rs.)
            </Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="numeric"
            />
          </View>

    
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>{Icons.user}</Text> Paid By
            </Text>
            <View style={styles.dropdownContainer}>
              {participants.map((participant) => (
                <TouchableOpacity
                  key={participant}
                  style={[
                    styles.dropdownOption,
                    paidBy === participant && styles.dropdownOptionSelected,
                  ]}
                  onPress={() => setPaidBy(participant)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dropdownOptionContent}>
                    <View style={[
                      styles.participantAvatar,
                      paidBy === participant && styles.participantAvatarSelected
                    ]}>
                      <Text style={[
                        styles.participantInitial,
                        paidBy === participant && styles.participantInitialSelected
                      ]}>
                        {participant.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        paidBy === participant && styles.dropdownOptionTextSelected,
                      ]}
                    >
                      {participant}
                    </Text>
                  </View>
                  {paidBy === participant && (
                    <View style={styles.checkmarkContainer}>
                      <Text style={styles.checkmark}>{Icons.check}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

    
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>{Icons.users}</Text> Split Between
            </Text>
            <View style={styles.checkboxContainer}>
              {participants.map((participant) => (
                <TouchableOpacity
                  key={participant}
                  style={styles.checkboxItem}
                  onPress={() => toggleParticipant(participant)}
                  activeOpacity={0.7}
                >
                  <View style={styles.checkboxContent}>
                    <View
                      style={[
                        styles.checkbox,
                        splitBetween.includes(participant) && styles.checkboxChecked,
                      ]}
                    >
                      {splitBetween.includes(participant) && (
                        <Text style={styles.checkboxCheckmark}>{Icons.check}</Text>
                      )}
                    </View>
                    <View style={styles.checkboxInfo}>
                      <Text style={styles.checkboxLabel}>{participant}</Text>
                      <Text style={styles.checkboxSubtitle}>
                        {splitBetween.includes(participant) ? 'Included' : 'Not included'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

    
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={[Colors.primary[50], Colors.primary[100]]}
              style={styles.summaryGradient}
            >
              <Text style={styles.summaryTitle}>Expense Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount per person:</Text>
                <Text style={styles.summaryValue}>
                  Rs.{amount && splitBetween.length > 0 ? (parseFloat(amount) / splitBetween.length).toFixed(2) : '0.00'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Splitting between:</Text>
                <Text style={styles.summaryValue}>{splitBetween.length} people</Text>
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
          title="Add Expense"
          onPress={handleSave}
          variant="primary"
          size="large"
          icon={Icons.add}
          style={styles.saveButton}
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
    backgroundColor: Colors.background.secondary,
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
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as TextStyle,
  dropdownContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  dropdownOption: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  } as ViewStyle,
  dropdownOptionSelected: {
    backgroundColor: Colors.primary[50],
  } as ViewStyle,
  dropdownOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  } as ViewStyle,
  participantAvatarSelected: {
    backgroundColor: Colors.primary[500],
  } as ViewStyle,
  participantInitial: {
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  } as TextStyle,
  participantInitialSelected: {
    color: Colors.text.inverse,
  } as TextStyle,
  dropdownOptionText: {
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
    flex: 1,
  } as TextStyle,
  dropdownOptionTextSelected: {
    color: Colors.primary[700],
    fontWeight: '600' as const,
  } as TextStyle,
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  checkmark: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.inverse,
  } as TextStyle,
  checkboxContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  checkboxItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  } as ViewStyle,
  checkboxContent: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.neutral[400],
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  checkboxChecked: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  } as ViewStyle,
  checkboxCheckmark: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.inverse,
    fontWeight: '700' as const,
  } as TextStyle,
  checkboxInfo: {
    flex: 1,
  } as ViewStyle,
  checkboxLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: '500' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  } as TextStyle,
  checkboxSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
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
    borderTopColor: Colors.neutral[200],
  } as ViewStyle,
  cancelActionButton: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
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