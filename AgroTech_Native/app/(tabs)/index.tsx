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
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";

const API_URL = "http://192.168.1.6:8000/api";

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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [favorites, setFavorites] = useState<number[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Animación para OFERTA
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

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const resProducts = await fetch(`${API_URL}/productos`);
        const jsonProducts = await resProducts.json();
        const dataProducts = jsonProducts.data ?? jsonProducts;
        setProducts(dataProducts);

        const resCategories = await fetch(`${API_URL}/categorias`);
        const jsonCategories = await resCategories.json();
        const dataCategories = jsonCategories.data ?? jsonCategories;
        const categoryNames = ["Todos", ...dataCategories.map((c: any) => c.nombre)];
        setCategories(categoryNames);
      } catch (error) {
        console.log("ERROR API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const filtered = products.filter(
    (p) =>
      p &&
      p.nombre &&
      p.nombre.toLowerCase().includes(search.toLowerCase()) &&
      (category === "Todos" || p.categoria.nombre === category)
  );

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleAddToCart = (item: ProductType) => {
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
        {Array.from({ length: 5 }, (_, i) => {
          const scale = new Animated.Value(0);
          Animated.timing(scale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            delay: i * 150,
          }).start();
          return (
            <Animated.View key={i} style={{ transform: [{ scale }] }}>
              <Ionicons
                name={i < Math.round(rating) ? "star" : "star-outline"}
                size={14}
                color="#f59e0b"
              />
            </Animated.View>
          );
        })}
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

  const offerBg = offerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f87171", "#fbbf24"], // rojo → amarillo glow
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#0f172a", "#14532d"]} style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            source={require("../../assets/images/agro.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>AgroTech MarketPlace</Text>
        </View>
      </LinearGradient>

      {/* Buscador */}
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

      {/* Categorías */}
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

      {/* Productos */}
      <Animated.FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id_productos.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity
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
              {/* Oferta animada */}
              {Number(item.precio) < 50 && (
                <Animated.View style={[styles.offerTag, { backgroundColor: offerBg }]}>
                  <Text style={styles.offerText}>OFERTA</Text>
                </Animated.View>
              )}

              {/* Imagen */}
              <Image
                source={{ uri: item.imagen_url }}
                style={styles.productImg}
                resizeMode="cover"
              />

              {/* Favorito */}
              <TouchableOpacity
                style={styles.favorite}
                onPress={() => toggleFavorite(item.id_productos)}
              >
                <Ionicons
                  name={favorites.includes(item.id_productos) ? "heart" : "heart-outline"}
                  size={22}
                  color={favorites.includes(item.id_productos) ? "#ef4444" : "#333"}
                />
              </TouchableOpacity>

              {/* Nombre y precio */}
              <View style={styles.cardContent}>
                <Text style={styles.productName}>{item.nombre}</Text>

                {/* Estrellitas */}
                {item.rating && renderStars(item.rating)}

                {/* Precio anterior y actual */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                  {item.precio_anterior && (
                    <Text style={styles.oldPrice}>
                      ${Number(item.precio_anterior).toFixed(2)}
                    </Text>
                  )}
                  <Text style={styles.price}>
                    ${Number(item.precio).toFixed(2)} {item.moneda}
                  </Text>
                </View>
              </View>

              {/* Botón agregar */}
              <TouchableOpacity
                style={styles.btn}
                onPress={() => handleAddToCart(item)}
              >
                <Ionicons name="cart-outline" size={18} color="white" />
                <Text style={styles.btnText}> Agregar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 55, paddingHorizontal: 20, paddingBottom: 15 },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 35, height: 35, marginRight: 10 },
  logoText: { color: "white", fontSize: 18, fontWeight: "bold" },
  searchBox: { padding: 15 },
  searchWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "white", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15, elevation: 4 },
  search: { flex: 1, fontSize: 16, color: "#1e293b" },
  categoriesBar: { backgroundColor: "#f3f4f6", paddingVertical: 10, paddingLeft: 10 },
  categoryPill: { backgroundColor: "white", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  categoryActive: { backgroundColor: "#16a34a" },
  categoryText: { fontWeight: "600", color: "#1e293b" },
  categoryTextActive: { color: "white" },
  cardWrapper: { flex: 1, padding: 5 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    position: "relative",
    // altura automática según contenido
  },
  offerTag: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  offerText: { color: "#fff", fontWeight: "bold", fontSize: 10 },
  productImg: { width: "100%", height: 140, borderRadius: 14 },
  cardContent: { padding: 10 },
  productName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#111",
    marginBottom: 2,
    flexWrap: "wrap",
    lineHeight: 18,
  },
  price: { fontSize: 16, color: "#16a34a", fontWeight: "bold", marginLeft: 6 },
  oldPrice: { fontSize: 14, color: "#64748b", textDecorationLine: "line-through" },
  btn: {
    backgroundColor: "#16a34a",
    marginHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  btnText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  favorite: { position: "absolute", top: 10, right: 10, zIndex: 10 },
});