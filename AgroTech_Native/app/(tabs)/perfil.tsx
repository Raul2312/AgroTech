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

export default function Perfil() {
  const router = useRouter();

  const [nombre, setNombre] = useState("Cargando...");
  const [correo, setCorreo] = useState("");
  const [agroPoints, setAgroPoints] = useState(0);
  const [ultimoPremio, setUltimoPremio] = useState("Sin premios");

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const session = await AsyncStorage.getItem("agroSession");

          if (session) {
            const parsed = JSON.parse(session);
            const user = parsed.user;

            setNombre(user?.name || user?.nombre || user?.usuario || "Usuario");
            setCorreo(user?.email || user?.correo || "Sin correo");

            const userEmail = user?.email || user?.correo || "guest";
            const spinKey = `daily_spin_data_${userEmail}`;
            const spinRaw = await AsyncStorage.getItem(spinKey);

            if (spinRaw) {
              const spinData = JSON.parse(spinRaw);
              setAgroPoints(spinData.points || 0);

              if (spinData.lastReward) {
                const reward = spinData.lastReward;
                if (reward.type === "points") {
                  setUltimoPremio(`${reward.value} AgroPoints`);
                } else if (reward.type === "discount") {
                  setUltimoPremio(`${reward.value}% OFF`);
                } else {
                  setUltimoPremio("Envío gratis");
                }
              }
            }
          } else {
            setNombre("No logueado");
            setAgroPoints(0);
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

  const menuItems = [
    { title: "Mis compras", icon: "basket-outline", route: "/perfil/compras" },
    { title: "Favoritos", icon: "heart-outline", route: "/perfil/favoritos" },
    { title: "Configuración", icon: "settings-outline", route: "/perfil/configuracion" },
    { title: "Cerrar sesión", icon: "log-out-outline", color: "#ef4444", action: handleLogout },
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
        <TouchableOpacity onPress={() => router.push("/perfil/configuracion")}>
           <Ionicons name="cog-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* SECCIÓN AVATAR */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.nameText}>{nombre}</Text>
          <Text style={styles.emailText}>{correo}</Text>
        </View>

        {/* TARJETA DE RECOMPENSAS (REDISEÑADA) */}
        <View style={styles.rewardsCard}>
          <View style={styles.rewardItem}>
            <View style={[styles.rewardIcon, { backgroundColor: '#f0fdf4' }]}>
              <MaterialCommunityIcons name="leaf" size={26} color="#16a34a" />
            </View>
            <Text style={styles.rewardLabel}>AgroPoints</Text>
            <Text style={styles.rewardValue}>{agroPoints}</Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.rewardItem}>
            <View style={[styles.rewardIcon, { backgroundColor: '#fff7ed' }]}>
              <MaterialCommunityIcons name="gift-outline" size={26} color="#f59e0b" />
            </View>
            <Text style={styles.rewardLabel}>Último Premio</Text>
            <Text style={styles.rewardValueSmall}>{ultimoPremio}</Text>
          </View>
        </View>

        {/* MENÚ DE OPCIONES */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuOption, index === menuItems.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => item.action ? item.action() : router.push(item.route as any)}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.iconContainer, item.color ? { backgroundColor: '#fef2f2' } : null]}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={20} 
                    color={item.color || "#16a34a"} 
                  />
                </View>
                <Text style={[styles.menuText, item.color ? { color: item.color } : null]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* BANNER INFORMATIVO */}
        <LinearGradient
          colors={["#f0fdf4", "#ffffff"]}
          style={styles.infoBanner}
        >
          <MaterialCommunityIcons name="sprout" size={24} color="#16a34a" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>AgroTech Marketplace</Text>
            <Text style={styles.infoSubtitle}>
              ¡Sigue acumulando puntos para obtener descuentos exclusivos en tus próximas semillas!
            </Text>
          </View>
        </LinearGradient>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
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
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  scroll: { paddingBottom: 40, paddingTop: 20 },

  avatarSection: { alignItems: "center", marginBottom: 25 },
  avatarWrapper: { position: "relative" },
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
    borderColor: '#fff',
    elevation: 5,
  },
  nameText: { marginTop: 12, fontSize: 22, fontWeight: "800", color: "#0f172a" },
  emailText: { color: "#64748b", fontSize: 14, fontWeight: '500' },

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
  rewardItem: { flex: 1, alignItems: "center" },
  rewardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  rewardLabel: { fontSize: 11, color: "#94a3b8", fontWeight: '700', textTransform: 'uppercase' },
  rewardValue: { fontSize: 28, fontWeight: "900", color: "#16a34a" },
  rewardValueSmall: { fontSize: 15, fontWeight: "700", color: "#1e293b", textAlign: "center", marginTop: 2 },
  verticalDivider: { width: 1, height: 70, backgroundColor: "#f1f5f9" },

  menuCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 5,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    marginBottom: 25
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
  menuLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    backgroundColor: "#f0fdf4",
    padding: 10,
    borderRadius: 14,
    marginRight: 15,
  },
  menuText: { fontSize: 16, fontWeight: "700", color: "#334155" },

  infoBanner: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcfce7'
  },
  infoContent: { flex: 1, marginLeft: 15 },
  infoTitle: { fontSize: 14, fontWeight: '800', color: '#16a34a' },
  infoSubtitle: { fontSize: 12, color: '#475569', lineHeight: 18, marginTop: 2 }
});