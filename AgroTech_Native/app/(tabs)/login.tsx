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
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = () => {
    setLoading(true);

    setTimeout(() => {
      console.log("Login:", correo, password);
      setLoading(false);
    }, 1500);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/agro.png")}
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
              <Ionicons name="leaf" size={32} color="#16a34a" />
            </View>

            <Text style={styles.title}>AgroTech</Text>
            <Text style={styles.subtitle}>
              Sistema de gestión de asesorías y ganado
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
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

            {/* BOTÓN LOGIN */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Cargando..." : "Ingresar"}
              </Text>
            </TouchableOpacity>

            {/* 🔥 CREAR CUENTA */}
            <TouchableOpacity
              onPress={() => router.push("/register")} // 👈 ruta a registro
            >
              <Text style={styles.registerText}>
                ¿No tienes cuenta?{" "}
                <Text style={styles.registerLink}>Crear cuenta</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <Text style={styles.footerText}>
            © 2026 AgroTech • Sistema inteligente
          </Text>
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

  registerText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 15,
  },

  registerLink: {
    color: "#38bdf8",
    fontWeight: "bold",
  },

  footerText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
  },
});