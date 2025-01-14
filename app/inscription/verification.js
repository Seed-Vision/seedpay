import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'; // Import de FontAwesome6

const VerificationScreen = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef([]); // Références pour les TextInput

  // Vérifie si tous les champs sont remplis
  const isCodeComplete = code.every((digit) => digit !== '');

  const handleInputChange = (value, index) => {
    if (/^\d?$/.test(value)) { // Valide que l'entrée est un chiffre
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Passe automatiquement au champ suivant
      if (value && index < code.length - 1) {
        inputRefs.current[index + 1].focus();
      }

      // Ferme le clavier si tous les champs sont remplis
      if (index === code.length - 1 && value) {
        Keyboard.dismiss();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    // Si l'utilisateur supprime un chiffre
    if (e.nativeEvent.key === 'Backspace' && code[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1].focus(); // Focus sur le champ précédent
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Cercle décoratif */}
      <View style={styles.circle} />
      
      {/* Icône avec une couleur dynamique */}
      <FontAwesome6
        name="circle-check"
        size={75}
        color={isCodeComplete ? '#0FA958' : '#D8D8D8'}
        style={styles.icon}
      />
      <Text style={styles.title}>Vérification</Text>
      <Text style={styles.subtitle}>Entrez le code envoyé au</Text>
      <Text style={styles.email}>dk******@gmail.com</Text>
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={[
              styles.input,
              { borderColor: digit !== '' ? '#205895' : '#ccc' }, // Bordure dynamique
            ]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleInputChange(value, index)}
            ref={(el) => (inputRefs.current[index] = el)} // Ajout des références
            onKeyPress={(e) => handleKeyPress(e, index)} // Gestion de la suppression
          />
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isCodeComplete ? '#205895' : '#D8D8D8' },
        ]}
        disabled={!isCodeComplete} // Désactive le bouton si le code n'est pas complet
      >
        <Text style={styles.buttonText}>Vérifier</Text>
      </TouchableOpacity>
      <Text style={styles.resendText}>Je n’ai pas reçu le code !</Text>
      <TouchableOpacity>
        <Text style={styles.resendLink}>Renvoyez le code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center', // Centre verticalement
    alignItems: 'center',    // Centre horizontalement
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
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#205895',
  },
  subtitle: {
    fontSize: 16,
    color: '#181008',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#205895',
    marginTop: 3,
  },
  codeContainer: {
    flexDirection: 'row',
    marginTop: 50,
    justifyContent: 'center',
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 2, // Bordure plus épaisse
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 5,
  },
  button: {
    marginTop: 50,
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 32,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendText: {
    marginTop: 20,
    fontWeight: 'bold',
    color: '#181008',
    fontSize: 14,
  },
  resendLink: {
    color: '#205895',
    fontSize: 14,
  },
});

export default VerificationScreen;
