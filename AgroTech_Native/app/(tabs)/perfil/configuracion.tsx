import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Configuracion() {
  const router = useRouter();

  const [notificaciones, setNotificaciones] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [ubicacion, setUbicacion] = useState(true);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [estadoCuenta, setEstadoCuenta] = useState("Activo");
  const [avatar, setAvatar] = useState(
    "https://i.pravatar.cc/150?img=12"
  );

  useEffect(() => {
    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  const loadUser = async () => {
    try {
      const session = await AsyncStorage.getItem("agroSession");

      if (!session) {
        router.replace("/(tabs)/login");
        return;
      }

      const parsed = JSON.parse(session);
      const user = parsed.user || parsed.usuario;

      setUserId(
        user?.id_usuario ||
          user?.id ||
          user?.id_cliente ||
          null
      );

      setNombre(user?.nombre || user?.name || "");
      setApellido(user?.apellido || user?.last_name || "");
      setCorreo(user?.email || user?.correo || "");
      setTelefono(user?.telefono || user?.phone || "");
      setEstadoCuenta(user?.estado_cuenta || "Activo");

      if (user?.avatar) {
        setAvatar(user.avatar);
      }
    } catch (error) {
      console.log("Error cargando usuario", error);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadUser();
    } finally {
      setRefreshing(false);
    }
  };

  const saveProfile = async () => {
    try {
      if (!userId) {
        Alert.alert("Error", "No se encontró el usuario");
        return;
      }

      setLoading(true);

      const response = await fetch(
        `https://api.agrootech.com.mx/api/usuarios/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            apellido,
            telefono,
            estado_cuenta: estadoCuenta,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "No se pudo actualizar");
      }

      await loadUser();

      Alert.alert(
        "Perfil actualizado",
        "Tus datos se guardaron correctamente"
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "No se pudo actualizar el perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        modoOscuro && { backgroundColor: "#020617" },
      ]}
    >
      <LinearGradient colors={["#0f172a", "#14532d"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Configuración</Text>

        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#16a34a"]}
            tintColor="#16a34a"
          />
        }
      >
        {/* CARD PERFIL */}
        <View
          style={[
            styles.card,
            modoOscuro && { backgroundColor: "#1e293b" },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              modoOscuro && { color: "#f1f5f9" },
            ]}
          >
            Editar Perfil
          </Text>

          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />

            <TouchableOpacity style={styles.changePhotoBtn}>
              <Ionicons name="camera-outline" size={18} color="#fff" />
              <Text style={styles.changePhotoText}>Cambiar foto</Text>
            </TouchableOpacity>
          </View>

          {/* INPUTS */}
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                modoOscuro && { color: "#cbd5f5" },
              ]}
            >
              Nombre
            </Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre"
              placeholderTextColor="#94a3b8"
              style={[
                styles.input,
                modoOscuro && {
                  backgroundColor: "#020617",
                  color: "#fff",
                  borderColor: "#334155",
                },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                modoOscuro && { color: "#cbd5f5" },
              ]}
            >
              Apellido
            </Text>
            <TextInput
              value={apellido}
              onChangeText={setApellido}
              placeholder="Tu apellido"
              placeholderTextColor="#94a3b8"
              style={[
                styles.input,
                modoOscuro && {
                  backgroundColor: "#020617",
                  color: "#fff",
                  borderColor: "#334155",
                },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                modoOscuro && { color: "#cbd5f5" },
              ]}
            >
              Correo
            </Text>
            <TextInput
              value={correo}
              editable={false}
              placeholder="Tu correo"
              style={[
                styles.input,
                styles.disabledInput,
                modoOscuro && {
                  backgroundColor: "#020617",
                  color: "#94a3b8",
                },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                modoOscuro && { color: "#cbd5f5" },
              ]}
            >
              Teléfono
            </Text>
            <TextInput
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Tu teléfono"
              keyboardType="phone-pad"
              placeholderTextColor="#94a3b8"
              style={[
                styles.input,
                modoOscuro && {
                  backgroundColor: "#020617",
                  color: "#fff",
                  borderColor: "#334155",
                },
              ]}
            />
          </View>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={saveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="save-outline"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.saveBtnText}>
                  Guardar cambios
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* CARD PREFERENCIAS */}
        <View
          style={[
            styles.card,
            modoOscuro && { backgroundColor: "#1e293b" },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              modoOscuro && { color: "#f1f5f9" },
            ]}
          >
            Preferencias
          </Text>

          <View
            style={[
              styles.option,
              modoOscuro && { borderBottomColor: "#334155" },
            ]}
          >
            <View style={styles.optionLeft}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#16a34a"
              />
              <Text
                style={[
                  styles.optionText,
                  modoOscuro && { color: "#f1f5f9" },
                ]}
              >
                Notificaciones
              </Text>
            </View>

            <Switch
              value={notificaciones}
              onValueChange={setNotificaciones}
              trackColor={{ false: "#cbd5e1", true: "#16a34a" }}
            />
          </View>

          <View
            style={[
              styles.option,
              modoOscuro && { borderBottomColor: "#334155" },
            ]}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="moon-outline" size={22} color="#16a34a" />
              <Text
                style={[
                  styles.optionText,
                  modoOscuro && { color: "#f1f5f9" },
                ]}
              >
                Modo oscuro
              </Text>
            </View>

            <Switch
              value={modoOscuro}
              onValueChange={setModoOscuro}
              trackColor={{ false: "#cbd5e1", true: "#16a34a" }}
            />
          </View>

          <View style={styles.optionNoBorder}>
            <View style={styles.optionLeft}>
              <Ionicons
                name="location-outline"
                size={22}
                color="#16a34a"
              />
              <Text
                style={[
                  styles.optionText,
                  modoOscuro && { color: "#f1f5f9" },
                ]}
              >
                Ubicación
              </Text>
            </View>

            <Switch
              value={ubicacion}
              onValueChange={setUbicacion}
              trackColor={{ false: "#cbd5e1", true: "#16a34a" }}
            />
          </View>
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
    padding: 15,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 15,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },

  changePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16a34a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  changePhotoText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    marginBottom: 6,
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
  },

  disabledInput: {
    backgroundColor: "#f1f5f9",
    color: "#64748b",
  },

  statusContainer: {
    flexDirection: "row",
    gap: 10,
  },

  statusBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
  },

  statusBtnActive: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
  },

  statusBtnInactive: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
  },

  statusText: {
    fontWeight: "600",
    color: "#64748b",
  },

  statusTextActive: {
    color: "#15803d",
  },

  statusTextInactive: {
    color: "#dc2626",
  },

  saveBtn: {
    marginTop: 10,
    backgroundColor: "#16a34a",
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  optionNoBorder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
});