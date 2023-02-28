import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Modal, Text } from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addPhoto, removePhoto } from "../reducers/user";
import * as ImagePicker from "expo-image-picker";
import { BlurView } from "expo-blur";
import BarcodeMask from "react-native-barcode-mask";

import { BACKEND_URL } from "../backend_url";

export default function SnapScreen({ navigation }) {
  // Define the states:
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const isFocused = useIsFocused();
  let cameraRef = useRef(null);
  const dispatch = useDispatch();

  // Popup to ask for camera access.
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Handle the take picture button.
  const takePicture = async () => {
    const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
    const formData = new FormData();
    formData.append("photoFromFront", {
      uri: photo.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch(`${BACKEND_URL}/users/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      dispatch(addPhoto(data.url));
      console.log("Photo Saved !");
    } catch (error) {
      console.log(error);
    }

    //Affiche le modal de validation
    setModalVisible(true);
  };

  //Si la photo est validée redirige vers Signup
  function handleValide() {
    navigation.navigate("Signup");
  }

  //Si il veut reprendre la photo, ferme le modal
  function handleRetake() {
    dispatch(removePhoto());
    setModalVisible(false);
  }

  //Upload une photo depuis la librairie du telephone
  const handleImportPhoto = async () => {
    let photo = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!photo.canceled) {
      setSelectedImage(photo.assets[0].uri);

      const formData = new FormData();
      formData.append("photoFromFront", {
        uri: photo.assets[0].uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      fetch(`${BACKEND_URL}/users/upload`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(addPhoto(data.url));
        })
        .catch((error) => console.log(error));
      //Affiche le modal de validation
      setModalVisible(true);
    } else {
      alert("Aucune image n'a été selectionnée !");
    }
  };

  // Return an empty component if the user has not allowed the camera nor is focused on it.
  if (!hasPermission || !isFocused) {
    return <View />;
  }

  return (
    <Camera
      type={type}
      flashMode={flashMode}
      ref={(ref) => (cameraRef = ref)}
      style={styles.camera}
    >
      <BarcodeMask
        width={"84%"}
        height={"25%"}
        edgeWidth={"100%"}
        edgeHeight={"100%"}
        edgeBorderWidth={1}
        showAnimatedLine={true}
        animatedLineWidth={"100%"}
        lineAnimationDuration={1500}
        outerMaskOpacity={0.7}
      />
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => handleValide()}
                style={styles.modalButton}
                activeOpacity={0.8}
              >
                <Text style={styles.modalTextButton}>Valider</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRetake()}
                style={styles.modalButton}
                activeOpacity={0.8}
              >
                <Text style={styles.modalTextButton}>Reprendre la photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </BlurView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() =>
            setType(
              type === CameraType.back ? CameraType.front : CameraType.back
            )
          }
          style={styles.button}
        >
          <FontAwesome name="rotate-right" size={25} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setFlashMode(
              flashMode === FlashMode.off ? FlashMode.torch : FlashMode.off
            )
          }
          style={styles.button}
        >
          <FontAwesome
            name="flash"
            size={25}
            color={flashMode === FlashMode.off ? "#ffffff" : "#e8be4b"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.snapContainer}>
        <TouchableOpacity
          onPress={() => handleImportPhoto()}
          style={styles.importButton}
          activeOpacity={0.8}
        >
          <Text style={styles.modalTextButton}>Importer depuis mes photos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => cameraRef && takePicture()}
          style={styles.photoButton}
        >
          <FontAwesome name="circle-thin" size={95} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    position: "absolute",
    marginTop: 70,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 50,
  },
  snapContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 25,
  },
  photoButton: {
    marginTop: 50,
  },
  cardContour: {
    height: "25%",
    width: "80%",
    borderWidth: 3,
    borderColor: "white",
    opacity: 0.7,
    borderRadius: 10,
  },
  blurContainer: {
    width: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingTop: 10,

    backgroundColor: "#1D2C3B",
    borderRadius: 10,
  },
  modalTextButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
  importButton: {
    width: 250,
    alignItems: "center",
    justifyContent: "center",

    marginTop: 20,
    paddingBottom: 4,
    paddingTop: 10,
    backgroundColor: "#1D2C3B",
    borderRadius: 10,
  },
});
