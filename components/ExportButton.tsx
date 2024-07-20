import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import dictionaryData from "../assets/dicts/kanji_bank.json";

const exportDictionaryData = async () => {
  try {
    const fileUri = `${FileSystem.documentDirectory}dictionaryData.json`;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(dictionaryData), {
      encoding: FileSystem.EncodingType.UTF8,
    });
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Share JSON File',
      UTI: 'public.json',
    });
  } catch (error) {
    Alert.alert('Error', 'Failed to export JSON file');
  }
};

const ExportButton = () => {
  return (
      <Button title="Export JSON" onPress={exportDictionaryData} />
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 20,
  },
  header: {
    fontSize: 24,
    // marginBottom: 20,
  },
});

export default ExportButton;
