import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Favoritos() {
  const router = useRouter();

  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    try {
      const session = await AsyncStorage.getItem("agroSession");

      if (!session) {
        router.replace("/(tabs)/login");
        return;
      }

      const savedFavorites = await AsyncStorage.getItem("agroFavorites");

      if (!savedFavorites) {
        setFavorites([]);
        setFavoriteIds([]);
        return;
      }

      const parsedFavorites = JSON.parse(savedFavorites);

      setFavoriteIds(parsedFavorites);

      if (parsedFavorites.length === 0) {
        setFavorites([]);
        return;
      }

      const response = await fetch(
        "https://api.agrootech.com.mx/api/productos"
      );

      const data = await response.json();
      const allProducts = data.data ?? data;

      const filteredFavorites = allProducts.filter((product: any) =>
        parsedFavorites.includes(product.id_productos)
      );

      setFavorites(filteredFavorites);
    } catch (error) {
      console.log("Error cargando favoritos", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const removeFavorite = async (id: number) => {
    try {
      const savedFavorites = await AsyncStorage.getItem("agroFavorites");

      if (!savedFavorites) return;

      const parsedFavorites = JSON.parse(savedFavorites);

      const updatedFavorites = parsedFavorites.filter(
        (favoriteId: number) => favoriteId !== id
      );

      await AsyncStorage.setItem(
        "agroFavorites",
        JSON.stringify(updatedFavorites)
      );

      setFavoriteIds(updatedFavorites);

      setFavorites((prev) =>
        prev.filter((item) => item.id_productos !== id)
      );
    } catch (error) {
      console.log("Error eliminando favorito", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Cargando favoritos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#14532d"]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mis Favoritos</Text>
          <Text style={styles.headerSubtitle}>
            {favorites.length} productos guardados
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={onRefresh}
        >
          <Ionicons name="refresh-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id_productos.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#16a34a"]}
            tintColor="#16a34a"
          />
        }
        contentContainerStyle={{
          padding: 14,
          paddingBottom: 120,
          flexGrow: favorites.length === 0 ? 1 : 0,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={["#e2e8f0", "#f8fafc"]}
              style={styles.emptyIconCircle}
            >
              <Ionicons
                name="heart-dislike-outline"
                size={52}
                color="#94a3b8"
              />
            </LinearGradient>

            <Text style={styles.emptyTitle}>
              Aún no tienes favoritos
            </Text>

            <Text style={styles.emptySubtitle}>
              Guarda los productos que más te gusten y aparecerán aquí para
              comprarlos después.
            </Text>

            <TouchableOpacity
              style={styles.goShopBtn}
              onPress={() => router.push("/(tabs)")}
            >
              <LinearGradient
                colors={["#16a34a", "#15803d"]}
                style={styles.goShopGradient}
              >
                <Ionicons name="storefront-outline" size={18} color="#fff" />
                <Text style={styles.goShopText}>Ir al Marketplace</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.92}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/producto/[id]",
                params: {
                  id: item.id_productos,
                  producto: JSON.stringify(item),
                },
              })
            }
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.imagen_url }}
                style={styles.image}
              />

              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.45)"]}
                style={styles.imageOverlay}
              />

              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {item.categoria?.nombre || "Producto"}
                </Text>
              </View>
            </View>

            <View style={styles.info}>
              <View>
                <Text numberOfLines={2} style={styles.name}>
                  {item.nombre}
                </Text>

                <Text numberOfLines={1} style={styles.description}>
                  {item.descripcion}
                </Text>
              </View>

              <View style={styles.bottomRow}>
                <View>
                  <Text style={styles.priceLabel}>Precio</Text>
                  <Text style={styles.price}>
                    ${Number(item.precio).toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => removeFavorite(item.id_productos)}
                >
                  <Ionicons name="heart" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },

  loadingText: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 15,
    fontWeight: "600",
  },

  header: {
    paddingTop: 44,
    paddingBottom: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIconCircle: {
    width: 95,
    height: 95,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
  },

  emptySubtitle: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },

  goShopBtn: {
    marginTop: 22,
    borderRadius: 14,
    overflow: "hidden",
  },

  goShopGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  goShopText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 8,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    marginBottom: 14,
    overflow: "hidden",
    elevation: 5,
    flexDirection: "row",
    height: 132,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  imageWrapper: {
    width: 118,
    height: 132,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },

  imageOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 35,
  },

  categoryBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#16a34a",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },

  categoryBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },

  info: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: "space-between",
  },

  name: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 20,
  },

  description: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 16,
    marginTop: 2,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
  },

  priceLabel: {
    fontSize: 10,
    color: "#94a3b8",
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16a34a",
    marginTop: 2,
  },

  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ef4444",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },
});