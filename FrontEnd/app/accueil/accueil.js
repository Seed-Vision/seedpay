import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Cercle décoratif */}
      <View style={styles.circle} />

      {/* Image pleine page */}
      <Image
        source={require("../../assets/images/home-picture.png")} // Chemin de l'image
        style={styles.image}
        resizeMode="cover" // Ajuste l'image pour couvrir tout l'écran
      />

      {/* Boutons */}
      <TouchableOpacity style={[styles.button, styles.greenButton]}>
        <Text style={styles.buttonText}>Déjà client</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.blueButton]}>
        <Text style={styles.buttonText}>Nouveau client</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  circle: {
    position: "absolute",
    top: -100, // Décale le cercle vers le haut pour que son centre soit dans le coin supérieur droit
    right: -100, // Décale le cercle vers la droite pour que son centre soit au bord
    width: 200, // Largeur du cercle
    height: 200, // Hauteur du cercle
    borderRadius: 100, // Rayon égal à la moitié de la largeur/hauteur
    backgroundColor: "transparent", // Fond transparent
    borderWidth: 1, // Épaisseur de la bordure
    borderColor: "#205895", // Couleur de la bordure
    zIndex: 1, // Met le cercle au-dessus de l'image
  },
  image: {
    flex: 1, // L'image occupe tout l'espace disponible
    width: "100%",
  },
  button: {
    position: "absolute", // Les boutons se superposent à l'image
    width: "80%",
    paddingVertical: 15,
    borderRadius: 32,
    alignItems: "center",
    alignSelf: "center",
  },
  greenButton: {
    backgroundColor: "#4CAF50",
    bottom: 100, // Position du bouton "Déjà client"
    marginBottom: 20, // Ajout d'un espace entre les boutons
  },
  blueButton: {
    backgroundColor: "#205895",
    bottom: 50, // Position du bouton "Nouveau client"
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
