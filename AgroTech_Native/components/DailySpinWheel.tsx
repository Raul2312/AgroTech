import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Dimensions,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useDailySpin } from "@/hooks/useDailySpin";
import { SPIN_REWARDS } from "@/constants/spinConfig";

const { width } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function DailySpinWheel({ visible, onClose }: Props) {
  const { loading, canSpin, points, lastReward, spin } = useDailySpin();
  const [spinning, setSpinning] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const spinInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "1800deg"],
  });

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleSpin = async () => {
    if (!canSpin || spinning) return;

    setSpinning(true);
    rotateAnim.setValue(0);

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 4200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(async () => {
      const reward = await spin();

      if (reward) {
        setTimeout(() => {
          Alert.alert(
            "🎉 Premio desbloqueado",
            reward.type === "points"
              ? `Ganaste ${reward.value} AgroPoints`
              : reward.type === "discount"
              ? `Ganaste ${reward.value}% de descuento`
              : "Ganaste envío gratis",
            [
              {
                text: "Continuar",
                onPress: () => {
                  setSpinning(false);
                  onClose();
                },
              },
            ]
          );
        }, 300);
      } else {
        setSpinning(false);
      }
    });
  };

  if (!visible) return null;

  if (loading) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#22c55e" />
            <Text style={styles.loaderText}>Cargando ruleta...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible transparent animationType="fade">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.modalCard,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["#020617", "#0f172a", "#052e16"]}
            style={styles.card}
          >
            {/* CLOSE */}
            {!spinning && (
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            )}

            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>🎯 Daily Spin</Text>
              <Text style={styles.subtitle}>Gira y gana recompensas diarias</Text>
            </View>

            {/* POINTER */}
            <View style={styles.pointerWrap}>
              <Ionicons name="caret-down" size={34} color="#22c55e" />
            </View>

            {/* WHEEL */}
            <View style={styles.wheelContainer}>
              <Animated.View
                style={[
                  styles.wheel,
                  {
                    transform: [{ rotate: spinInterpolate }],
                  },
                ]}
              >
                {SPIN_REWARDS.map((reward, index) => (
                  <View
                    key={reward.id}
                    style={[
                      styles.slice,
                      {
                        backgroundColor: reward.color,
                        transform: [{ rotate: `${index * 60}deg` }],
                      },
                    ]}
                  >
                    <Text style={styles.sliceText}>{reward.label}</Text>
                  </View>
                ))}

                <View style={styles.centerHub}>
                  <Ionicons name="leaf" size={24} color="#16a34a" />
                </View>
              </Animated.View>
            </View>

            {/* INFO */}
            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>AgroPoints</Text>
                <Text style={styles.infoValue}>{points}</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Último premio</Text>
                <Text style={styles.infoValueSmall}>
                  {lastReward ? lastReward.label : "--"}
                </Text>
              </View>
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              style={[styles.spinButton, (!canSpin || spinning) && styles.disabled]}
              onPress={handleSpin}
              disabled={!canSpin || spinning}
            >
              <LinearGradient
                colors={
                  !canSpin || spinning
                    ? ["#475569", "#334155"]
                    : ["#22c55e", "#15803d"]
                }
                style={styles.spinGradient}
              >
                <Text style={styles.spinText}>
                  {spinning
                    ? "Girando..."
                    : canSpin
                    ? "Girar ahora"
                    : "Vuelve mañana"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.82)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  modalCard: {
    width: width - 28,
    maxWidth: 420,
  },

  loaderBox: {
    backgroundColor: "#0f172a",
    padding: 30,
    borderRadius: 24,
    alignItems: "center",
  },

  loaderText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
  },

  card: {
    borderRadius: 28,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },

  header: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },

  pointerWrap: {
    zIndex: 20,
    marginBottom: -12,
  },

  wheelContainer: {
    width: 270,
    height: 270,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  wheel: {
    width: 245,
    height: 245,
    borderRadius: 122.5,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    borderWidth: 6,
    borderColor: "#fff",
  },

  slice: {
    position: "absolute",
    width: 122,
    height: 122,
    top: 0,
    left: 122,
    justifyContent: "center",
    alignItems: "center",
  },

  sliceText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
    transform: [{ rotate: "30deg" }],
  },

  centerHub: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
    borderWidth: 4,
    borderColor: "#dcfce7",
  },

  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  infoBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 14,
    minWidth: 120,
    alignItems: "center",
  },

  infoLabel: {
    color: "#94a3b8",
    fontSize: 11,
  },

  infoValue: {
    color: "#22c55e",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },

  infoValueSmall: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },

  spinButton: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
  },

  disabled: {
    opacity: 0.75,
  },

  spinGradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 18,
  },

  spinText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});