import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import axios from "axios";

import { API_URL } from "../../constants/api";

export default function Perfil() {
  const router = useRouter();

  const [nombre, setNombre] = useState("Cargando...");
  const [correo, setCorreo] = useState("");
  const [agroPoints, setAgroPoints] = useState(0);
  const [ultimoPremio, setUltimoPremio] = useState("Sin premios");

  useFocusEffect(
    useCallback(() => {
      // Reemplaza COMPLETAMENTE tu función loadUser() por esta versión.

const loadUser = async () => {
  try {
    const session = await AsyncStorage.getItem("agroSession");

    if (!session) {
      setNombre("No logueado");
      setCorreo("");
      setAgroPoints(0);
      setUltimoPremio("Sin premios");
      return;
    }

    const parsed = JSON.parse(session);
    const user = parsed?.user || {};
    const token = parsed?.token;

    // =========================
    // DATOS DEL USUARIO
    // =========================
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

    // =========================
    // SI NO HAY TOKEN
    // =========================
    if (!token) {
      setAgroPoints(0);
      setUltimoPremio("Sin premios");
      return;
    }

    // =========================
    // CONSULTAR RECOMPENSAS
    // =========================
    try {
      const rewardRes = await axios.get(`${API_URL}/rewards/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        timeout: 10000,
      });

      const rewardData = rewardRes.data;

      console.log("🎯 Reward data:", rewardData);

      // =========================
      // PUNTOS
      // =========================
      setAgroPoints(Number(rewardData.points || 0));

      // =========================
      // ÚLTIMO PREMIO
      // =========================
      if (rewardData.last_reward_label) {
        // Ejemplo: FREE, 5% OFF, 10 AgroPoints
        setUltimoPremio(rewardData.last_reward_label);
      } else if (
        rewardData.last_reward_type &&
        rewardData.last_reward_value !== null
      ) {
        // Respaldo si no viene el label
        if (rewardData.last_reward_type === "points") {
          setUltimoPremio(
            `${rewardData.last_reward_value} AgroPoints`
          );
        } else if (rewardData.last_reward_type === "discount") {
          setUltimoPremio(
            `${rewardData.last_reward_value}% OFF`
          );
        } else if (rewardData.last_reward_type === "shipping") {
          setUltimoPremio("FREE");
        } else {
          setUltimoPremio("Sin premios");
        }
      } else {
        // Aún no ha girado la ruleta
        setUltimoPremio("Sin premios");
      }
    } catch (error: any) {
      console.log(
        "❌ Error obteniendo recompensas:",
        error?.response?.data || error.message
      );

      setAgroPoints(0);
      setUltimoPremio("Sin premios");
    }
  } catch (error) {
    console.log("❌ Error cargando usuario:", error);

    setNombre("Usuario");
    setCorreo("Sin correo");
    setAgroPoints(0);
    setUltimoPremio("Sin premios");
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

  const menuItems = [
    {
      title: "Mis compras",
      icon: "basket-outline",
      route: "/perfil/compras",
    },
    {
      title: "Favoritos",
      icon: "heart-outline",
      route: "/perfil/favoritos",
    },
    {
      title: "Configuración",
      icon: "settings-outline",
      route: "/perfil/configuracion",
    },
    {
      title: "Cerrar sesión",
      icon: "log-out-outline",
      color: "#ef4444",
      action: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#0f172a", "#16a34a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mi Perfil</Text>

        <TouchableOpacity
          onPress={() =>
            router.push("/perfil/configuracion")
          }
        >
          <Ionicons
            name="cog-outline"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* AVATAR */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://i.pravatar.cc/150?img=12",
              }}
              style={styles.avatar}
            />

            <TouchableOpacity style={styles.editBtn}>
              <Ionicons
                name="camera"
                size={16}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.nameText}>{nombre}</Text>
          <Text style={styles.emailText}>{correo}</Text>
        </View>

        {/* TARJETA DE RECOMPENSAS */}
        <View style={styles.rewardsCard}>
          {/* AgroPoints */}
          <View style={styles.rewardItem}>
            <View
              style={[
                styles.rewardIcon,
                { backgroundColor: "#f0fdf4" },
              ]}
            >
              <MaterialCommunityIcons
                name="leaf"
                size={26}
                color="#16a34a"
              />
            </View>

            <Text style={styles.rewardLabel}>
              AgroPoints
            </Text>

            <Text style={styles.rewardValue}>
              {agroPoints}
            </Text>
          </View>

          <View style={styles.verticalDivider} />

          {/* Último Premio */}
          <View style={styles.rewardItem}>
            <View
              style={[
                styles.rewardIcon,
                { backgroundColor: "#fff7ed" },
              ]}
            >
              <MaterialCommunityIcons
                name="gift-outline"
                size={26}
                color="#f59e0b"
              />
            </View>

            <Text style={styles.rewardLabel}>
              Último Premio
            </Text>

            <Text
              style={styles.rewardValueSmall}
              numberOfLines={2}
            >
              {ultimoPremio}
            </Text>
          </View>
        </View>

        {/* MENÚ */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuOption,
                index === menuItems.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
              onPress={() =>
                item.action
                  ? item.action()
                  : router.push(item.route as any)
              }
            >
              <View style={styles.menuLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    item.color
                      ? {
                          backgroundColor:
                            "#fef2f2",
                        }
                      : null,
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={
                      item.color || "#16a34a"
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.menuText,
                    item.color
                      ? { color: item.color }
                      : null,
                  ]}
                >
                  {item.title}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#cbd5e1"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* BANNER */}
        <LinearGradient
          colors={["#f0fdf4", "#ffffff"]}
          style={styles.infoBanner}
        >
          <MaterialCommunityIcons
            name="sprout"
            size={24}
            color="#16a34a"
          />

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              AgroTech Marketplace
            </Text>

            <Text style={styles.infoSubtitle}>
              ¡Sigue acumulando puntos para
              obtener descuentos exclusivos
              en tus próximas compras!
            </Text>
          </View>
        </LinearGradient>
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
    paddingTop: 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  scroll: {
    paddingBottom: 40,
    paddingTop: 20,
  },

  // Avatar
  avatarSection: {
    alignItems: "center",
    marginBottom: 25,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 115,
    height: 115,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },

  editBtn: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#16a34a",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 5,
  },

  nameText: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },

  emailText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
  },

  // Rewards Card
  rewardsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 25,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 5 },
  },

  rewardItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  rewardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  rewardLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "center",
  },

  rewardValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#16a34a",
    marginTop: 4,
  },

  rewardValueSmall: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginTop: 4,
  },

  verticalDivider: {
    width: 1,
    height: 70,
    backgroundColor: "#f1f5f9",
  },

  // Menu
  menuCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 5,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    marginBottom: 25,
  },

  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    backgroundColor: "#f0fdf4",
    padding: 10,
    borderRadius: 14,
    marginRight: 15,
  },

  menuText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
  },

  // Info Banner
  infoBanner: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dcfce7",
  },

  infoContent: {
    flex: 1,
    marginLeft: 15,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#16a34a",
  },

  infoSubtitle: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
    marginTop: 2,
  },
});