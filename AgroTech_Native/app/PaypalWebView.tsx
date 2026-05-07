import React, { useRef, useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";

import { WebView } from "react-native-webview";

import {
  useLocalSearchParams,
  useRouter,
  Stack,
} from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";

import { useCart } from "../context/CartContext";

export default function PayPalWebView() {
  const router = useRouter();

  const { clearCart } = useCart();

  const webViewRef = useRef<WebView>(null);

  const { total } = useLocalSearchParams();

  const amount = Number(total || 0).toFixed(2);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] =
    useState("Esperando pago...");

  // ✅ DETECTAR CAMBIOS DE URL PAYPAL
  const handleNavigation = (navState: any) => {
    const url = navState.url;

    console.log("URL:", url);

    // ✅ PAGO EXITOSO
    if (
      url.includes("success") ||
      url.includes("completed") ||
      url.includes("approve")
    ) {
      setStatus("Pago completado");

      clearCart();

      Alert.alert(
        "Pago exitoso",
        "✅ Gracias por tu compra",
        [
          {
            text: "Continuar",
            onPress: () => {
              router.replace("/carrito");
            },
          },
        ]
      );
    }

    // ❌ CANCELADO
    if (
      url.includes("cancel") ||
      url.includes("failed")
    ) {
      setStatus("Pago cancelado");

      Alert.alert(
        "Pago cancelado",
        "❌ El pago fue cancelado"
      );
    }
  };

  return (
    <>
      {/* ✅ QUITAR HEADER NATIVO */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* HEADER */}
        <LinearGradient
          colors={["#0f172a", "#14532d"]}
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={26}
              color="#fff"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Pago seguro
          </Text>

          <Ionicons
            name="shield-checkmark"
            size={24}
            color="#22c55e"
          />
        </LinearGradient>

        {/* CARD INFO */}
        <View style={styles.infoCard}>
          <View style={styles.infoTop}>
            <View>
              <Text style={styles.label}>
                Total a pagar
              </Text>

              <Text style={styles.price}>
                ${amount} MXN
              </Text>
            </View>

            <View style={styles.paypalBadge}>
              <Ionicons
                name="logo-paypal"
                size={24}
                color="#2563eb"
              />

              <Text style={styles.paypalText}>
                PayPal
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />

            <Text style={styles.statusText}>
              {status}
            </Text>
          </View>
        </View>

        {/* WEBVIEW */}
        <View style={styles.webviewContainer}>
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator
                size="large"
                color="#16a34a"
              />

              <Text style={styles.loadingText}>
                Cargando PayPal...
              </Text>
            </View>
          )}

          <WebView
            ref={webViewRef}
            source={{
              uri: `https://api.agrootech.com.mx/payment/${amount}`,
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={["*"]}
            mixedContentMode="always"
            startInLoadingState={true}
            onLoadEnd={() => setLoading(false)}

            // ✅ DETECTAR URLS
            onNavigationStateChange={
              handleNavigation
            }

            // ✅ EVITAR PROBLEMAS VISUALES
            scalesPageToFit={false}

            style={styles.webview}
          />
        </View>
      </SafeAreaView>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  infoCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 22,
    padding: 18,
    elevation: 6,
  },

  infoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: "#64748b",
    fontSize: 14,
    marginBottom: 4,
  },

  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#16a34a",
  },

  paypalBadge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  paypalText: {
    marginLeft: 8,
    fontWeight: "bold",
    color: "#2563eb",
    fontSize: 15,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#22c55e",
    marginRight: 8,
  },

  statusText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
  },

  webviewContainer: {
    flex: 1,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 22,
    backgroundColor: "#fff",
    elevation: 5,
  },

  webview: {
    flex: 1,
  },

  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  loadingText: {
    marginTop: 12,
    color: "#16a34a",
    fontWeight: "600",
  },
});