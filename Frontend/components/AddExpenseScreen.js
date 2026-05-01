import InputField from "@/components/InputField";
import { Icons } from "@/constants/DesignSystem";
import { BlurView } from "expo-blur";
import React, { memo, useCallback, useImperativeHandle, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Reusable Components ──────────────────────────────────────────────────────

const ScreenHeader = memo(function ScreenHeader({ onCancel }) {
  const insets = useSafeAreaInsets();
  return (
    <BlurView
      intensity={24}
      tint="dark"
      style={[styles.headerBlur, { paddingTop: insets.top - 10 }]}
    >
      <View style={styles.headerContent}>
        <Pressable
          onPress={onCancel}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.pressedScale,
          ]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.closeIcon}>{Icons.close}</Text>
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <Text style={styles.headerSubtitle}>Track and split your expense</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
    </BlurView>
  );
});

const SectionHeader = memo(({ title, icon }) => (
  <View style={styles.sectionHeader}>
    {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
));
SectionHeader.displayName = "SectionHeader";

const AmountInput = memo(({ value, onChangeText }) => {
  return (
    <View style={styles.amountContainer}>
      <Text style={styles.currencySymbol}>Rs.</Text>
      <TextInput
        style={styles.amountInput}
        value={value}
        onChangeText={onChangeText}
        placeholder="0.00"
        placeholderTextColor="rgba(79,124,255,0.4)"
        keyboardType="numeric"
      />
    </View>
  );
});
AmountInput.displayName = "AmountInput";

const PayerInput = memo(
  React.forwardRef(function PayerInput({ participant }, ref) {
    const valueRef = useRef("");

    useImperativeHandle(ref, () => ({ getValue: () => valueRef.current }), []);

    return (
      <View style={styles.payerRow} focusable={false}>
        <View style={styles.payerNameContainer}>
          <View style={styles.payerAvatar}>
            <Text style={styles.payerAvatarText}>
              {participant.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.payerName} numberOfLines={1}>
            {participant}
          </Text>
        </View>
        <View style={styles.payerInputWrapper}>
          <Text style={styles.payerCurrency}>Rs.</Text>
          <TextInput
            defaultValue=""
            onChangeText={(text) => {
              valueRef.current = text;
            }}
            placeholder="0.00"
            placeholderTextColor="#6B7280"
            style={styles.payerTextInput}
            keyboardType="numeric"
          />
        </View>
      </View>
    );
  })
);

const ParticipantCheckbox = memo(({ participant, isSelected, onToggle }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.checkboxRow,
        pressed && styles.pressedScale,
      ]}
      onPress={() => onToggle(participant)}
    >
      <View
        style={[styles.checkbox, isSelected && styles.checkboxSelected]}
      >
        {isSelected && <Text style={styles.checkmark}>{Icons.check}</Text>}
      </View>
      <View style={styles.checkboxInfo}>
        <Text style={styles.checkboxName}>{participant}</Text>
        <Text style={styles.checkboxStatus}>
          {isSelected ? "Included in split" : "Not included"}
        </Text>
      </View>
    </Pressable>
  );
});
ParticipantCheckbox.displayName = "ParticipantCheckbox";

// ─── Main Screen Component ─────────────────────────────────────────────────────

