// app/(tabs)/perfil.tsx
import React from "react";
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

export default function Perfil() {
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

  return (
    <View style={styles.container}>
      
      {/* 🌈 HEADER */}
      <LinearGradient colors={["#0f172a", "#14532d"]} style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </LinearGradient>

      {/* 📜 SCROLL */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        
        {/* 👤 AVATAR */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.avatar}
            />

            {/* Edit icon */}
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>Luis Valverde</Text>
          <Text style={styles.email}>luis@example.com</Text>
        </View>

        {/* 🧊 CARD */}
        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                index === menuItems.length - 1 && { borderBottomWidth: 0 },
              ]}
              activeOpacity={0.7}
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

              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* 📦 INFO */}
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

  /* 🔝 HEADER */
  header: {
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  /* 📜 SCROLL */
  scroll: {
    paddingBottom: 40,
    paddingTop: 10,
  },

  /* 👤 AVATAR */
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

  /* 🧊 CARD */
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

  /* 📦 INFO */
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