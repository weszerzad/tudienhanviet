import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import dictionaryData from "../../assets/dicts/kanji_bank.json";
import { WebView } from "react-native-webview";

interface DictionaryEntry {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string[];
}

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

  // const htmlText = item[4].join(", ");
  const htmlText = splitByNumbering(item?.[4][item[4]?.length - 1])
    .map((item) => {
      const formattedString = item
        .replace(/\[b\]/g, "<b>")
        .replace(/\[\/b\]/g, "</b>");

      // console.log(formattedString);

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
          <View style={{flex: 1}}>
            <Text
              selectable={true}
              style={{ fontSize: 24, fontWeight: "bold" }}
              onPress={() => router.push(`/edit/${id}`)}
            >
              {item[0]}
            </Text>
          </View>
          <TouchableOpacity className="bg-indigo-500" style={{justifyContent: "center", alignItems: "center", borderRadius: 4, width: 50}} onPress={() => router.push(`/edit/${id}`)}>
            <Text style={{
              fontSize: 18,
              color: "#a5b4fc",
            }}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text selectable={true} style={{ fontSize: 18, marginVertical: 10 }}>
          {item[1]}
        </Text>
        <Text selectable={true} style={{ fontSize: 18, marginVertical: 10 }}>
          {item[2]}
        </Text>

        <View
          style={{
            flex: 1,
          }}
        >
          <WebView
            // ref={webViewRef}
            originWhitelist={["*"]}
            // source={{ html: htmlText }}
            source={{ html: htmlString }}
            // source={{ html: '<h1>Hello world</h1>' }}
            style={{
              width: width,
              height: 600,
            }}
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      </View>
    </ScrollView>
  );
}
