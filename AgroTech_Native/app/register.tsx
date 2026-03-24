import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = () => {
    if (!nombre || !correo || !password) {
      alert("Completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      console.log("Registro:", { nombre, correo, password });
      setLoading(false);
      alert("Cuenta creada correctamente");
    }, 1500);
  };

  return (
    <ImageBackground
      source={require("../assets/images/agro.png")}
      style={styles.background}
      blurRadius={3}
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="person-add" size={32} color="#16a34a" />
            </View>

            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>
              Regístrate para acceder al sistema
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={20} color="#16a34a" />
              <TextInput
                placeholder="Nombre"
                placeholderTextColor="#94a3b8"
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#16a34a" />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#94a3b8"
                style={styles.input}
                value={correo}
                onChangeText={setCorreo}
              />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#16a34a" />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#16a34a" />
              <TextInput
                placeholder="Confirmar contraseña"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* BOTÓN */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creando cuenta..." : "Registrarse"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "rgba(15,23,42,0.9)",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoCircle: {
    backgroundColor: "rgba(22,163,74,0.15)",
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 5,
    fontSize: 13,
  },

  form: {
    marginTop: 10,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    color: "#fff",
    padding: 12,
  },

  button: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});