import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  category: string;
  sale?: boolean;
};

export default function Marketplace() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const heroHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [180, 90],
    extrapolate: "clamp",
  });

  const categories = ["Todos", "🌾 Alimentos", "💉 Veterinaria", "🚜 Equipos", "💧 Agua"];

  const products: Product[] = [
    {
      id: 1,
      name: "Alimento Balanceado Premium",
      price: 480,
      oldPrice: 620,
      rating: 4.8,
      category: "🌾 Alimentos",
      sale: true,
      image: "https://static.wixstatic.com/media/ac332e_d072d24231ba4342b4ddba80414fe0e4~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/ac332e_d072d24231ba4342b4ddba80414fe0e4~mv2.png",
    },
    {
      id: 2,
      name: "Vacuna Bovimax",
      price: 1250,
      rating: 4.6,
      category: "💉 Veterinaria",
      image: "https://vetanco.com/mx/wp-content/uploads/2024/09/vedevax-BLOCKbaja.png",
    },
    {
      id: 3,
      name: "Bebedero Automático",
      price: 2300,
      oldPrice: 2600,
      rating: 4.7,
      category: "💧 Agua",
      sale: true,
      image: "https://m.media-amazon.com/images/I/51zRnfPvWVL.jpg",
    },
    {
      id: 4,
      name: "Comedero Ganadero Profesional",
      price: 1800,
      rating: 4.5,
      category: "🚜 Equipos",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4dVHcq1EQwxOgjKW6MK1VQSqjIeB7kibpTw&s",
    },
    {
      id: 5,
      name: "Kit Veterinario Profesional",
      price: 3200,
      oldPrice: 3600,
      rating: 4.9,
      category: "💉 Veterinaria",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQs-UOO86KC_osLr8bywucfcY_QhNMpqjJbg&s",
    },
    {
      id: 6,
      name: "Bomba de Agua Agrícola Industrial",
      price: 4100,
      rating: 4.7,
      category: "💧 Agua",
      image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTzf-X1omlpPCKLr_eKsoCmc6wTfcBx2aiz87HtC4U3mDmoLYnUvbF7mmliy4keODpL9we-IQzVbq-6uHQqcfOVVgwvnbjQAre2_wNcWz2Yq8h9LdaY-opX6N7NxrTDgm__CrBHfwI&usqp=CAc",
    },
    {
      id: 7,
      name: "Tractores John Deere",
      price: 1800,
      rating: 4.5,
      category: "🚜 Equipos",
      image: "https://www.deere.com.mx/assets/images/region-3/home-page/trator-maquina-agricola.jpg",
    },
  ];

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "Todos" || p.category === category)
  );

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) setFavorites(favorites.filter((f) => f !== id));
    else setFavorites([...favorites, id]);
  };

  const addToCart = () => setCartCount(cartCount + 1);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ color: "#f59e0b" }}>
          {i <= Math.round(rating) ? "★" : "☆"}
        </Text>
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#0f172a", "#14532d"]} style={styles.header}>
        <View style={styles.logoRow}>
          <Image source={require("../../assets/images/agro.png")} style={styles.logo} />
          <Text style={styles.logoText}>AgroTech MarketPlace</Text>
        </View>

        <View style={styles.cartBox}>
          <Text style={styles.cart}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* BUSCADOR */}
      <View style={styles.searchBox}>
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Buscar productos..."
            placeholderTextColor="#64748b"
            style={styles.search}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* CATEGORIAS */}
      <View style={styles.categoriesBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setCategory(item)}
              style={[styles.categoryPill, category === item && styles.categoryActive]}
            >
              <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* LISTA DE PRODUCTOS */}
      <Animated.FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        ListHeaderComponent={
          <>
            {/* HERO BANNER */}
            <Animated.View style={[styles.hero, { height: heroHeight }]}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1500595046743-cd271d694d30" }}
                style={styles.heroImage}
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.heroOverlay}
              />
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Equipos Ganaderos</Text>
                <Text style={styles.heroSubtitle}>Hasta 20% de descuento</Text>
              </View>
            </Animated.View>
            <Text style={styles.section}>Productos</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* FAVORITO */}
            <TouchableOpacity style={styles.favorite} onPress={() => toggleFavorite(item.id)}>
              <Text style={{ fontSize: 18 }}>{favorites.includes(item.id) ? "❤️" : "🤍"}</Text>
            </TouchableOpacity>

            {/* OFERTA */}
            {item.sale && (
              <View style={styles.saleTag}>
                <Text style={styles.saleText}>🔥 OFERTA</Text>
              </View>
            )}

            {/* IMAGEN */}
            <Image source={{ uri: item.image }} style={styles.productImg} />

            {/* INFO */}
            <View style={styles.cardContent}>
              <Text numberOfLines={2} style={styles.productName}>
                {item.name}
              </Text>

              <View style={styles.ratingRow}>
                {renderStars(item.rating)}
                <Text style={styles.ratingNumber}>{item.rating}</Text>
              </View>

              <View>
                {item.oldPrice && <Text style={styles.oldPrice}>${item.oldPrice}</Text>}
                <Text style={styles.price}>${item.price} MXN</Text>
              </View>
            </View>

            {/* BOTÓN */}
            <TouchableOpacity style={styles.btn} onPress={addToCart}>
              <Text style={styles.btnText}>Agregar</Text>
            </TouchableOpacity>
            
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: "#f3f4f6" },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 55, paddingHorizontal: 20, paddingBottom: 15 },

  logoRow: { flexDirection: "row", alignItems: "center" },

  logo: { width: 35, height: 35, marginRight: 10 },

  logoText: { color: "white", fontSize: 18, fontWeight: "bold" },

  cartBox: { position: "relative" },

  cart: { fontSize: 22, color: "white" },

  cartBadge: { position: "absolute", top: -6, right: -10, backgroundColor: "#ef4444", borderRadius: 10, paddingHorizontal: 5 },

  badgeText: { color: "white", fontSize: 10 },

  searchBox: { padding: 15 },

  categoriesBar: { backgroundColor: "#f3f4f6", paddingVertical: 10, paddingLeft: 10 },

  categoryPill: { backgroundColor: "white", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10 },

  categoryActive: { backgroundColor: "#16a34a" },

  categoryText: { fontWeight: "600", color: "#1e293b" },

  categoryTextActive: { color: "white" },

  hero: { marginHorizontal: 15, borderRadius: 16, overflow: "hidden", marginBottom: 10 },

  heroImage: { width: "100%", height: "100%", position: "absolute" },

  heroOverlay: { position: "absolute", width: "100%", height: "100%" },

  heroContent: { position: "absolute", bottom: 20, left: 20 },

  heroTitle: { color: "white", fontSize: 20, fontWeight: "bold" },

  heroSubtitle: { color: "white" },

  section: { fontSize: 18, fontWeight: "bold", marginLeft: 15, marginTop: 10 },

  card: { backgroundColor: "white", margin: 10, borderRadius: 14, width: "45%", height: 280, elevation: 4, overflow: "hidden" },

  productImg: { width: "100%", height: 120 },

  cardContent: { padding: 10, flex: 1, justifyContent: "space-between" },

  productName: { fontWeight: "bold" },

  ratingRow: { flexDirection: "row", alignItems: "center" },

  ratingNumber: { marginLeft: 4, color: "#64748b", fontSize: 12 },

  price: { color: "#16a34a", fontWeight: "bold" },

  oldPrice: { textDecorationLine: "line-through", color: "#64748b", fontSize: 12 },

  btn: { backgroundColor: "#16a34a", padding: 8, margin: 10, borderRadius: 8, marginTop: "auto" },

  btnText: { color: "white", textAlign: "center" },

  saleTag: { position: "absolute", top: 10, left: 10, backgroundColor: "#ef4444", paddingHorizontal: 6, borderRadius: 5, zIndex: 10 },

  saleText: { color: "white", fontSize: 10 },

  favorite: { position: "absolute", right: 10, top: 10, zIndex: 20 },

searchWrapper: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "white",
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 15,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 5,
  elevation: 4,
},

searchIcon: {
  fontSize: 18,
  marginRight: 10,
  color: "#16a34a",
},

search: {
  flex: 1,
  fontSize: 16,
  color: "#1e293b",
  padding: 0, // quitamos padding extra dentro del TextInput
},
});