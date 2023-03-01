import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../components/Header";
import { RFPercentage } from "react-native-responsive-fontsize";

export default function MenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.inputCard}>
        <View>
          <Text style={styles.title}>Menu 1</Text>
          <Text style={styles.title}>10€</Text>
        </View>

        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
          mollitia, molestiae quas vel sint commodi repudiandae consequuntur
          voluptatum laborum numquam blanditiis harum
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B",
  },
  subtitle: {
    fontSize: RFPercentage(1.6),
    fontWeight: "400",
    color: "#ffffff",
  },
  title: {
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "#CDAB82",
  },
  inputCard: {
    width: "100%",
    minHeight: "2%",
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: "5%",
    padding: 5,
  },
});
