import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.16:8000/api";

export type ProductType = {
  id_productos: number;
  nombre: string;
  descripcion: string;
  precio: string;
  precio_anterior?: string;
  moneda: string;
  stock: number;
  fecha_publicacion: string;
  estado: string;
  imagen_url: string;
  categoria: {
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
  };
  rating?: number;
};

export default function Marketplace() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todos"]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [favorites, setFavorites] = useState<number[]>([]);

  const offerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(offerAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(offerAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
      ])
    ).start();
  }, []);

  // VALIDAR LOGIN
  const checkAuth = async () => {
    const session = await AsyncStorage.getItem("agroSession");

    if (!session) {
      router.push({
        pathname: "/(tabs)/login",
        params: { redirect: "index" },
      });
      return false;
    }

    return true;
  };

  const fetchProductsAndCategories = async () => {
    try {
      const resProducts = await fetch(`${API_URL}/productos`);
      const jsonProducts = await resProducts.json();
      const dataProducts = jsonProducts.data ?? jsonProducts;
      setProducts(dataProducts);

      const resCategories = await fetch(`${API_URL}/categorias`);
      const jsonCategories = await resCategories.json();
      const dataCategories = jsonCategories.data ?? jsonCategories;

      const categoryNames = [
        "Todos",
        ...dataCategories.map((c: any) => c.nombre),
      ];

      setCategories(categoryNames);
    } catch (error) {
      console.log("ERROR API:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProductsAndCategories();
  };

  const filtered = products.filter(
    (p) =>
      p &&
      p.nombre &&
      p.nombre.toLowerCase().includes(search.toLowerCase()) &&
      (category === "Todos" || p.categoria.nombre === category)
  );

  // FAVORITOS PROTEGIDOS
  const toggleFavorite = async (id: number) => {
    const isLogged = await checkAuth();

    if (!isLogged) return;

    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // CARRITO PROTEGIDO
  const handleAddToCart = async (item: ProductType) => {
    const isLogged = await checkAuth();

    if (!isLogged) return;

    addToCart({
      id: item.id_productos,
      name: item.nombre,
      price: Number(item.precio),
      image: item.imagen_url,
      quantity: 1,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <View style={{ flexDirection: "row", marginTop: 2 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Ionicons
            key={i}
            name={i < Math.round(rating) ? "star" : "star-outline"}
            size={14}
            color="#f59e0b"
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Cargando productos...</Text>
      </View>
    );
  }

  const categoryIcons: Record<string, string> = {
    Todos: "🔠",
    Bovino: "🐄",
    Herramientas: "🛠️",
    Servicios: "⚙️",
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0f172a", "#14532d"]} style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            source={require("../../assets/images/agro.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>AgroTech MarketPlace</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchBox}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={18}
            color="#16a34a"
            style={{ marginRight: 10 }}
          />

          <TextInput
            placeholder="Buscar productos..."
            placeholderTextColor="#64748b"
            style={styles.search}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={styles.categoriesBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const icon = categoryIcons[item] ?? "🛒";

            return (
              <TouchableOpacity
                onPress={() => setCategory(item)}
                style={[
                  styles.categoryPill,
                  category === item && styles.categoryActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === item && styles.categoryTextActive,
                  ]}
                >
                  {icon} {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id_productos.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#16a34a"]}
          />
        }
        renderItem={({ item }) => {
          const rating = item.rating ?? Math.random() * 2 + 3;

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.cardWrapper}
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
              <View style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.imagen_url }}
                    style={styles.productImg}
                  />

                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.6)"]}
                    style={styles.imageOverlay}
                  />

                  <TouchableOpacity
                    style={styles.favorite}
                    onPress={() => toggleFavorite(item.id_productos)}
                  >
                    <Ionicons
                      name={
                        favorites.includes(item.id_productos)
                          ? "heart"
                          : "heart-outline"
                      }
                      size={20}
                      color={
                        favorites.includes(item.id_productos)
                          ? "#ef4444"
                          : "#fff"
                      }
                    />
                  </TouchableOpacity>

                  {Number(item.precio) < 50 && (
                    <View style={styles.offerTag}>
                      <Text style={styles.offerText}>🔥 Oferta</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardContent}>
                  <Text numberOfLines={4} style={styles.productName}>
                    {item.nombre}
                  </Text>

                  <View style={styles.ratingRow}>
                    {renderStars(rating)}
                    <Text style={styles.ratingText}>
                      {rating.toFixed(1)}
                    </Text>
                  </View>

                  <View style={styles.locationRow}>
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color="#94a3b8"
                    />
                    <Text style={styles.locationText}>Chihuahua, MX</Text>
                  </View>

                  <View style={styles.priceRow}>
                    {item.precio_anterior && (
                      <Text style={styles.oldPrice}>
                        ${Number(item.precio_anterior).toFixed(2)}
                      </Text>
                    )}

                    <Text style={styles.price}>
                      ${Number(item.precio).toFixed(2)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.cartBtn}
                  onPress={() => handleAddToCart(item)}
                >
                  <Ionicons name="add" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 35,
    height: 35,
    marginRight: 10,
  },

  logoText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  searchBox: {
    padding: 15,
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    elevation: 4,
  },

  search: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },

  categoriesBar: {
    paddingVertical: 10,
    paddingLeft: 10,
  },

  categoryPill: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },

  categoryActive: {
    backgroundColor: "#16a34a",
  },

  categoryText: {
    fontWeight: "600",
    color: "#1e293b",
  },

  categoryTextActive: {
    color: "white",
  },

  cardWrapper: {
    flex: 1,
    padding: 8,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    elevation: 8,
  },

  imageContainer: {
    position: "relative",
  },

  productImg: {
    width: "100%",
    height: 150,
  },

  imageOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
  },

  favorite: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 6,
    borderRadius: 50,
  },

  offerTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  offerText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  cardContent: {
    padding: 10,
  },

  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  ratingText: {
    fontSize: 12,
    marginLeft: 5,
    color: "#475569",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  locationText: {
    fontSize: 11,
    color: "#94a3b8",
    marginLeft: 4,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a",
  },

  oldPrice: {
    fontSize: 13,
    color: "#94a3b8",
    textDecorationLine: "line-through",
    marginRight: 6,
  },

  cartBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#16a34a",
    width: 38,
    height: 38,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});