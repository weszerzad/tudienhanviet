// app/index.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  AppStateStatus,
  AppState,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import dictionaryData from "../assets/dicts/kanji_bank.json";
import * as Clipboard from "expo-clipboard";
import ExportButton from "@/components/ExportButton";
import { Ionicons } from "@expo/vector-icons";

interface DictionaryEntry {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string[];
}

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const router = useRouter();

  const searchTextBoxRef = useRef(null);

  const [pastedText, setPastedText] = useState("");
  const pasteFromClipboard = async () => {
    const clipboardText = await Clipboard.getStringAsync();
    setQuery(clipboardText);
  };

  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     if (searchTextBoxRef.current) {
  //       searchTextBoxRef.current?.focus();
  //     }
  //   }, [])
  // );


  // Use useEffect to set up the AppState listener
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // if (searchTextBoxRef.current) {
      //   searchTextBoxRef.current?.focus();
      // }
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        pasteFromClipboard();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const handleSearch = () => {
    const query_tokens = query.split("");
    let res = [];
    for (const token of query_tokens) {
      const filteredResults = dictionaryData.filter((item: DictionaryEntry) =>
        item[0].includes(token)
      );
      res.push(filteredResults);
    }
    res = res.flat();

    res = res.reduce((acc, current) => {
      const firstProperty = current[0];
      if (!acc.some((item) => item[0] === firstProperty)) {
        acc.push(current);
      }
      return acc;
    }, []);

    setResults(res);
  };

  useEffect(() => {
    handleSearch();
  }, [query]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, padding: 20 }}>
          <View
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
              paddingHorizontal: 10,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              borderRadius: 4,
            }}
          >
            <TextInput
              ref={searchTextBoxRef}
              placeholder="漢字検索"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              style={{
                fontSize: 18,
                flex: 1,
              }}
            />
            {query.length > 0 ? (
              <TouchableOpacity
                onPress={() => setQuery("")}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="gray" />
              </TouchableOpacity>
            ) : null}
          </View>

          <Button title="Search" onPress={handleSearch} />

            
          <FlatList
            data={results}
            keyExtractor={(item) => item[0]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  borderColor: "gray",
                  borderWidth: 1,
                  marginBottom: 10,
                  borderRadius: 4,
                }}
                onPress={() => router.push(`/detail/${item[0]}`)}
              >
                <Text style={{ padding: 10, fontSize: 18 }}>{item[0]}</Text>
                <Text style={{ padding: 10, fontSize: 18 }}>{item[1]}</Text>
              </TouchableOpacity>
            )}
          />

          <ExportButton />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
  },
  textInput: {
    flex: 1,
    height: 40,
  },
  clearButton: {
    padding: 5,
  },
});
