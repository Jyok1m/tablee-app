import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function AgendaScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>AgendaScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B",
  },
});