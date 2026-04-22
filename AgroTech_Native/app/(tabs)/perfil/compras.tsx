import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Compras() {
  const router = useRouter();

  const compras = [
    {
      id: "1",
      nombre: "Alimento Premium Bovino",
      precio: 2240,
      fecha: "12 Abril 2026",
      estado: "Entregado",
      imagen:
        "https://images.unsplash.com/photo-1560493676-04071c5f467b",
    },
    {
      id: "2",
      nombre: "Kit de Herramientas Agrícolas",
      precio: 1391,
      fecha: "08 Abril 2026",
      estado: "En camino",
      imagen:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    },
    {
      id: "3",
      nombre: "Semillas Premium",
      precio: 850,
      fecha: "01 Abril 2026",
      estado: "Entregado",
      imagen:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0f172a", "#14532d"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mis Compras</Text>

        <View style={{ width: 24 }} />
      </LinearGradient>

      <FlatList
        data={compras}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagen }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name}>{item.nombre}</Text>

              <Text style={styles.date}>Comprado el {item.fecha}</Text>

              <View style={styles.row}>
                <Text style={styles.price}>${item.precio.toFixed(2)}</Text>

                <View
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                        item.estado === "Entregado"
                          ? "#dcfce7"
                          : "#fef3c7",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          item.estado === "Entregado"
                            ? "#16a34a"
                            : "#d97706",
                      },
                    ]}
                  >
                    {item.estado}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
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

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 6,
  },

  image: {
    width: "100%",
    height: 180,
  },

  info: {
    padding: 15,
  },

  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 5,
  },

  date: {
    color: "#64748b",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#16a34a",
  },

  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontWeight: "bold",
    fontSize: 12,
  },
});
