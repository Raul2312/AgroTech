import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useState } from "react";
import {
  Stack,
  useRouter,
  useLocalSearchParams,
} from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";

export default function PagoScreen() {
  const router = useRouter();
  const { cart } = useCart();
  const { discount, coupon } = useLocalSearchParams();

  const descuento = Number(discount) || 0;
  const cuponAplicado = coupon?.toString() || "";

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalProducts = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const envio = subtotal > 0 ? 120 : 0;
  const total = subtotal + envio - descuento;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <LinearGradient
          colors={["#0f172a", "#14532d"]}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Método de pago</Text>

          <Ionicons name="wallet-outline" size={24} color="#fff" />
        </LinearGradient>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.sectionTitle}>Selecciona cómo pagar</Text>

          <TouchableOpacity
            style={[
              styles.methodCard,
              paymentMethod === "card" && styles.activeMethod,
            ]}
            onPress={() => setPaymentMethod("card")}
          >
            <View style={styles.methodLeft}>
              <Ionicons name="card-outline" size={26} color="#16a34a" />

              <View style={{ flex: 1 }}>
                <Text style={styles.methodTitle}>
                  Tarjeta de crédito o débito
                </Text>

                <Text style={styles.methodSubtitle}>
                  Visa, Mastercard, American Express
                </Text>
              </View>
            </View>

            {paymentMethod === "card" && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#16a34a"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              paymentMethod === "paypal" && styles.activeMethod,
            ]}
            onPress={() => setPaymentMethod("paypal")}
          >
            <View style={styles.methodLeft}>
              <Ionicons name="logo-paypal" size={26} color="#2563eb" />

              <View style={{ flex: 1 }}>
                <Text style={styles.methodTitle}>PayPal</Text>

                <Text style={styles.methodSubtitle}>
                  Paga usando tu cuenta PayPal
                </Text>
              </View>
            </View>

            {paymentMethod === "paypal" && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#16a34a"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              paymentMethod === "cash" && styles.activeMethod,
            ]}
            onPress={() => setPaymentMethod("cash")}
          >
            <View style={styles.methodLeft}>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={26}
                color="#f59e0b"
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.methodTitle}>Pago contra entrega</Text>

                <Text style={styles.methodSubtitle}>
                  Paga al recibir tu pedido
                </Text>
              </View>
            </View>

            {paymentMethod === "cash" && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#16a34a"
              />
            )}
          </TouchableOpacity>

          {paymentMethod === "card" && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Datos de la tarjeta</Text>

              <TextInput
                placeholder="Nombre del titular"
                value={cardName}
                onChangeText={setCardName}
                style={styles.input}
                placeholderTextColor="#94a3b8"
              />

              <TextInput
                placeholder="Número de tarjeta"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#94a3b8"
              />

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="MM/AA"
                  value={expiry}
                  onChangeText={setExpiry}
                  style={[styles.input, { flex: 1, marginRight: 10 }]}
                  placeholderTextColor="#94a3b8"
                />

                <TextInput
                  placeholder="CVV"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  style={[styles.input, { flex: 1 }]}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          )}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen del pedido</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Productos</Text>
              <Text style={styles.summaryValue}>{totalProducts}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ${subtotal.toFixed(2)} MXN
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Envío</Text>
              <Text style={styles.summaryValue}>
                ${envio.toFixed(2)} MXN
              </Text>
            </View>

            {cuponAplicado !== "" && descuento > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cupón aplicado</Text>
                <Text style={styles.couponApplied}>
                  {cuponAplicado}
                </Text>
              </View>
            )}

            {descuento > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.discountText}>Descuento</Text>
                <Text style={styles.discountValue}>
                  - ${descuento.toFixed(2)} MXN
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Total</Text>
              <Text style={styles.totalPrice}>
                ${total.toFixed(2)} MXN
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.payButton}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.payButtonText}>Confirmar pago</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },

  methodCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 4,
  },

  activeMethod: {
    borderColor: "#16a34a",
    backgroundColor: "#f0fdf4",
  },

  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  methodTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f172a",
  },

  methodSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },

  formCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 5,
    borderRadius: 18,
    padding: 18,
    elevation: 4,
  },

  formTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 15,
  },

  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 14,
    fontSize: 15,
    color: "#0f172a",
  },

  inputRow: {
    flexDirection: "row",
  },

  summaryCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 18,
    padding: 18,
    elevation: 4,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 14,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  summaryLabel: {
    color: "#64748b",
    fontSize: 14,
  },

  summaryValue: {
    color: "#0f172a",
    fontWeight: "600",
  },

  couponApplied: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  discountText: {
    color: "#16a34a",
  },

  discountValue: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
  },

  summaryTotal: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f172a",
  },

  totalPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#16a34a",
  },

  payButton: {
    backgroundColor: "#16a34a",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

