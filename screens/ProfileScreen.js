import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput, Modal
} from "react-native";
import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser, removePhoto} from "../reducers/user";
import {RFPercentage} from "react-native-responsive-fontsize";
import {BACKEND_URL} from "../backend_url";
import Header from "../components/Header";
import Toast from "react-native-root-toast";

export default function ProfileScreen({navigation}) {
  /* -------------------------------------------------------------------------- */
  /*                                    Logic                                   */
  /* -------------------------------------------------------------------------- */

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [history, setHistory] = useState([]);

  const [isEditable, setIsEditable] = useState(false);
  const [fieldToDisplay, setFieldToDisplay] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [sendState, setSendState] = useState(false);

  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [cardHolderName, setCardHolderName] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [cardExpirationMonth, setCardExpirationMonth] = useState(null);
  const [cardExpirationYear, setCardExpirationYear] = useState(null);
  const [cardCVV, setCardCVV] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const bioRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const {token, profilePic} = user;

  /* ---------------- Get all the data and update the state ---------------- */

  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/users/${token}`);
      const data = await response.json();
      const {result} = data;
      const {picture, bio, username, email, password, history} = data.user;

      if (result) {
        setProfilePhoto(picture);
        setBio(bio);
        setUsername(username);
        setEmail(email);
        setPassword(password);
        setHistory(history);
      }
    })();
  }, [sendState, profilePic]);

  /* ------------------------------- Handle input fields ------------------------------ */

  const handleEdit = (inputName) => {
    setIsEditable(true);
    setFieldToDisplay(inputName);
  };

  const cancelEdit = () => {
    setIsEditable(false);
    setFieldToDisplay(null);
    setInputValue("");
  };

  /* ------------------------------- Handle Edit ------------------------------ */

  async function saveInput() {
    // Fetch de la réponse et modif des états
    if (inputValue === "") {
      return;
    }
    const userData = {[fieldToDisplay]: inputValue};
    const response = await fetch(`${BACKEND_URL}/users/${token}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (data.result) {
      Toast.show("Modification enregistrée !", {
        duration: Toast.durations.LONG,
        position: -10,
        textColor: "#1D2C3B",
        opacity: 1,
        shadow: true,
        backgroundColor: "#CDAB82",
        animation: true,
        delay: 500
      });
    } else {
      Toast.show(data.error, {
        duration: Toast.durations.LONG,
        position: 0,
        textColor: "#1D2C3B",
        opacity: 1,
        shadow: true,
        backgroundColor: "#CDAB82",
        animation: true,
        delay: 500
      });
    }
    setSendState(!sendState);
    cancelEdit();
  }

  /* --------------------------------- Logout --------------------------------- */

  function logout() {
    dispatch(logoutUser());
    dispatch(removePhoto());
    navigation.navigate("Landing");
  }

  // Set card details:
  function showCardModal() {
    setCardModalVisible(true);
  }

  async function handleValidateCard() {
    if (cardHolderName && cardNumber && cardExpirationYear && cardExpirationMonth && cardCVV && phoneNumber) {
      setCardModalVisible(false);
      // Add credit card to Stripe:
      const cardDetails = {
        name: cardHolderName,
        number: cardNumber,
        exp_month: cardExpirationMonth,
        exp_year: cardExpirationYear,
        cvc: cardCVV
      };
      await fetch(`${BACKEND_URL}/cards/save/${user.token}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(cardDetails)
      });
      alert("Données de carte modifiées !");
      setCardModalVisible(false);
      setCardHolderName(null);
      setCardNumber(null);
      setCardExpirationMonth(null);
      setCardExpirationYear(null);
      setCardCVV(null);
      setPhoneNumber(null);
    } else {
      Toast.show("Un ou plusieurs champ(s) manquant.", {
        duration: Toast.durations.LONG,
        position: -10,
        textColor: "#1D2C3B",
        opacity: 1,
        shadow: true,
        backgroundColor: "#CDAB82",
        animation: true,
        delay: 500
      });
    }
  }

  function handleCancelCard() {
    setCardModalVisible(false);
    setCardHolderName(null);
    setCardNumber(null);
    setCardExpirationMonth(null);
    setCardExpirationYear(null);
    setCardCVV(null);
    setPhoneNumber(null);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View style={styles.container}>

      <Modal visible={cardModalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Nom sur la carte bancaire"
              placeholderTextColor="grey"
              value={cardHolderName}
              onChangeText={(value) => setCardHolderName(value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Numéro de carte"
              placeholderTextColor="grey"
              value={cardNumber}
              onChangeText={(value) => setCardNumber(value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Mois d'expiration (MM)"
              placeholderTextColor="grey"
              value={cardExpirationMonth}
              onChangeText={(value) => setCardExpirationMonth(value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Année d'expiration (AAAA)"
              placeholderTextColor="grey"
              value={cardExpirationYear}
              onChangeText={(value) => setCardExpirationYear(value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              placeholderTextColor="grey"
              value={cardCVV}
              onChangeText={(value) => setCardCVV(value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Numéro de téléphone"
              placeholderTextColor="grey"
              value={phoneNumber}
              onChangeText={(value) => setPhoneNumber(value)}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              onPress={() => handleValidateCard()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Ajouter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCancelCard()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Annuler</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <Header/>

      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>
          Bienvenue, {username && <Text>{username} !</Text>}
        </Text>
      </View>

      <View style={styles.userContainer}>
        <View style={styles.photoContainer}>
          {profilePhoto && (
            <Image style={styles.profilePic} source={{uri: profilePhoto}}/>
          )}
          <TouchableOpacity
            style={styles.editPhoto}
            onPress={() => navigation.navigate("Snap")}
          >
            <Text style={styles.edit}>Modifier</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bioContainer}>
          <View style={styles.inputCard}>
            <View style={styles.cardTop}>
              <Text style={styles.title}>Bio</Text>
              <View style={styles.editFocused}>
                {isEditable && fieldToDisplay === "bio" && (
                  <TouchableOpacity
                    onPress={() => cancelEdit()}
                    style={styles.cancelEdit}
                  >
                    <Text style={styles.edit}>Annuler</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPressIn={() =>
                    isEditable && fieldToDisplay === "bio"
                      ? saveInput()
                      : handleEdit("bio")
                  }
                  onPressOut={() => bioRef.current.focus()}
                >
                  <Text style={styles.edit}>
                    {isEditable && fieldToDisplay === "bio"
                      ? "Sauvegarder"
                      : "Modifier"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView>
              <TextInput
                style={styles.content}
                editable={isEditable}
                onChangeText={(value) => setInputValue(value)}
                multiline={true}
                textAlign="left"
                textAlignVertical="top"
                placeholder={
                  isEditable && fieldToDisplay === "bio"
                    ? "Racontez votre histoire"
                    : bio
                }
                placeholderTextColor={
                  isEditable && fieldToDisplay === "bio" ? "grey" : "#FFF"
                }
                value={isEditable && fieldToDisplay === "bio" ? inputValue : ""}
                ref={bioRef}
              />
            </ScrollView>
          </View>
        </View>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.inputCard}>
          <View style={styles.cardTop}>
            <Text style={styles.title}>Email</Text>
          </View>
          <TextInput
            style={styles.content}
            editable={isEditable}
            onChangeText={(value) => setInputValue(value)}
            placeholder={
              isEditable && fieldToDisplay === "email"
                ? "Nouvel email..."
                : email
            }
            placeholderTextColor={
              isEditable && fieldToDisplay === "email" ? "grey" : "#FFF"
            }
            value={isEditable && fieldToDisplay === "email" ? inputValue : ""}
            ref={emailRef}
          />
        </View>

        <View style={styles.inputCard}>
          <View style={styles.cardTop}>
            <Text style={styles.title}>Mot de passe</Text>
            <View style={styles.editFocused}>
              {isEditable && fieldToDisplay === "password" && (
                <TouchableOpacity
                  onPress={() => cancelEdit()}
                  style={styles.cancelEditMain}
                >
                  <Text style={styles.edit}>Annuler</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPressIn={() =>
                  isEditable && fieldToDisplay === "password"
                    ? saveInput()
                    : handleEdit("password")
                }
                onPressOut={() => passwordRef.current.focus()}
              >
                <Text style={styles.edit}>
                  {isEditable && fieldToDisplay === "password"
                    ? "Sauvegarder"
                    : "Modifier"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={styles.content}
            editable={isEditable}
            onChangeText={(value) => setInputValue(value)}
            placeholder={
              isEditable && fieldToDisplay === "password"
                ? "Nouveau mot de passe..."
                : "********"
            }
            placeholderTextColor={
              isEditable && fieldToDisplay === "password" ? "grey" : "#FFF"
            }
            value={
              isEditable && fieldToDisplay === "password" ? inputValue : ""
            }
            multiline={true}
            ref={passwordRef}
          />
        </View>

        <View style={styles.inputCard}>
          <View style={styles.cardTop}>
            <Text style={styles.title}>Moyen de paiement</Text>
            <TouchableOpacity onPress={() => showCardModal()}>
              <Text style={styles.edit}>Modifier</Text>
            </TouchableOpacity>
          </View>
          {password && <Text style={styles.content}>********</Text>}
        </View>

      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => logout()}>
          <Text style={styles.pressableText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Style                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B"
  },

  /* ----------------------------- Title Container ----------------------------- */

  titleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5%"
  },
  screenTitle: {
    fontSize: RFPercentage(4),
    color: "#CDAB82",
    fontWeight: "500"
  },

  /* ------------------------------ User container ----------------------------- */

  userContainer: {
    flexDirection: "row",
    width: "100%",
    height: "20%",
    alignItems: "center",
    marginBottom: "5%"
  },
  photoContainer: {
    width: "30%",
    height: "100%",
    marginRight: "5%"
  },
  profilePic: {
    height: "70%",
    width: "100%",
    borderRadius: 50,
    borderColor: "#CDAB82",
    borderWidth: 1
  },
  editPhoto: {
    width: "100%",
    height: "30%",
    paddingRight: "20%",
    alignItems: "center",
    justifyContent: "center"
  },
  bioContainer: {
    justifyContent: "space-between",
    width: "65%",
    height: "100%",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 10
  },

  /* ----------------------------- Main container ----------------------------- */

  mainContainer: {
    width: "100%",
    height: "55%",
    padding: 5
  },
  inputCard: {
    width: "100%",
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    marginBottom: "2%",
    padding: 5
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#CDAB82",
    borderBottomWidth: 1,
    marginBottom: "2%"
  },
  title: {
    fontSize: RFPercentage(3),
    fontWeight: "500",
    color: "#CDAB82"
  },
  edit: {
    fontSize: RFPercentage(1.5),
    fontWeight: "500",
    color: "#CDAB82",
    textDecorationLine: "underline",
    fontStyle: "italic",
    paddingLeft: 20
  },
  editFocused: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "50%"
  },
  cancelEdit: {
    paddingLeft: "20%"
  },
  cancelEditMain: {
    paddingLeft: "20%"
  },
  editContent: {
    borderBottomWidth: 1,
    borderBottomColor: "#CDAB82",
    fontSize: RFPercentage(1.5),
    fontWeight: "400",
    color: "#FFF"
  },
  editViewTop: {
    maxHeight: "80%"
  },
  content: {
    fontSize: RFPercentage(2),
    fontWeight: "400",
    color: "#FFF"
  },
  noContent: {
    fontSize: RFPercentage(2),
    fontWeight: "400",
    color: "grey",
    fontStyle: "italic"
  },
  scrollView: {
    height: "40%"
  },

  /* ----------------------------- Button container ----------------------------- */

  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  pressableText: {
    textDecorationLine: "underline",
    fontSize: RFPercentage(3),
    fontWeight: "500",
    color: "#CDAB82"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    backgroundColor: "#1D2C3B",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    minWidth: 200,
    borderBottomColor: "#CDAB82",
    borderBottomWidth: 1,
    fontSize: 16,
    color: "white",
    marginBottom: 10
  },
  button: {
    width: 150,
    alignItems: "center",
    marginVertical: 10,
    paddingTop: 8,
    backgroundColor: "#CDAB82",
    borderRadius: 10
  },
  pressedTextButton: {
    color: "#1D2C3B",
    height: 24,
    fontWeight: "600",
    fontSize: 15
  }
});
