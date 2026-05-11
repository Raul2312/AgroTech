import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../../context/CartContext";
import { useRouter, Stack } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Carrito() {
  const router = useRouter();

  const {
    cart,
    increase,
    decrease,
    removeFromCart,
  } = useCart();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await AsyncStorage.getItem("agroSession");
        if (!session) {
          router.replace({
            pathname: "/(tabs)/login",
            params: { redirect: "carrito" },
          });
          return;
        }
        setCheckingAuth(false);
      } catch (error) {
        console.log("Error verificando sesión:", error);
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, []);

  if (checkingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const envio = subtotal > 0 ? 120 : 0;
  const total = subtotal + envio - discount;

  const applyCoupon = () => {
    Keyboard.dismiss();
    if (coupon === "AGRO10") {
      setDiscount(subtotal * 0.1);
    } else if (coupon === "AGRO50") {
      setDiscount(50);
    } else {
      setDiscount(0);
      alert("Cupón inválido");
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <LinearGradient
            colors={["#0f172a", "#16a34a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mi Carrito</Text>
            <View style={{ width: 40 }} /> 
          </LinearGradient>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                keyboardShouldPersistTaps="always"
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color="#cbd5e1" />
                    <Text style={styles.empty}>Tu carrito está vacío</Text>
                    <TouchableOpacity 
                        style={styles.shopBtn} 
                        onPress={() => router.push("/")}
                    >
                        <Text style={styles.shopBtnText}>Explorar productos</Text>
                    </TouchableOpacity>
                  </View>
                }
                contentContainerStyle={{ paddingBottom: 320, paddingTop: 10 }}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <View style={styles.imageWrapper}>
                        <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="contain" // EVITA QUE SE CORTE LA FOTO
                        />
                    </View>

                    <View style={styles.info}>
                      <Text numberOfLines={2} style={styles.name}>
                        {item.name}
                      </Text>
                      <Text style={styles.price}>
                        ${item.price.toLocaleString('es-MX')} MXN
                      </Text>

                      <View style={styles.qtyRow}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => decrease(item.id)}
                        >
                          <Ionicons name="remove" size={18} color="#16a34a" />
                        </TouchableOpacity>

                        <Text style={styles.qty}>{item.quantity}</Text>

                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => increase(item.id)}
                        >
                          <Ionicons name="add" size={18} color="#16a34a" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => removeFromCart(item.id)}
                    >
                      <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.footer}>
            <View style={styles.couponBox}>
              <Ionicons name="pricetag-outline" size={18} color="#16a34a" />
              <TextInput
                placeholder="¿Tienes un cupón?"
                value={coupon}
                onChangeText={setCoupon}
                style={styles.couponInput}
                placeholderTextColor="#94a3b8"
                returnKeyType="done"
                onSubmitEditing={applyCoupon}
              />
              <TouchableOpacity style={styles.couponBtn} onPress={applyCoupon}>
                <Text style={styles.couponBtnText}>Aplicar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summary}>
              <View style={styles.row}>
                <Text style={styles.label}>Subtotal</Text>
                <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Costo de Envío</Text>
                <Text style={styles.value}>${envio.toFixed(2)}</Text>
              </View>

              {discount > 0 && (
                <View style={styles.row}>
                  <Text style={{ color: "#16a34a", fontWeight: '600' }}>Descuento</Text>
                  <Text style={{ color: "#16a34a", fontWeight: '600' }}>
                    - ${discount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.total}>
                  ${total.toFixed(2)} <Text style={{fontSize: 12}}>MXN</Text>
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.checkoutBtn,
                cart.length === 0 && { opacity: 0.5, backgroundColor: '#94a3b8' },
              ]}
              disabled={cart.length === 0}
              onPress={() =>
                router.push({
                  pathname: "/carrito/pago",
                  params: { discount: discount.toString(), coupon: coupon },
                })
              }
            >
              <Text style={styles.checkoutText}>Proceder al pago</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
  loadingText: { fontSize: 16, color: "#475569", fontWeight: "600" },

  header: {
    paddingTop: 35,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 15,
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  imageWrapper: {
    width: 85,
    height: 85,
    backgroundColor: '#f1f5f9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  image: { width: "90%", height: "90%" },
  info: { flex: 1 },
  name: { fontWeight: "700", fontSize: 15, marginBottom: 4, color: "#1e293b" },
  price: { color: "#16a34a", fontWeight: "800", marginBottom: 10, fontSize: 16 },

  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    backgroundColor: "#f0fdf4",
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#dcfce7'
  },
  qty: { marginHorizontal: 15, fontWeight: "800", fontSize: 16, color: "#1e293b" },

  deleteBtn: {
    backgroundColor: "#fee2e2",
    padding: 10,
    borderRadius: 12,
    marginLeft: 10,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  couponBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  couponInput: { flex: 1, height: 45, marginHorizontal: 10, fontSize: 14, color: '#1e293b' },
  couponBtn: { backgroundColor: "#16a34a", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  couponBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  summary: { marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  label: { color: "#64748b", fontSize: 14, fontWeight: '500' },
  value: { fontWeight: "700", color: '#1e293b' },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: "800", color: '#0f172a' },
  total: { fontSize: 26, fontWeight: "900", color: "#16a34a" },

  checkoutBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 18,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#16a34a",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  checkoutText: { color: "#fff", fontWeight: "800", fontSize: 17, marginRight: 8 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  empty: { fontSize: 18, color: "#94a3b8", fontWeight: '600', marginTop: 20 },
  shopBtn: { marginTop: 20, backgroundColor: '#f1f5f9', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 },
  shopBtnText: { color: '#16a34a', fontWeight: '700' }
});