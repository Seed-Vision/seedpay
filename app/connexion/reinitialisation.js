import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  const validatePassword = (pwd) => {
    setCriteria({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      number: /\d/.test(pwd),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    });
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    validatePassword(text);
  };

  const allCriteriaMet = Object.values(criteria).every((value) => value);
  const passwordsMatch = password === confirmPassword;

  return (
    <View style={styles.container}>
      {/* Cercle décoratif */}
      <View style={styles.circle} />

      <Text style={styles.title}>Réinitialisation</Text>
      <Text style={styles.passwordInstruction}>Entrez votre nouveau mot de passe</Text>

      {/* Champ "Nouveau mot de passe" */}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: passwordFocus || allCriteriaMet ? "#205895" : "#ccc",
          },
        ]}
      >
        <FontAwesome6
          name="unlock-keyhole"
          size={20}
          color={password ? "#205895" : "#ccc"}
          style={styles.iconLeft}
        />
        <TextInput
          style={styles.input}
          secureTextEntry={!showPassword}
          placeholder="Nouveau mot de passe"
          value={password}
          onChangeText={handlePasswordChange}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
          <Icon
            name={showPassword ? "eye-slash" : "eye"}
            size={20}
            color={password ? "#205895" : "#ccc"}
          />
        </TouchableOpacity>
      </View>

      {/* Champ "Confirmer mot de passe" */}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor:
              confirmFocus || (confirmPassword && passwordsMatch)
                ? "#205895"
                : confirmPassword && !passwordsMatch
                ? "red"
                : "#ccc",
          },
        ]}
      >
        <FontAwesome6
          name="unlock-keyhole"
          size={20}
          color={confirmPassword ? "#205895" : "#ccc"}
          style={styles.iconLeft}
        />
        <TextInput
          style={styles.input}
          secureTextEntry={!showConfirmPassword}
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onFocus={() => setConfirmFocus(true)}
          onBlur={() => setConfirmFocus(false)}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.iconRight}
        >
          <Icon
            name={showConfirmPassword ? "eye-slash" : "eye"}
            size={20}
            color={confirmPassword ? "#205895" : "#ccc"}
          />
        </TouchableOpacity>
      </View>

      {/* Texte introductif */}
      <Text style={styles.criteriaIntro}>Votre mot de passe doit contenir :</Text>

      {/* Critères de validation */}
      <View style={styles.criteriaContainer}>
        <View style={styles.criteria}>
          <Icon
            name="check-circle"
            size={20}
            color={criteria.length ? "#205895" : "#ccc"}
          />
          <Text style={styles.criteriaText}>Au moins 8 caractères</Text>
        </View>
        <View style={styles.criteria}>
          <Icon
            name="check-circle"
            size={20}
            color={criteria.uppercase ? "#205895" : "#ccc"}
          />
          <Text style={styles.criteriaText}>Une majuscule</Text>
        </View>
        <View style={styles.criteria}>
          <Icon
            name="check-circle"
            size={20}
            color={criteria.number ? "#205895" : "#ccc"}
          />
          <Text style={styles.criteriaText}>Un chiffre</Text>
        </View>
        <View style={styles.criteria}>
          <Icon
            name="check-circle"
            size={20}
            color={criteria.specialChar ? "#205895" : "#ccc"}
          />
          <Text style={styles.criteriaText}>Un caractère spécial</Text>
        </View>
      </View>

      {/* Bouton Réinitialiser */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: allCriteriaMet && passwordsMatch ? "#205895" : "#ccc" },
        ]}
        disabled={!allCriteriaMet || !passwordsMatch}
      >
        <Text style={styles.buttonText}>Réinitialiser</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: "center",
    backgroundColor: "#fff",
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
    marginBottom: 15,
    color: "#205895",
    textAlign: "center",
  },
  passwordInstruction: {
    fontSize: 14,
    marginBottom: 35,
    color: "#181008",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 32,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  criteriaIntro: {
    fontSize: 14,
    marginVertical: 10,
    color: "#181008",
  },
  criteriaContainer: {
    marginVertical: 0,
  },
  criteria: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  criteriaText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#181008",
  },
  button: {
    padding: 12,
    borderRadius: 32,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ResetPassword;
