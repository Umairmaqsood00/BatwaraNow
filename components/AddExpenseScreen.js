import GradientButton from "@/components/ui/GradientButton";
import {
  BorderRadius,
  Colors,
  Icons,
  Spacing,
  Typography,
} from "@/constants/DesignSystem";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
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
} from "react-native";

export default function AddExpenseScreen({
  participants,
  onSave,
  onCancel,
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payerInputs, setPayerInputs] = useState(
    participants.map((name) => ({ name, amount: "" }))
  );
  const [splitBetween, setSplitBetween] = useState(participants);

  const toggleParticipant = (participant) => {
    setSplitBetween((prev) =>
      prev.includes(participant)
        ? prev.filter((p) => p !== participant)
        : [...prev, participant]
    );
  };

  const handlePayerAmountChange = (name, value) => {
    setPayerInputs((prev) =>
      prev.map((p) => (p.name === name ? { ...p, amount: value } : p))
    );
  };

  const handleSave = () => {
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid total amount");
      return;
    }
    if (splitBetween.length === 0) {
      Alert.alert("Error", "Please select at least one person to split with");
      return;
    }
    const payers = payerInputs
      .filter((p) => p.amount && parseFloat(p.amount) > 0)
      .map((p) => ({ name: p.name, amount: parseFloat(p.amount) }));
    const totalPaid = payers.reduce((sum, p) => sum + p.amount, 0);
    if (payers.length === 0) {
      Alert.alert("Error", "Please enter at least one payer and amount");
      return;
    }
    if (Math.abs(totalPaid - parseFloat(amount)) > 0.01) {
      Alert.alert("Error", "Sum of payer amounts must equal total amount");
      return;
    }
    onSave({
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy: payers,
      splitBetween,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background.primary}
      />

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
            <Text style={styles.headerSubtitle}>
              Track and split your expense
            </Text>
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
              <Text style={styles.labelIcon}>{Icons.user}</Text> Who Paid & How
              Much
            </Text>
            {participants.map((participant) => (
              <View
                key={participant}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ width: 80, color: "#fff" }}>{participant}</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={
                    payerInputs.find((p) => p.name === participant)?.amount ||
                    ""
                  }
                  onChangeText={(value) =>
                    handlePayerAmountChange(participant, value)
                  }
                  placeholder="0.00"
                  placeholderTextColor={Colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>
            ))}
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
                        splitBetween.includes(participant) &&
                          styles.checkboxChecked,
                      ]}
                    >
                      {splitBetween.includes(participant) && (
                        <Text style={styles.checkboxCheckmark}>
                          {Icons.check}
                        </Text>
                      )}
                    </View>
                    <View style={styles.checkboxInfo}>
                      <Text style={styles.checkboxLabel}>{participant}</Text>
                      <Text style={styles.checkboxSubtitle}>
                        {splitBetween.includes(participant)
                          ? "Included"
                          : "Not included"}
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
                  Rs.
                  {amount && splitBetween.length > 0
                    ? (parseFloat(amount) / splitBetween.length).toFixed(2)
                    : "0.00"}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Splitting between:</Text>
                <Text style={styles.summaryValue}>
                  {splitBetween.length} people
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
          title="Add Expense"
          onPress={handleSave}
          variant="primary"
          size="large"
          icon={Icons.add}
          style={[styles.saveButton, styles.addExpenseButton]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelIcon: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.sizes.base,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  labelIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dropdownOption: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  dropdownOptionSelected: {
    backgroundColor: Colors.primary[50],
  },
  dropdownOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[300],
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  participantAvatarSelected: {
    backgroundColor: Colors.primary[500],
  },
  participantInitial: {
    fontSize: Typography.sizes.base,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  participantInitialSelected: {
    color: Colors.text.inverse,
  },
  dropdownOptionText: {
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: Colors.primary[700],
    fontWeight: "600",
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.inverse,
  },
  checkboxContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  checkboxItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  checkboxContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.neutral[400],
    marginRight: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  checkboxCheckmark: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.inverse,
    fontWeight: "700",
  },
  checkboxInfo: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: "500",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  checkboxSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  summaryCard: {
    borderRadius: BorderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  summaryTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: Typography.sizes.base,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  bottomActions: {
    flexDirection: "row",
    padding: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  cancelActionButton: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.neutral[300],
  },
  cancelActionText: {
    fontSize: Typography.sizes.base,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  saveButton: {
    flex: 2,
  },
  addExpenseButton: {
    backgroundColor: "#b7bac0ff",
    borderRadius: 23,
    paddingVertical: 10,
    paddingHorizontal: 26,
    alignItems: "center",
    justifyContent: "center",
  },
});
