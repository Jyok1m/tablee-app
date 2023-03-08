import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import socket from "../socket";


export default function NewChatModal({ setVisible }) {
  const [groupName, setGroupName] = useState("");

  //Fonction qui ferme le modal
  const closeModal = () => setVisible(false);

  //Créer un nouveau groupe de discussion sur socket
  const handleCreateRoom = () => {
    socket.emit("createRoom", groupName);
    console.log(groupName)
    closeModal();
  };
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Enter your Group name</Text>
      <TextInput
        style={styles.modalinput}
        placeholder="Group name"
        onChangeText={(value) => setGroupName(value)}
      />

      <View style={styles.modalbuttonContainer}>
        <Pressable style={styles.modalbutton} onPress={handleCreateRoom}>
          <Text style={styles.modaltext}>CREATE</Text>
        </Pressable>
        <Pressable
          style={[styles.modalbutton, { backgroundColor: "#E14D2A" }]}
          onPress={closeModal}>
          <Text style={styles.modaltext}>CANCEL</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalbutton: {
    width: "40%",
    height: 45,
    backgroundColor: "#CDAB82",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  modalbuttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modaltext: {
    color: "#fff",
  },
  modalContainer: {
    width: "100%",
    borderTopColor: "#CDAB82",
    borderTopWidth: 1,
    elevation: 1,
    height: 250,
    backgroundColor: "#1D2C3B",
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  modalinput: {
    borderWidth: 2,
    padding: 15,
    borderColor: "#CDAB82",
    backgroundColor: "white"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: 'white'
  },
});