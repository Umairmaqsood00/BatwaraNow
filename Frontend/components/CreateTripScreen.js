import InputField from "@/components/InputField";
import { BlurView } from "expo-blur";
import React, {
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

let _id = Date.now();
const nextId = () => ++_id;


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
          hitSlop={8}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Create New Trip</Text>
          <Text style={styles.headerSubtitle}>
            Start tracking shared expenses with your group
          </Text>
        </View>
      </View>
    </BlurView>
  );
});


const ParticipantInput = memo(
  React.forwardRef(function ParticipantInput({ id, onRemove, showRemove }, ref) {
    const valueRef = useRef("");

    useImperativeHandle(ref, () => ({ getValue: () => valueRef.current }), []);

    return (
      <View style={styles.participantRow} focusable={false}>
        <TextInput
          defaultValue=""
          onChangeText={(text) => {
            valueRef.current = text;
          }}
          placeholder="Participant name"
          placeholderTextColor="#888"
          style={styles.participantTextInput}
          autoCorrect={false}
          autoCapitalize="words"
        />
        {showRemove && (
          <Pressable
            onPress={() => onRemove(id)}
            style={({ pressed }) => [
              styles.removeButton,
              pressed && styles.pressedScale,
            ]}
            hitSlop={8}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </Pressable>
        )}
      </View>
    );
  }),

  (prev, next) =>
    prev.showRemove === next.showRemove &&
    prev.id === next.id &&
    prev.onRemove === next.onRemove,
);

export default function CreateTripScreen({ onSave, onCancel }) {
  const [tripName, setTripName] = useState("");
  const [participants, setParticipants] = useState([{ id: nextId() }]);

  const participantRefs = useRef({});

  const showRemove = participants.length > 1;

  const addParticipant = useCallback(() => {
    setParticipants((prev) => [...prev, { id: nextId() }]);
  }, []);

  const removeParticipant = useCallback((id) => {
    setParticipants((prev) => {
      if (prev.length <= 1) return prev;
      delete participantRefs.current[id];
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const handleSave = useCallback(() => {
    if (!tripName.trim()) {
      Alert.alert("Error", "Please enter a trip name");
      return;
    }

    // Read values imperatively — works cross-platform, no _lastNativeText hack
    const validParticipants = participants
      .map((p) => (participantRefs.current[p.id]?.getValue() ?? "").trim())
      .filter((v) => v.length > 0);

    if (validParticipants.length < 1) {
      Alert.alert("Error", "Please add at least one participant");
      return;
    }

    onSave({ name: tripName.trim(), participants: validParticipants });
  }, [tripName, participants, onSave]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader onCancel={onCancel} />

      {/*
        KAV is iOS-only. On Android:
        - softwareKeyboardLayoutMode="pan" (app.json) handles keyboard avoidance
        - behavior="height" caused layout thrash → focus jumping on Android
      */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          <View style={styles.form}>
            <InputField
              label="Trip Name"
              value={tripName}
              onChangeText={setTripName}
              placeholder="Enter trip name"
            />

            <View style={styles.participantsSection}>
              <Text style={styles.sectionLabel}>Participants</Text>

              {participants.map((participant) => (
                <ParticipantInput
                  key={participant.id}
                  ref={(r) => {
                    if (r) participantRefs.current[participant.id] = r;
                    else delete participantRefs.current[participant.id];
                  }}
                  id={participant.id}
                  onRemove={removeParticipant}
                  showRemove={showRemove}
                />
              ))}

              <Pressable
                style={({ pressed }) => [
                  styles.addParticipantButton,
                  pressed && styles.addParticipantButtonPressed,
                ]}
                onPress={addParticipant}
              >
                <Text style={styles.addParticipantButtonText}>
                  ＋ Add Participant
                </Text>
              </Pressable>
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
          <Text style={styles.createButtonText}>Create Trip</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05080F",
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
    marginRight: 12,
  },
  closeIcon: {
    fontSize: 16,
    color: "#E5E7EB",
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  // ── Form ──
  scrollContainer: {
    flexGrow: 1,
  },
  form: {
    padding: 16,
  },
  participantsSection: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "500",
  },
  // ── Participant row ──
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  participantTextInput: {
    flex: 1,
    color: "#E5E7EB",
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  removeButtonText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  addParticipantButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.02)",
    alignItems: "center",
    justifyContent: "center",
  },
  addParticipantButtonPressed: {
    borderColor: "#4F7CFF",
    backgroundColor: "rgba(79,124,255,0.10)",
    transform: [{ scale: 0.98 }],
  },
  addParticipantButtonText: {
    fontSize: 15,
    color: "#9FB8FF",
    fontWeight: "600",
  },
  // ── Bottom actions ──
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 25,
    backgroundColor: "#05080F",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    gap: 14,
  },
  cancelActionButton: {
    flex: 1,
    height: 48,
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
    height: 48,
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
  pressedScale: {
    transform: [{ scale: 0.97 }],
  },
});
