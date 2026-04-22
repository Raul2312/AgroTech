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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../../context/CartContext";
import { useRouter, Stack } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function carrito() {
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
          setCheckingAuth(false);

          router.replace({
            pathname: "/(tabs)/login",
            params: {
              redirect: "carrito",
            },
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

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <LinearGradient
            colors={["#0f172a", "#14532d"]}
            style={styles.header}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Carrito</Text>

            <Ionicons name="cart" size={24} color="#fff" />
          </LinearGradient>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                keyboardShouldPersistTaps="always"
                ListEmptyComponent={
                  <Text style={styles.empty}>
                    🛒 Tu carrito está vacío
                  </Text>
                }
                contentContainerStyle={{ paddingBottom: 300 }}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.image}
                    />

                    <View style={styles.info}>
                      <Text numberOfLines={4} style={styles.name}>
                        {item.name}
                      </Text>

                      <Text style={styles.price}>
                        ${item.price} MXN
                      </Text>

                      <View style={styles.qtyRow}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => decrease(item.id)}
                        >
                          <Ionicons
                            name="remove"
                            size={18}
                            color="#334155"
                          />
                        </TouchableOpacity>

                        <Text style={styles.qty}>{item.quantity}</Text>

                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => increase(item.id)}
                        >
                          <Ionicons
                            name="add"
                            size={18}
                            color="#334155"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => removeFromCart(item.id)}
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={22}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.footer}>
            <View style={styles.couponBox}>
              <Ionicons
                name="pricetag-outline"
                size={18}
                color="#16a34a"
              />

              <TextInput
                placeholder="Código de cupón"
                value={coupon}
                onChangeText={setCoupon}
                style={styles.couponInput}
                returnKeyType="done"
                onSubmitEditing={applyCoupon}
              />

              <TouchableOpacity
                style={styles.couponBtn}
                onPress={applyCoupon}
              >
                <Text style={styles.couponBtnText}>Aplicar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summary}>
              <View style={styles.row}>
                <Text style={styles.label}>Subtotal</Text>
                <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Envío</Text>
                <Text style={styles.value}>${envio.toFixed(2)}</Text>
              </View>

              {discount > 0 && (
                <View style={styles.row}>
                  <Text style={{ color: "#16a34a" }}>Descuento</Text>
                  <Text style={{ color: "#16a34a" }}>
                    - ${discount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.total}>
                  ${total.toFixed(2)} MXN
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.checkoutBtn,
                cart.length === 0 && { opacity: 0.5 },
              ]}
              disabled={cart.length === 0}
              onPress={() =>
                router.push({
                  pathname: "/carrito/pago",
                  params: {
                    discount: discount.toString(),
                    coupon: coupon,
                  },
                })
              }
            >
              <Ionicons
                name="card-outline"
                size={22}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.checkoutText}>
                Proceder al pago
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
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
    backgroundColor: "#f1f5f9",
  },

  loadingText: {
    fontSize: 16,
    color: "#475569",
    fontWeight: "600",
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
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 14,
    padding: 12,
    borderRadius: 18,
    alignItems: "center",
    elevation: 5,
  },

  image: {
    width: 75,
    height: 75,
    borderRadius: 12,
    marginRight: 12,
  },

  info: {
    flex: 1,
    marginRight: 10,
  },

  name: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 4,
    color: "#0f172a",
  },

  price: {
    color: "#16a34a",
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 15,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyBtn: {
    backgroundColor: "#e2e8f0",
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  qty: {
    marginHorizontal: 12,
    fontWeight: "bold",
    fontSize: 16,
  },

  deleteBtn: {
    backgroundColor: "#fee2e2",
    padding: 8,
    borderRadius: 10,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 12,
  },

  couponBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },

  couponInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
  },

  couponBtn: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  couponBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  summary: {
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    color: "#64748b",
  },

  value: {
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 8,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },

  total: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#16a34a",
  },

  checkoutBtn: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },

  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  empty: {
    textAlign: "center",
    marginTop: 80,
    fontSize: 18,
    color: "#64748b",
  },
});