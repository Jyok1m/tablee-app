import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

export default function SignupScreen({ navigation }) {
  //Redirige vers le scan screen
  function scan() {
    navigation.navigate("ScanScreen");
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => scan()}>
        <Text>ScanScreen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
