import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

type ProductoType = {
  id_productos: number;
  nombre: string;
  descripcion: string;
  precio: string;
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
};

export default function Producto() {
  const router = useRouter();
  const { producto } = useLocalSearchParams<{ producto: string }>();
  const { addToCart } = useCart();

  const [added, setAdded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const prod: ProductoType = producto ? JSON.parse(producto) : null;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const checkAuth = async () => {
    const session = await AsyncStorage.getItem("agroSession");
    if (!session) {
      router.push({ pathname: "/(tabs)/login", params: { redirect: "producto" } });
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    animateButton();
    if (!(await checkAuth()) || !prod) return;
    addToCart({ id: prod.id_productos, name: prod.nombre, price: Number(prod.precio), image: prod.imagen_url, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleBuyNow = async () => {
    animateButton();
    if (!(await checkAuth()) || !prod) return;
    addToCart({ id: prod.id_productos, name: prod.nombre, price: Number(prod.precio), image: prod.imagen_url, quantity: 1 });
    router.push("/carrito/pago");
  };

  if (!prod) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>No se encontró el producto</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerNav}>
        <TouchableOpacity style={styles.roundBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.roundBtn} onPress={() => router.push("/carrito")}>
          <Ionicons name="cart-outline" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
      >
        {/* HERO SECTION */}
        <View style={styles.imageBox}>
          <Image 
            source={{ uri: prod.imagen_url }} 
            style={styles.mainImage} 
            resizeMode="contain" 
          />
          <LinearGradient 
            colors={["transparent", "rgba(248, 250, 252, 0.5)", "#f8fafc"]} 
            style={styles.imageOverlay} 
          />
        </View>

        {/* CONTENT CARD */}
        <View style={styles.contentCard}>
          <View style={styles.badgeContainer}>
             <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{prod.categoria.nombre.toUpperCase()}</Text>
             </View>
             {prod.stock > 0 && (
                <View style={[styles.categoryBadge, { backgroundColor: '#0EA5E9', marginLeft: 8 }]}>
                    <Text style={styles.categoryText}>DISPONIBLE</Text>
                </View>
             )}
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.mainTitle}>{prod.nombre}</Text>
            <TouchableOpacity><Ionicons name="heart-outline" size={28} color="#64748b" /></TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.mainPrice}>{Number(prod.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.currencyCode}>{prod.moneda}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.mainDescription}>{prod.descripcion}</Text>

          {/* SPECS GRID - Restaurado con ubicación y fecha */}
          <Text style={styles.sectionTitle}>Detalles del Producto</Text>
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <MaterialCommunityIcons name="dolly" size={22} color="#16a34a" />
              <Text style={styles.specLabel}>Existencia</Text>
              <Text style={styles.specValue}>{prod.stock} pzas</Text>
            </View>
            <View style={styles.specItem}>
              <MaterialCommunityIcons name="shield-check-outline" size={22} color="#16a34a" />
              <Text style={styles.specLabel}>Estado</Text>
              <Text style={styles.specValue}>{prod.estado}</Text>
            </View>
            <View style={styles.specItem}>
              <MaterialCommunityIcons name="map-marker-radius-outline" size={22} color="#16a34a" />
              <Text style={styles.specLabel}>Ubicación</Text>
              <Text style={styles.specValue}>Chihuahua, MX</Text>
            </View>
            <View style={styles.specItem}>
              <MaterialCommunityIcons name="calendar-range" size={22} color="#16a34a" />
              <Text style={styles.specLabel}>Publicado</Text>
              <Text style={styles.specValue}>{prod.fecha_publicacion.split('T')[0]}</Text>
            </View>
          </View>

          {added && (
            <Animated.View style={styles.successNotice}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.successText}>¡Agregado con éxito!</Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleAddToCart}>
            <Ionicons name="cart-outline" size={22} color="#16a34a" />
            <Text style={styles.secondaryBtnText}>Carrito</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleBuyNow}>
          <Text style={styles.primaryBtnText}>Comprar Ahora</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#fff" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#64748b", fontSize: 16 },

  headerNav: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 20,
  },
  roundBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  imageBox: { 
    width: width, 
    height: 380, 
    backgroundColor: "#fff", 
    paddingTop: 50 
  },
  mainImage: { width: "100%", height: "100%" },
  imageOverlay: { 
    position: "absolute", 
    bottom: 0, 
    width: "100%", 
    height: 100 
  },
  
  contentCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 120,
    marginTop: -30,
  },
  badgeContainer: { flexDirection: 'row', marginBottom: 15 },
  categoryBadge: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: { color: "#fff", fontSize: 10, fontWeight: "900", letterSpacing: 1 },

  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  mainTitle: { fontSize: 24, fontWeight: "800", color: "#0f172a", flex: 1, marginRight: 10 },
  
  priceRow: { flexDirection: "row", alignItems: "flex-end", marginTop: 15 },
  currencySymbol: { fontSize: 20, fontWeight: "700", color: "#16a34a", marginBottom: 5, marginRight: 2 },
  mainPrice: { fontSize: 36, fontWeight: "900", color: "#16a34a" },
  currencyCode: { fontSize: 14, fontWeight: "600", color: "#64748b", marginBottom: 8, marginLeft: 5 },

  divider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 25 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a", marginBottom: 10 },
  mainDescription: { fontSize: 15, color: "#475569", lineHeight: 24, marginBottom: 25 },

  specsGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between", 
    gap: 12 
  },
  specItem: {
    width: "48%", // Esto permite 2 por fila
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 2,
  },
  specLabel: { fontSize: 11, color: "#94a3b8", marginTop: 8, fontWeight: "600", textTransform: "uppercase" },
  specValue: { fontSize: 13, color: "#1e293b", fontWeight: "700", marginTop: 2 },

  successNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  successText: { color: "#065f46", fontWeight: "700", marginLeft: 8 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 35,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#16a34a",
  },
  secondaryBtnText: { color: "#16a34a", fontWeight: "800", marginLeft: 8, fontSize: 15 },
  primaryBtn: {
    flex: 1.5,
    backgroundColor: "#16a34a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 18,
    elevation: 5,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 16, marginRight: 5 },
});