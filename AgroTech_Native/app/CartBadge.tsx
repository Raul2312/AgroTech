import React, { useRef, useEffect } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { useCart } from "../context/CartContext";

export default function CartBadge() {
  const { cartCount } = useCart();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartCount]);

  if (cartCount === 0) return null;

  return (
    <Animated.View style={[styles.badge, { transform: [{ scale }] }]}>
      <Text style={styles.text}>{cartCount}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});