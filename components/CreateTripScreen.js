import InputField from "@/components/InputField";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateTripScreen({ onSave, onCancel }) {
  const insets = useSafeAreaInsets();
  const [tripName, setTripName] = useState("");
  const [participants, setParticipants] = useState([""]);

  const addParticipant = () => {
    setParticipants([...participants, ""]);
  };

  const updateParticipant = (text, index) => {
    const newParticipants = [...participants];
    newParticipants[index] = text;
    setParticipants(newParticipants);
  };

  const removeParticipant = (index) => {
    if (participants.length > 1) {
      const newParticipants = participants.filter((_, i) => i !== index);
      setParticipants(newParticipants);
    }
  };

  const handleSave = () => {
    if (!tripName.trim()) {
      Alert.alert("Error", "Please enter a trip name");
      return;
    }

    const validParticipants = participants
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (validParticipants.length < 1) {
      Alert.alert("Error", "Please add at least one participant");
      return;
    }

    onSave({
      name: tripName.trim(),
      participants: validParticipants,
    });
  };

  const renderRemoveParticipant = (index) => (
    <Pressable
      onPress={() => removeParticipant(index)}
      style={({ pressed }) => [
        styles.removeButton,
        pressed && styles.pressedScale,
      ]}
    >
      <Text style={styles.removeButtonText}>✕</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <BlurView
        intensity={24}
        tint="dark"
        style={[styles.headerBlur, { paddingTop: insets.top + 4 }]}
      >
        <View style={styles.headerContent}>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.pressedScale,
            ]}
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

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.content}
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
              {participants.map((participant, index) => (
                <InputField
                  key={`${index}`}
                  value={participant}
                  onChangeText={(text) => updateParticipant(text, index)}
                  placeholder={`Participant ${index + 1}`}
                  containerStyle={styles.participantInput}
                  rightElement={
                    participants.length > 1
                      ? renderRemoveParticipant(index)
                      : null
                  }
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
  content: {
    flex: 1,
  },
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
  participantInput: {
    marginBottom: 12,
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
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: "#05080F",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    gap: 12,
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