import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import dictionaryData from "../../assets/dicts/kanji_bank.json";

interface DictionaryEntry {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string[];
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const itemIndex = dictionaryData.findIndex(
    (entry: DictionaryEntry) => entry[0] === id
  );
  // const item = dictionaryData.find((entry: DictionaryEntry) => entry[0] === id);
  const item = dictionaryData[itemIndex];

  const [entry, setEntry] = useState<DictionaryEntry | null>(item);

  if (!entry) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18 }}>Item not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (itemIndex !== -1) {
      dictionaryData[itemIndex] = entry;
      Alert.alert("Save", "Changes have been saved.");
    } else {
      Alert.alert("Error", "Failed to save changes.");
    }
  };

  const scrollViewRef = useRef(null);
  const defRef = useRef(null);
  const catRef = useRef(null);

  const scrollToInput = (inputRef) => {
    // console.error('inputRef', inputRef.current)
    // console.error('scrollViewRef', scrollViewRef.current)
    if (scrollViewRef.current && inputRef.current) {
      inputRef.current.measureLayout(
        scrollViewRef.current.getInnerViewNode(),
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y: y, animated: true });
        }
      );
    }
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView ref={scrollViewRef} style={styles.container}>
          <Text style={styles.label}>Character:</Text>
          <TextInput
            style={styles.input}
            value={entry[0]}
            onChangeText={(text) => setEntry({ ...entry, 0: text })}
          />
          <Text style={styles.label}>Pronunciation:</Text>
          <TextInput
            style={styles.input}
            value={entry[1]}
            onChangeText={(text) => setEntry({ ...entry, 1: text })}
          />
          <Text style={styles.label}>Japanese Conjugation:</Text>
          <TextInput
            style={styles.input}
            value={entry[2]}
            onChangeText={(text) => setEntry({ ...entry, 2: text })}
          />
          <Text style={styles.label}>Category:</Text>
          <TextInput
            ref={catRef}
            style={styles.input}
            value={entry[3]}
            onChangeText={(text) => setEntry({ ...entry, 3: text })}
          />
          <Text style={styles.label}>Definitions:</Text>
          <TextInput
            ref={defRef}
            style={[styles.input, { height: "auto" }]}
            multiline={true}
            value={entry[4].join(", ")}
            onChangeText={(text) => setEntry({ ...entry, 4: text.split(", ") })}
            // onFocus={() => setTimeout( scrollToBottom, 100)}
            onFocus={() => setTimeout( ()=>{scrollToInput(defRef)}, 100)}
            // onFocus={() => scrollToInput(defRef)}
          />
          <View className="mb-6"><Button title="Save" onPress={handleSave} /></View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
