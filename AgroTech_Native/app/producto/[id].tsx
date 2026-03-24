import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { useState, useRef } from "react";

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

  // Convertimos el JSON pasado por params a objeto
  const prod: ProductoType = producto ? JSON.parse(producto) : null;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddToCart = () => {
    animateButton();
    if (!prod) return;

    addToCart({
      id: prod.id_productos,
      name: prod.nombre,
      price: Number(prod.precio),
      image: prod.imagen_url,
      quantity: 1,
    });

    setAdded(true);
  };

  if (!prod) {
    return (
      <View style={styles.container}>
        <Text>No se encontró el producto</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* HEADER */}
        <LinearGradient colors={["#0f172a", "#14532d"]} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del producto</Text>
          <TouchableOpacity onPress={() => router.push("/carrito")}>
            <Ionicons name="cart" size={26} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView>
          <Image source={{ uri: prod.imagen_url }} style={styles.image} />

          <View style={styles.card}>
            <Text style={styles.title}>{prod.nombre}</Text>
            <Text style={styles.price}>
              ${Number(prod.precio).toFixed(2)} {prod.moneda}
            </Text>

            <Text style={styles.description}>{prod.descripcion}</Text>

            <View style={styles.specs}>
              <Text style={styles.specTitle}>Especificaciones</Text>

              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Categoría</Text>
                <Text style={styles.specValue}>{prod.categoria.nombre}</Text>
              </View>

              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Stock disponible</Text>
                <Text style={styles.specValue}>{prod.stock}</Text>
              </View>

              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Fecha de publicación</Text>
                <Text style={styles.specValue}>{prod.fecha_publicacion}</Text>
              </View>

              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Estado</Text>
                <Text style={styles.specValue}>{prod.estado}</Text>
              </View>
            </View>

            {/* BOTON AGREGAR CARRITO */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={handleAddToCart}
              >
                <Ionicons
                  name="cart"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.cartText}>Agregar al carrito</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* MENSAJE PRODUCTO AGREGADO */}
            {added && (
              <View style={styles.addedBox}>
                <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
                <Text style={styles.addedText}>
                  Producto agregado al carrito
                </Text>
                <TouchableOpacity onPress={() => router.push("/carrito")}>
                  <Text style={styles.goCart}>Ver carrito</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* COMPRAR */}
            <TouchableOpacity style={styles.buyButton}>
              <MaterialIcons
                name="flash-on"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buyText}>Comprar ahora</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  image: { width: "100%", height: 320, resizeMode: "contain", backgroundColor: "#fff" },
  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#1e293b" },
  price: { fontSize: 30, fontWeight: "bold", color: "#16a34a", marginBottom: 20 },
  description: { fontSize: 15, color: "#475569", lineHeight: 22, marginBottom: 25 },
  specs: { borderTopWidth: 1, borderColor: "#e2e8f0", paddingTop: 15, marginBottom: 25 },
  specTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#1e293b" },
  specRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  specLabel: { color: "#64748b" },
  specValue: { fontWeight: "600", color: "#334155" },
  cartButton: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cartText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  buyButton: {
    backgroundColor: "#0ea5e9",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buyText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  addedBox: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ecfdf5",
    padding: 12,
    borderRadius: 10,
  },
  addedText: { color: "#065f46", fontWeight: "600" },
  goCart: { color: "#16a34a", fontWeight: "bold" },
});