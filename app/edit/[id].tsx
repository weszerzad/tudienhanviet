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
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import dictionaryData from "../../assets/dicts/kanji_bank.json";
import { DictionaryEntry } from "@/types/dictionaryEntry";


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

  const [extraFields, setExtraFields] = useState([]);

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
            style={[styles.input, { height: "auto", paddingBottom: 5 }]}
            multiline={true}
            value={entry[4]}
            onChangeText={(text) => setEntry({ ...entry, 4: text })}
            onFocus={() =>
              setTimeout(() => {
                scrollToInput(defRef);
              }, 100)
            }
          />

          <FlatList
            scrollEnabled={false}
            data={
              Object.keys(item)?.length > 0
                ? Object.keys(item)
                    ?.filter((itemKey) => itemKey >= 6)
                    .map((itemKey) => {
                      return { itemKey: itemKey, data: item?.[itemKey] };
                    })
                : []
            }
            renderItem={({ item: subItem }) => (
              <View>
                <Text style={styles.label}>{`Item ${subItem.itemKey}:`}</Text>
                <TextInput
                  style={[styles.input, { height: "auto", paddingBottom: 5 }]}
                  multiline={true}
                  value={subItem.data}
                  onChangeText={(text) =>
                    setEntry({ ...entry, [subItem.itemKey]: text })
                  }
                  onFocus={() =>
                    setTimeout(() => {
                      scrollToBottom();
                    }, 100)
                  }
                />
              </View>
            )}
          />

          <FlatList
            scrollEnabled={false}
            data={extraFields}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.label}>{`Item ${item}:`}</Text>
                <TextInput
                  style={[styles.input, { height: "auto", paddingBottom: 5 }]}
                  multiline={true}
                  onChangeText={(text) =>
                    setEntry({ ...entry, [item]: text })
                  }
                  onFocus={() =>
                    setTimeout(() => {
                      scrollToBottom();
                    }, 100)
                  }
                />
              </View>
            )}
          />

          <View className="mb-6 flex flex-col justify-evenly">
            <Button title="Save" onPress={handleSave} />
            <Button
              title="Add Extra Field"
              onPress={() => {
                setExtraFields((state) => {
                  if (state.length === 0) {
                    return [Object.keys(item)?.length];
                  }
                  return [...state, state[state.length - 1] + 1];
                });
              }}
            />
          </View>
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
