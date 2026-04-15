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
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  // VALIDAR LOGIN
  const checkAuth = async () => {
    const session = await AsyncStorage.getItem("agroSession");

    if (!session) {
      router.push({
        pathname: "/(tabs)/login",
        params: { redirect: "producto" },
      });
      return false;
    }

    return true;
  };

  const handleAddToCart = async () => {
    animateButton();

    const isLogged = await checkAuth();

    if (!isLogged) return;
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

  const handleBuyNow = async () => {
    animateButton();

    const isLogged = await checkAuth();

    if (!isLogged) return;
    if (!prod) return;

    addToCart({
      id: prod.id_productos,
      name: prod.nombre,
      price: Number(prod.precio),
      image: prod.imagen_url,
      quantity: 1,
    });

    router.push("/carrito/pago");
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
        <LinearGradient colors={["#0f172a", "#14532d"]} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Producto</Text>

          <TouchableOpacity onPress={() => router.push("/carrito")}>
            <Ionicons name="cart" size={26} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: prod.imagen_url }} style={styles.image} />

            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={styles.imageOverlay}
            />

            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>
                {prod.categoria.nombre}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>{prod.nombre}</Text>

            <Text style={styles.price}>
              ${Number(prod.precio).toFixed(2)} {prod.moneda}
            </Text>

            <Text style={styles.description}>{prod.descripcion}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="cube-outline" size={16} color="#64748b" />
              <Text style={styles.infoText}>Stock: {prod.stock}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color="#64748b" />
              <Text style={styles.infoText}>{prod.fecha_publicacion}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#64748b"
              />
              <Text style={styles.infoText}>{prod.estado}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color="#64748b" />
              <Text style={styles.infoText}>Chihuahua, Mx</Text>
            </View>

            {added && (
              <View style={styles.addedBox}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#16a34a"
                />

                <Text style={styles.addedText}>Agregado al carrito</Text>

                <TouchableOpacity onPress={() => router.push("/carrito")}>
                  <Text style={styles.goCart}>Ver</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={styles.cartButton}
              onPress={handleAddToCart}
            >
              <Ionicons name="cart" size={20} color="#fff" />
              <Text style={styles.cartText}>Agregar</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleBuyNow}
          >
            <MaterialIcons name="flash-on" size={20} color="#fff" />
            <Text style={styles.buyText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 300,
  },

  imageOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
  },

  categoryTag: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#16a34a",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 18,
    borderRadius: 20,
    elevation: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 5,
  },

  price: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 15,
  },

  description: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  infoText: {
    marginLeft: 6,
    color: "#64748b",
    fontSize: 13,
  },

  addedBox: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ecfdf5",
    padding: 10,
    borderRadius: 10,
  },

  addedText: {
    color: "#065f46",
    fontWeight: "600",
  },

  goCart: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    gap: 10,
    elevation: 10,
  },

  cartButton: {
    flex: 1,
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  cartText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },

  buyButton: {
    flex: 1,
    backgroundColor: "#0ea5e9",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buyText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
});