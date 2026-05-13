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
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DailySpinWheel from "../../components/DailySpinWheel";

const API_URL = "https://api.agrootech.com.mx/api";
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

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
  const [showSpin, setShowSpin] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Header colapsable: Mínimo 185 para que no choque con el logo
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [300, 185], 
    extrapolate: "clamp",
  });

  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const searchTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 5], 
    extrapolate: "clamp",
  });

  useEffect(() => {
    fetchProductsAndCategories();
    loadFavorites();
    checkSpinVisibility();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("agroFavorites");
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch (e) { console.log(e); }
  };

  const checkAuth = async () => {
    const session = await AsyncStorage.getItem("agroSession");
    if (!session) {
      router.push({ pathname: "/(tabs)/login", params: { redirect: "index" } });
      return false;
    }
    return true;
  };

  const checkSpinVisibility = async () => {
    try {
      const session = await AsyncStorage.getItem("agroSession");
      if (!session) return;
      const parsed = JSON.parse(session);
      const user = parsed.user;
      const correo = user?.email || user?.correo || "guest";
      const spinKey = `dailySpinSeen_${correo}`;
      const alreadySeenToday = await AsyncStorage.getItem(spinKey);
      if (alreadySeenToday !== new Date().toDateString()) {
        setTimeout(() => setShowSpin(true), 800);
      }
    } catch (e) { console.log(e); }
  };

  const handleCloseSpin = async () => {
    const session = await AsyncStorage.getItem("agroSession");
    if (session) {
      const parsed = JSON.parse(session);
      await AsyncStorage.setItem(`dailySpinSeen_${parsed.user?.email || "guest"}`, new Date().toDateString());
    }
    setShowSpin(false);
  };

  const fetchProductsAndCategories = async () => {
    try {
      const resProducts = await fetch(`${API_URL}/productos`);
      const jsonProducts = await resProducts.json();
      setProducts(jsonProducts.data ?? jsonProducts);
      const resCategories = await fetch(`${API_URL}/categorias`);
      const jsonCategories = await resCategories.json();
      const dataCategories = jsonCategories.data ?? jsonCategories;
      setCategories(["Todos", ...dataCategories.map((c: any) => c.nombre)]);
    } catch (error) { console.log("ERROR API:", error); } 
    finally { setLoading(false); setRefreshing(false); }
  };

  // Función para refrescar
  const onRefresh = () => {
    setRefreshing(true);
    fetchProductsAndCategories();
    loadFavorites();
  };

  const filtered = products.filter(p => 
    p?.nombre?.toLowerCase().includes(search.toLowerCase()) && 
    (category === "Todos" || p.categoria.nombre === category)
  );

  const toggleFavorite = async (id: number) => {
    if (!(await checkAuth())) return;
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    await AsyncStorage.setItem("agroFavorites", JSON.stringify(updated));
  };

  const handleAddToCart = async (item: ProductType) => {
    if (!(await checkAuth())) return;
    addToCart({ id: item.id_productos, name: item.nombre, price: Number(item.precio), image: item.imagen_url, quantity: 1 });
  };

  const renderStars = (rating: number) => (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }, (_, i) => (
        <Ionicons key={i} name={i < Math.round(rating) ? "star" : "star-outline"} size={14} color="#F59E0B" />
      ))}
    </View>
  );

  if (loading) return <View style={styles.loading}><Text>Cargando productos...</Text></View>;

  const categoryIcons: Record<string, string> = {
    Todos: "🔠",
    Bovino: "🐄",
    Herramientas: "🛠️",
    Servicios: "⚙️",
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER PREMIUM ANIMADO */}
      <AnimatedGradient
        colors={["#0B1220", "#0F3D2E", "#16A34A"]}
        style={[styles.header, { height: headerHeight }]}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.logoRow}>
            <View style={styles.logoContainer}>
              <Image source={require("../../assets/images/agro.png")} style={styles.logo} />
            </View>
            <View>
              <Text style={styles.headerTitle}>AgroTech</Text>
              <Animated.View style={{ opacity: heroOpacity }}>
                <Text style={styles.headerSubtitle}>Marketplace Ganadero</Text>
              </Animated.View>
            </View>
          </View>

          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <Animated.View style={{ 
          opacity: heroOpacity, 
          height: scrollY.interpolate({ inputRange: [0, 80], outputRange: [90, 0], extrapolate: 'clamp' }),
          overflow: 'hidden' 
        }}>
          <Text style={styles.heroTitle}>Todo para tu rancho</Text>
          <Text style={styles.heroSubtitle}>Compra ganado, herramientas y servicios.</Text>
        </Animated.View>

        <Animated.View style={[styles.searchWrapper, { transform: [{ translateY: searchTranslateY }] }]}>
          <Ionicons name="search" size={20} color="#16A34A" />
          <TextInput
            placeholder="Buscar productos..."
            placeholderTextColor="#94A3B8"
            style={styles.search}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </AnimatedGradient>

      {/* CATEGORÍAS */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => {
            const icon = categoryIcons[item] ?? "🛒";
            return (
              <TouchableOpacity
                onPress={() => setCategory(item)}
                style={[styles.categoryChip, category === item && styles.categoryChipActive]}
              >
                <Text style={[styles.categoryChipText, category === item && styles.categoryChipTextActive]}>
                  {icon} {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <DailySpinWheel visible={showSpin} onClose={handleCloseSpin} />

      {/* PRODUCTOS CON REFRESH CONTROL */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id_productos.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#16A34A"]}
            tintColor="#16A34A"
          />
        }
        renderItem={({ item }) => {
          const rating = item.rating ?? Math.random() * 2 + 3;
          return (
            <TouchableOpacity 
              style={styles.cardWrapper} 
              onPress={() => router.push({ pathname: "/producto/[id]", params: { id: item.id_productos, producto: JSON.stringify(item) } })}
            >
              <View style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.imagen_url }} style={styles.productImg} resizeMode="cover" />
                  <TouchableOpacity style={styles.favorite} onPress={() => toggleFavorite(item.id_productos)}>
                    <Ionicons name={favorites.includes(item.id_productos) ? "heart" : "heart-outline"} size={18} color={favorites.includes(item.id_productos) ? "#EF4444" : "#FFFFFF"} />
                  </TouchableOpacity>
                  {item.precio_anterior && (
                    <View style={styles.offerTag}><Text style={styles.offerText}>🔥 Oferta</Text></View>
                  )}
                </View>
                <View style={styles.cardContent}>
                  <Text numberOfLines={2} style={styles.productName}>{item.nombre}</Text>
                  <View style={styles.ratingRow}>{renderStars(rating)}<Text style={styles.ratingText}>{rating.toFixed(1)}</Text></View>
                  <View style={styles.locationRow}><Ionicons name="location-outline" size={12} color="#94A3B8" /><Text style={styles.locationText}>Chihuahua, México</Text></View>
                  <View style={styles.bottomRow}>
                    <View style={styles.priceBlock}>
                      {item.precio_anterior && <Text style={styles.oldPrice}>${Number(item.precio_anterior).toFixed(2)}</Text>}
                      <Text style={styles.price}>${Number(item.precio).toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity style={styles.cartBtn} onPress={() => handleAddToCart(item)}>
                      <LinearGradient colors={["#16A34A", "#15803D"]} style={styles.cartGradient}><Ionicons name="bag-add-outline" size={18} color="#fff" /></LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// TUS ESTILOS ORIGINALES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingTop: 50, paddingHorizontal: 15, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 12, zIndex: 100 },
  headerTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoContainer: { width: 50, height: 50, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center", marginRight: 12 },
  logo: { width: 30, height: 30 },
  headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
  headerSubtitle: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  notificationBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.12)", justifyContent: "center", alignItems: "center" },
  notificationDot: { position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" },
  heroTitle: { color: "#FFFFFF", fontSize: 28, fontWeight: "800", marginBottom: 6 },
  heroSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 14, marginBottom: 20 },
  searchWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, paddingLeft: 16, paddingRight: 8, height: 56, elevation: 6 },
  search: { flex: 1, marginLeft: 10, color: "#0F172A", fontSize: 15, fontWeight: "500" },
  filterBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#16A34A", justifyContent: "center", alignItems: "center" },
  categoriesContainer: { marginTop: 18, marginBottom: 6 },
  categoryChip: { backgroundColor: "#FFFFFF", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, marginRight: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  categoryChipActive: { backgroundColor: "#16A34A", borderColor: "#16A34A" },
  categoryChipText: { color: "#334155", fontWeight: "700", fontSize: 13 },
  categoryChipTextActive: { color: "#FFFFFF" },
  listContent: { paddingHorizontal: 12, paddingBottom: 120, paddingTop: 8 },
  columnWrapper: { justifyContent: "space-between" },
  cardWrapper: { width: "48%", marginBottom: 16 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 24, overflow: "hidden", elevation: 8 },
  imageContainer: { position: "relative" },
  productImg: { width: "100%", height: 165 },
  favorite: { position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(15,23,42,0.55)", justifyContent: "center", alignItems: "center" },
  offerTag: { position: "absolute", top: 10, left: 10, backgroundColor: "#EF4444", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  offerText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  cardContent: { padding: 12 },
  productName: { fontSize: 14, fontWeight: "800", color: "#0F172A", minHeight: 38 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingText: { fontSize: 12, color: "#475569", marginLeft: 6 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { fontSize: 11, color: "#94A3B8", marginLeft: 4 },
  bottomRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 12 },
  priceBlock: { flex: 1 },
  oldPrice: { fontSize: 11, color: "#94A3B8", textDecorationLine: "line-through" },
  price: { fontSize: 18, fontWeight: "900", color: "#16A34A" },
  cartBtn: { marginLeft: 6 },
  cartGradient: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  starsRow: { flexDirection: "row" },
});