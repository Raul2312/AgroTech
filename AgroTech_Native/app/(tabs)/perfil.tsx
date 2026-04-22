import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";

export default function Perfil() {
  const router = useRouter();

  const [nombre, setNombre] = useState("Cargando...");
  const [correo, setCorreo] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const session = await AsyncStorage.getItem("agroSession");

          if (session) {
            const parsed = JSON.parse(session);
            const user = parsed.user;

            setNombre(
              user?.name ||
                user?.nombre ||
                user?.usuario ||
                "Usuario"
            );

            setCorreo(
              user?.email ||
                user?.correo ||
                "Sin correo"
            );
          } else {
            setNombre("No logueado");
            setCorreo("");
          }
        } catch (error) {
          console.log("Error cargando usuario", error);
        }
      };

      loadUser();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("agroSession");
      await AsyncStorage.removeItem("agroFavorites");

      router.replace("/(tabs)/login");
    } catch (error) {
      console.log("Error cerrando sesión", error);
    }
  };

  const menuItems: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color?: string;
  }[] = [
    { title: "Mis compras", icon: "basket-outline" },
    { title: "Favoritos", icon: "heart-outline" },
    { title: "Configuración", icon: "settings-outline" },
    { title: "Cerrar sesión", icon: "log-out-outline", color: "#ef4444" },
  ];

  const handleMenuPress = (title: string) => {
    if (title === "Cerrar sesión") {
      handleLogout();
      return;
    }

    if (title === "Favoritos") {
      router.push("/perfil/favoritos");
      return;
    }

    if (title === "Mis compras") {
      router.push("/perfil/compras");
      return;
    }

    if (title === "Configuración") {
      router.push("/perfil/configuracion");
      return;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0f172a", "#14532d"]} style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.avatar}
            />

            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{nombre}</Text>
          <Text style={styles.email}>{correo}</Text>
        </View>

        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                index === menuItems.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item.title)}
            >
              <View style={styles.left}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.color ?? "#16a34a"}
                  />
                </View>

                <Text
                  style={[
                    styles.optionText,
                    item.color && { color: item.color },
                  ]}
                >
                  {item.title}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#94a3b8"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>AgroTech Marketplace 🌱</Text>
          <Text style={styles.infoText}>
            Gestiona tus compras, favoritos y configuración desde aquí.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  header: {
   paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  scroll: {
    paddingBottom: 40,
    paddingTop: 10,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },

  editBtn: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#16a34a",
    padding: 6,
    borderRadius: 20,
    elevation: 4,
  },

  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },

  email: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 2,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 20,
    paddingVertical: 10,
    elevation: 8,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    backgroundColor: "#f0fdf4",
    padding: 8,
    borderRadius: 10,
  },

  optionText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
    color: "#1e293b",
  },

  infoCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 5,
  },

  infoTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#16a34a",
  },

  infoText: {
    color: "#475569",
    fontSize: 13,
  },
});