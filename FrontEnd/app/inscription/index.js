import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function SignupScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Cercle décoratif */}
      <View style={styles.circle} />

      {/* Titre */}
      <Text style={styles.title}>Inscription</Text>

      {/* Champs d'inscription */}
      <View style={styles.inputContainer}>
        {/* Champ Nom & Prénoms */}
        <View style={styles.inputWrapper}>
          <FontAwesome6 name="user" size={20} color="#B0B0B0" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nom & Prénoms"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        {/* Champ Numéro de téléphone */}
        <View style={styles.inputWrapper}>
          <FontAwesome6 name="phone" size={20} color="#B0B0B0" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            placeholderTextColor="#B0B0B0"
            keyboardType="phone-pad"
          />
        </View>

        {/* Champ Email */}
        <View style={styles.inputWrapper}>
          <FontAwesome6 name="envelope" size={20} color="#B0B0B0" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Adresse mail"
            placeholderTextColor="#B0B0B0"
            keyboardType="email-address"
          />
        </View>

        {/* Champ Créer un mot de passe */}
        <View style={styles.inputWrapper}>
          <FontAwesome6 name="lock" size={20} color="#B0B0B0" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Créer un mot de passe"
            placeholderTextColor="#B0B0B0"
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <MaterialIcons
              name={passwordVisible ? "visibility" : "visibility-off"}
              size={20}
              color="#B0B0B0"
            />
          </TouchableOpacity>
        </View>

        {/* Champ Confirmer mot de passe */}
        <View style={styles.inputWrapper}>
          <FontAwesome6 name="lock" size={20} color="#B0B0B0" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmer mot de passe"
            placeholderTextColor="#B0B0B0"
            secureTextEntry={!confirmPasswordVisible}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <MaterialIcons
              name={confirmPasswordVisible ? "visibility" : "visibility-off"}
              size={20}
              color="#B0B0B0"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bouton S'inscrire */}
      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupButtonText}>S'inscrire</Text>
      </TouchableOpacity>

      {/* Lien vers Connexion */}
      <TouchableOpacity>
        <Text style={styles.switchToLogin}>
          Vous avez déjà un compte ? <Text style={styles.link}>Connectez-vous</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  circle: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#205895",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#205895",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 32,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    paddingVertical: 15,
  },
  signupButton: {
    backgroundColor: "#205895",
    paddingVertical: 15,
    borderRadius: 32,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchToLogin: {
    marginTop: 20,
    color: "#1A1A1A",
    fontSize: 14,
  },
  link: {
    color: "#205895",
    fontWeight: "bold",
  },
});
