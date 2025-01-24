import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false); // État pour gérer la visibilité du mot de passe

  return (
    <View style={styles.container}>
      {/* Cercle décoratif */}
      <View style={styles.circle} />

      {/* Titre */}
      <Text style={styles.title}>Connexion</Text>

      {/* Champs de connexion */}
      <View style={styles.inputContainer}>
        {/* Champ Email avec icône */}
        <View style={styles.inputWrapper}>
          <FontAwesome6 name="envelope" size={20} color="#B0B0B0" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email ou numéro de téléphone"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        {/* Champ Mot de passe avec icône et fonctionnalité de visibilité */}
        <View style={styles.inputWrapper}>
          <FontAwesome6 name="unlock-keyhole" size={20} color="#B0B0B0" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#B0B0B0"
            secureTextEntry={!passwordVisible} // Masque le mot de passe si "passwordVisible" est false
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <MaterialIcons
              name={passwordVisible ? "visibility" : "visibility-off"} // Change l'icône selon l'état
              size={20}
              color="#B0B0B0"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lien mot de passe oublié */}
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Se connecter */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </TouchableOpacity>

      {/* Lien créer un compte */}
      <TouchableOpacity>
        <Text style={styles.createAccount}>
          Vous n'avez pas de compte ? <Text style={styles.link}>Créer un compte</Text>
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
    right: -100,
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
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 5,
  },
  forgotPassword: {
    color: "#205895",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#205895",
    paddingVertical: 15,
    borderRadius: 32,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccount: {
    marginTop: 20,
    color: "#1A1A1A",
    fontSize: 14,
  },
  link: {
    color: "#205895",
    fontWeight: "bold",
  },
});
