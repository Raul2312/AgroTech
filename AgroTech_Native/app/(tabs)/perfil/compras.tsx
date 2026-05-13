import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CompraItem {
  id: string;
  nombre: string;
  precio: number;
  fecha: string;
  estado: string;
  imagen: string;
  cantidad?: number;
}

export default function Compras() {
  const router = useRouter();
  const [compras, setCompras] = useState<CompraItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Formatear fecha actual
  const formatFecha = () => {
    const fecha = new Date();
    return fecha.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Cargar compras guardadas
  const cargarCompras = async () => {
    try {
      setLoading(true);

      // Aquí se guardan las compras después de pagar
      // Debes guardar el carrito comprado en la clave "misCompras"
      const comprasGuardadas = await AsyncStorage.getItem("misCompras");

      if (comprasGuardadas) {
        const comprasParseadas = JSON.parse(comprasGuardadas);
        setCompras(comprasParseadas);
      } else {
        setCompras([]);
      }
    } catch (error) {
      console.log("Error al cargar compras:", error);
      setCompras([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar al entrar a la pantalla
  useEffect(() => {
    cargarCompras();
  }, []);

  // Recargar cada vez que se enfoque la pantalla
  useFocusEffect(
    React.useCallback(() => {
      cargarCompras();
    }, [])
  );

  const renderItem = ({ item }: { item: CompraItem }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagen }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.nombre}</Text>

        <Text style={styles.date}>Comprado el {item.fecha}</Text>

        {item.cantidad && (
          <Text style={styles.quantity}>Cantidad: {item.cantidad}</Text>
        )}

        <View style={styles.row}>
          <Text style={styles.price}>
            ${item.precio.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>

          <View
            style={[
              styles.status,
              {
                backgroundColor:
                  item.estado === "Entregado"
                    ? "#dcfce7"
                    : item.estado === "En camino"
                    ? "#fef3c7"
                    : "#dbeafe",
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
                      : item.estado === "En camino"
                      ? "#d97706"
                      : "#2563eb",
                },
              ]}
            >
              {item.estado}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

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
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={{
            padding: 15,
            paddingBottom: 40,
            flexGrow: 1,
          }}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={cargarCompras}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="bag-check-outline"
                size={90}
                color="#cbd5e1"
              />
              <Text style={styles.emptyTitle}>
                Aún no has realizado compras
              </Text>
              <Text style={styles.emptySubtitle}>
                Cuando compres productos aparecerán aquí.
              </Text>

              <TouchableOpacity
                style={styles.shopButton}
                onPress={() => router.push("/")}
              >
                <Text style={styles.shopButtonText}>
                  Explorar productos
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </>
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
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
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
    marginBottom: 6,
  },

  quantity: {
    color: "#475569",
    fontWeight: "600",
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

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 60,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 20,
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },

  shopButton: {
    marginTop: 25,
    backgroundColor: "#16a34a",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 14,
    elevation: 4,
  },

  shopButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});