import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import dictionaryData from "../../assets/dicts/kanji_bank.json";
import { WebView } from "react-native-webview";
import { DictionaryEntry } from "@/types/dictionaryEntry";

export default function DetailScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams();
  const [item, setItem] = useState(null);

  const fetchData = () => {
    const item = dictionaryData.find(
      (entry: DictionaryEntry) => entry[0] === id
    );
    setItem(item);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const { width } = useWindowDimensions();

  function splitByNumbering(input: string): string[] {
    // Regular expression to match the numbering characters like ①, ②, etc.
    const numberingRegex = /([①-㊿])/g;

    // Split the string based on the numbering characters while keeping the numbering
    const parts = input.split(numberingRegex);

    // Combine the parts correctly
    const result: string[] = [];
    let currentPart = parts[0]; // Start with the initial part before any numbering

    for (let i = 1; i < parts.length; i++) {
      if (numberingRegex.test(parts[i])) {
        // If the current part is a numbering character, push the accumulated part and start a new one
        result.push(currentPart);
        currentPart = parts[i];
      } else {
        // Otherwise, append the current part to the accumulated part
        currentPart += parts[i];
      }
    }

    // Push the last accumulated part
    result.push(currentPart);

    return result;
  }

  if (!item) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18 }}>Item not found</Text>
      </View>
    );
  }
  const htmlText = splitByNumbering(item?.[4] || '')
    .map((item) => {
      const formattedString = item
        .replace(/\[b\]/g, "<b>")
        .replace(/\[\/b\]/g, "</b>");

      return `<p>${formattedString}</p>`;
    })
    .join("");

  const htmlString = `
  <!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
    <style>
      body {
        padding-right: 50px;
        font-size: 18px;
      }
    </style>
</head>
<body>
    ${htmlText}
</body>
</html>`;

  return (
    <ScrollView style={{ padding: 20, flex: 1 }}>
      <View
        style={{
          paddingBottom: 50,
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              selectable={true}
              style={{ fontSize: 24, fontWeight: "bold" }}
              // onPress={() => router.push(`/edit/${id}`)}
            >
              {item[0]}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-indigo-500"
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 6,
              width: 70,
            }}
            onPress={() => router.push(`/edit/${id}`)}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        <Text selectable={true} style={{ fontSize: 18, marginTop: 10 }}>
          {item[1]}
        </Text>
        <Text selectable={true} style={{ fontSize: 18, marginTop: 10 }}>
          {item[2]}
        </Text>

        <View
          style={{
            flex: 1,
            marginTop: 10,
          }}
        >
          <WebView
            originWhitelist={["*"]}
            source={{ html: htmlString }}
            style={{
              width: width,
              height: htmlText.length + 50,
            }}
          />
        </View>

        <FlatList
          scrollEnabled={false}
          data={
            Object.keys(item)?.length > 0
              ? Object.keys(item)
                  ?.filter((itemKey) => itemKey >= 6)
                  .map((itemKey) => item?.[itemKey])
              : []
          }
          renderItem={({ item: subItem }) => (
            <View>
              <Text selectable={true} style={{ fontSize: 18, marginTop: 10 }}>
                {subItem}
              </Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}
