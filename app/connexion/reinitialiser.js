import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SuccessScreen = () => {
  return (
    <View style={styles.container}>
      {/* Cercle décoratif */}
      <View style={styles.circle} />

      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backButtonText}>◀ Connexion</Text>
      </TouchableOpacity> 
      <View style={styles.circleInner}>
        <Icon name="check-circle" size={195} color="#A8C0E0" />
      </View>
      <Text style={styles.successText}>
        Mot de passe réinitialisé {'\n'}
        avec succès !
      </Text>
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backButtonText: {
    fontSize: 14,
    color: '#1C478B',
    fontWeight: 'bold',
  },
  circleInner: {
    width: 200,
    height: 200,
    borderRadius: 95,       // La moitié de la largeur/hauteur pour obtenir un cercle parfait
    borderWidth: 2,
    borderColor: '#205895',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    marginTop: 20,
    fontSize: 14,
    color: '#1C478B',
    textAlign: 'center',
  },
});

export default SuccessScreen;
