import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Animated, Easing } from "react-native";
import { useCart } from "../../context/CartContext";
import { useEffect, useRef, useState } from "react";

export default function Layout() {
  const { cartCount } = useCart();

  // 👇 FIX DE TYPESCRIPT
  const segments = useSegments() as string[];

  const isCarrito = segments.includes("carrito");

  const animatedValue = useRef(new Animated.Value(1)).current;
  const [prevCount, setPrevCount] = useState(cartCount);

  useEffect(() => {
    if (cartCount > prevCount) {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.5,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setPrevCount(cartCount);
  }, [cartCount]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: [
          {
            backgroundColor: "#0f172a",
            height: 60,
            paddingBottom: 5,
          },
          isCarrito && { display: "none" },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="carrito"
        options={{
          title: "Carrito",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="cart-outline" size={size} color={color} />
              {cartCount > 0 && (
                <Animated.View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -6,
                    backgroundColor: "red",
                    borderRadius: 8,
                    width: 16,
                    height: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    transform: [{ scale: animatedValue }],
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {cartCount}
                  </Text>
                </Animated.View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}