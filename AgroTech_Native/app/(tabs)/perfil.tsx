// app/(tabs)/perfil.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Perfil() {
  const menuItems: { title: string; icon: keyof typeof Ionicons.glyphMap; color?: string }[] = [
    { title: "Mis compras", icon: "basket-outline" },
    { title: "Favoritos", icon: "heart-outline" },
    { title: "Configuración", icon: "settings-outline" },
    { title: "Cerrar sesión", icon: "log-out-outline", color: "#ef4444" },
  ];

  return (
    <LinearGradient colors={["#0f172a", "#14532d"]} style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarBox}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Luis Valverde</Text>
        <Text style={styles.email}>luis@example.com</Text>
      </View>

      {/* Card de opciones */}
      <View style={styles.card}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.option}>
            <Ionicons name={item.icon} size={22} color={item.color ?? "#16a34a"} />
            <Text style={[styles.optionText, item.color ? { color: item.color } : {}]}>
              {item.title}
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#64748b" />
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, alignItems: "center" },

  avatarBox: { alignItems: "center", marginBottom: 40 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  name: { color: "white", fontSize: 22, fontWeight: "bold" },
  email: { color: "#d1fae5", fontSize: 14, marginTop: 3 },

  card: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    elevation: 8,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 15,
    color: "#1e293b",
  },
});