import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function LogoPage() {
  return (
    <View style={styles.container}>
      {/* Image centrée */}
      <Image
        source={require("../../assets/images/logo-seedpay.png")} // Remplacer par le chemin correct de ton image
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centrer le contenu verticalement
    alignItems: "center", // Centrer le contenu horizontalement
    backgroundColor: "#FFFFFF", // Fond blanc
  },
  logo: {
    width: 150, // Largeur de l'image, ajuster selon les dimensions de ton logo
    height: 150, // Hauteur de l'image, ajuster selon les dimensions de ton logo
  },
});