export default function AddExpenseScreen({ participants, onSave, onCancel }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitBetween, setSplitBetween] = useState(participants);

  // Map of participant name → ref object exposing getValue()
  const payerRefs = useRef({});

  const toggleParticipant = useCallback((participant) => {
    setSplitBetween((prev) =>
      prev.includes(participant)
        ? prev.filter((p) => p !== participant)
        : [...prev, participant]
    );
  }, []);

  const handleSave = useCallback(() => {
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid total amount");
      return;
    }
    if (splitBetween.length === 0) {
      Alert.alert("Error", "Please select at least one person to split with");
      return;
    }

    // Read dynamic payer values safely via refs
    const payers = participants
      .map((p) => {
        const val = payerRefs.current[p]?.getValue() || "";
        return { name: p, amount: parseFloat(val) };
      })
      .filter((p) => !isNaN(p.amount) && p.amount > 0);

    const totalPaid = payers.reduce((sum, p) => sum + p.amount, 0);

    if (payers.length === 0) {
      Alert.alert("Error", "Please enter at least one payer and amount");
      return;
    }

    if (Math.abs(totalPaid - parseFloat(amount)) > 0.01) {
      Alert.alert("Error", "Sum of payer amounts must equal the total amount");
      return;
    }

    onSave({
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy: payers,
      splitBetween,
    });
  }, [description, amount, splitBetween, participants, onSave]);

  const splitAmount =
    amount && !isNaN(parseFloat(amount)) && splitBetween.length > 0
      ? (parseFloat(amount) / splitBetween.length).toFixed(2)
      : "0.00";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScreenHeader onCancel={onCancel} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          <View style={styles.form}>
            {/* Description */}
            <View style={styles.section}>
              <SectionHeader title="Description" /* icon={Icons.expense} */ />
              <InputField
                value={description}
                onChangeText={setDescription}
                placeholder="What was this expense for?"
              />
            </View>

            {/* Amount */}
            <View style={styles.section}>
              <SectionHeader title="Amount" /* icon={Icons.money} */ />
              <AmountInput value={amount} onChangeText={setAmount} />
            </View>

            {/* Who Paid */}
            <View style={styles.section}>
              <SectionHeader title="Who Paid & How Much" icon={Icons.user} />
              <View style={styles.card}>
                {participants.map((participant, index) => (
                  <View key={participant}>
                    <PayerInput
                      ref={(r) => {
                        if (r) payerRefs.current[participant] = r;
                        else delete payerRefs.current[participant];
                      }}
                      participant={participant}
                    />
                    {index < participants.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Split Between */}
            <View style={styles.section}>
              <SectionHeader title="Split Between" icon={Icons.users} />
              <View style={styles.card}>
                {participants.map((participant, index) => (
                  <View key={participant}>
                    <ParticipantCheckbox
                      participant={participant}
                      isSelected={splitBetween.includes(participant)}
                      onToggle={toggleParticipant}
                    />
                    {index < participants.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Summary */}
            <View style={styles.section}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryTitle}>Expense Summary</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount per person</Text>
                  <Text style={styles.summaryValue}>Rs. {splitAmount}</Text>
                </View>
                <View style={[styles.summaryRow, { marginBottom: 0 }]}>
                  <Text style={styles.summaryLabel}>Splitting between</Text>
                  <Text style={styles.summaryValue}>
                    {splitBetween.length} people
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomActions}>
        <Pressable
          style={({ pressed }) => [
            styles.cancelActionButton,
            pressed && styles.pressedScale,
          ]}
          onPress={onCancel}
        >
          <Text style={styles.cancelActionText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            pressed && styles.pressedScale,
          ]}
          onPress={handleSave}
        >
          <Text style={styles.createButtonText}>Add Expense</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070B14",
  },
  flex: {
    flex: 1,
  },
  // ── Header ──
  headerBlur: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 16,
    color: "#E5E7EB",
  },
  headerTextWrap: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  // ── Layout ──
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  form: {
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  sectionIcon: {
    fontSize: 16,
    color: "#6B7280",
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginLeft: 16,
  },
  // ── Amount Input ──
  amountContainer: {
    backgroundColor: "rgba(79,124,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.2)",
    borderRadius: 16,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currencySymbol: {
    fontSize: 26,
    color: "#4F7CFF",
    marginRight: 8,
    fontWeight: "600",
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "700",
    color: "#E5E7EB",
    padding: 0,
    minWidth: 100,
  },
  // ── Payer Input ──
  payerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  payerNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  payerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  payerAvatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  payerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#E5E7EB",
    flex: 1,
  },
  payerInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    width: 120,
  },
  payerCurrency: {
    fontSize: 14,
    color: "#6B7280",
    marginRight: 4,
  },
  payerTextInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
    padding: 0,
  },
  // ── Checkbox Row ──
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  checkboxSelected: {
    backgroundColor: "#4F7CFF",
    borderColor: "#4F7CFF",
  },
  checkmark: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  checkboxInfo: {
    flex: 1,
  },
  checkboxName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#E5E7EB",
    marginBottom: 2,
  },
  checkboxStatus: {
    fontSize: 13,
    color: "#6B7280",
  },
  // ── Summary Card ──
  summaryCard: {
    backgroundColor: "rgba(79,124,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.2)",
    borderRadius: 16,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F7CFF",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E5E7EB",
  },
  // ── Bottom Actions ──
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#070B14",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    gap: 12,
  },
  cancelActionButton: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.02)",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelActionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  createButton: {
    flex: 1.4,
    height: 52,
    borderRadius: 999,
    backgroundColor: "rgba(79,124,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4F7CFF",
  },
  // ── Utilities ──
  pressedScale: {
    transform: [{ scale: 0.97 }],
  },
});
