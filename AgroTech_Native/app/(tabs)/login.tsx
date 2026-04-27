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
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://api.agrootech.com.mx/api";

export default function Login() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Recuperación
  const [forgotVisible, setForgotVisible] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);

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

    checkSession();
  }, []);

  const checkSession = async () => {
    const session = await AsyncStorage.getItem("agroSession");
    if (session) {
      router.replace("/(tabs)");
    }
  };

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: correo,
        password: password,
      });

      const data = response.data;

      if (data.token) {
        const sessionData = {
          token: data.token,
          user: data.user,
        };

        await AsyncStorage.setItem(
          "agroSession",
          JSON.stringify(sessionData)
        );

        Alert.alert("Bienvenido 🌱", "Inicio de sesión exitoso");

        const adminEmails = [
          "22cg0095@itsncg.edu.mx",
          "sebastiannn231@gmail.com",
          "raulmadridflores202@gmail.com",
        ];

        if (adminEmails.includes(data.user.email)) {
          router.replace("/(tabs)/perfil");
        } else {
          router.replace("/(tabs)");
        }
      }
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Credenciales incorrectas"
      );
    }

    setLoading(false);
  };

  const handleRecovery = async () => {
    if (!recoveryEmail) {
      Alert.alert("Error", "Ingresa tu correo electrónico");
      return;
    }

    setRecoveryLoading(true);

    try {
      await axios.post(`${API_URL}/forgot-password`, {
        email: recoveryEmail,
      });

      Alert.alert(
        "Correo enviado 📩",
        "Te enviamos instrucciones para recuperar tu cuenta."
      );

      setRecoveryEmail("");
      setForgotVisible(false);
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "No se pudo enviar el correo de recuperación"
      );
    }

    setRecoveryLoading(false);
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
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf" size={32} color="#16a34a" />
            </View>

            <Text style={styles.title}>AgroTech</Text>
            <Text style={styles.subtitle}>
              Sistema de gestión de asesorías y ganado
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#16a34a" />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#94a3b8"
                style={styles.input}
                value={correo}
                onChangeText={setCorreo}
                autoCapitalize="none"
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

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Cargando..." : "Ingresar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setForgotVisible(true)}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.registerText}>
                ¿No tienes cuenta?{" "}
                <Text style={styles.registerLink}>Crear cuenta</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            © 2026 AgroTech • Sistema inteligente
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* MODAL RECUPERAR CUENTA */}
      <Modal
        visible={forgotVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setForgotVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Ionicons name="mail-open-outline" size={26} color="#16a34a" />
              <Text style={styles.modalTitle}>Recuperar cuenta</Text>
            </View>

            <Text style={styles.modalSubtitle}>
              Ingresa tu correo y te enviaremos instrucciones para recuperar tu
              contraseña.
            </Text>

            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#16a34a" />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#94a3b8"
                style={styles.input}
                value={recoveryEmail}
                onChangeText={setRecoveryEmail}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, recoveryLoading && { opacity: 0.7 }]}
              onPress={handleRecovery}
              disabled={recoveryLoading}
            >
              <Text style={styles.buttonText}>
                {recoveryLoading ? "Enviando..." : "Enviar recuperación"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setForgotVisible(false)}>
              <Text style={styles.closeText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

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

  forgotText: {
    color: "#38bdf8",
    textAlign: "center",
    marginTop: 15,
    fontWeight: "600",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 20,
  },

  modalHeader: {
    alignItems: "center",
    marginBottom: 12,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
  },

  modalSubtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 13,
  },

  closeText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 15,
    fontWeight: "600",
  },
});