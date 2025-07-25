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
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateTripScreen({ onSave, onCancel }) {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

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
            <Text style={styles.headerSubtitle}>
              Start tracking expenses together
            </Text>
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
              placeholder="Enter trip name"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>{Icons.users}</Text> Participants
            </Text>
            {participants.map((participant, index) => (
              <View key={index} style={styles.participantInput}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={participant}
                  onChangeText={(text) => updateParticipant(text, index)}
                  placeholder={`Participant ${index + 1}`}
                  placeholderTextColor={Colors.text.tertiary}
                />
                {participants.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeParticipant(index)}
                  >
                    <Text style={styles.removeButtonText}>{Icons.close}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={addParticipant}
            >
              <Text style={styles.addButtonText}>
                {Icons.add} Add Participant
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.cancelActionButton}
          onPress={onCancel}
        >
          <Text style={styles.cancelActionText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleSave}
        >
          <Text style={styles.createButtonText}>Create Trip</Text>
        </TouchableOpacity>
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
    borderColor: Colors.neutral[700],
  },
  participantInput: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
  removeButtonText: {
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
  },
  addButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary[500],
    marginTop: Spacing.sm,
  },
  addButtonText: {
    fontSize: Typography.sizes.base,
    color: Colors.primary[500],
    fontWeight: "600",
  },
  bottomActions: {
    flexDirection: "row",
    padding: Spacing.lg,
    backgroundColor: Colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[700],
    gap: Spacing.md,
  },
  cancelActionButton: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  cancelActionText: {
    fontSize: Typography.sizes.base,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  createButton: {
    flex: 2,
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: "600",
    color: Colors.background.primary,
  },
}); 