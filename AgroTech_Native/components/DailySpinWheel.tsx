// Reemplaza TODO tu archivo DailySpinWheel.tsx por este código completo

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
import Svg, { Path, Text as SvgText, TSpan } from "react-native-svg";

import { useDailySpin } from "@/hooks/useDailySpin";
import { SPIN_REWARDS } from "@/constants/spinConfig";

const { width } = Dimensions.get("window");

// ===============================
// CONFIGURACIÓN DE LA RULETA
// ===============================
const WHEEL_SIZE = 280;
const CENTER_SIZE = 72;
const STROKE_WIDTH = 6;
const RADIUS = WHEEL_SIZE / 2;
const INNER_RADIUS = CENTER_SIZE / 2;

// Cada segmento ocupa:
const SLICE_ANGLE = 360 / SPIN_REWARDS.length;

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

  // 5 vueltas completas
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
  }, [visible, scaleAnim, fadeAnim]);

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

  // ===============================
  // FUNCIONES SVG
  // ===============================
  const polarToCartesian = (
    cx: number,
    cy: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(RADIUS, RADIUS, RADIUS, endAngle);
    const end = polarToCartesian(RADIUS, RADIUS, RADIUS, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      `M ${RADIUS} ${RADIUS}`,
      `L ${start.x} ${start.y}`,
      `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  };

  const getTextPosition = (angle: number) => {
    const textRadius = RADIUS - 48;
    const coords = polarToCartesian(
      RADIUS,
      RADIUS,
      textRadius,
      angle + SLICE_ANGLE / 2
    );

    return coords;
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
            {/* BOTÓN CERRAR */}
            {!spinning && (
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            )}

            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>🎯 Daily Spin</Text>
              <Text style={styles.subtitle}>
                Gira y gana recompensas diarias
              </Text>
            </View>

            {/* PUNTERO */}
            <View style={styles.pointerWrap}>
              <Ionicons name="caret-down" size={34} color="#22c55e" />
            </View>

            {/* RULETA */}
            <View style={styles.wheelContainer}>
              <Animated.View
                style={{
                  width: WHEEL_SIZE,
                  height: WHEEL_SIZE,
                  transform: [{ rotate: spinInterpolate }],
                }}
              >
                <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
                  {/* Segmentos */}
                  {SPIN_REWARDS.map((reward, index) => {
                    const startAngle = index * SLICE_ANGLE;
                    const endAngle = startAngle + SLICE_ANGLE;
                    const path = describeArc(startAngle, endAngle);
                    const textPos = getTextPosition(startAngle);

                    const words = reward.label.split(" ");

                    return (
                      <React.Fragment key={reward.id}>
                        <Path
                          d={path}
                          fill={reward.color}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />

                        <SvgText
                          x={textPos.x}
                          y={textPos.y}
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="800"
                          textAnchor="middle"
                          alignmentBaseline="middle"
                        >
                          {words.length > 1 ? (
                            <>
                              <TSpan x={textPos.x} dy="-5">
                                {words[0]}
                              </TSpan>
                              <TSpan x={textPos.x} dy="12">
                                {words.slice(1).join(" ")}
                              </TSpan>
                            </>
                          ) : (
                            reward.label
                          )}
                        </SvgText>
                      </React.Fragment>
                    );
                  })}
                </Svg>

                {/* CENTRO */}
                <View style={styles.centerHub}>
                  <Ionicons name="leaf" size={28} color="#16a34a" />
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
                <Text style={styles.infoValueSmall} numberOfLines={2}>
                  {lastReward ? lastReward.label : "--"}
                </Text>
              </View>
            </View>

            {/* BOTÓN GIRAR */}
            <TouchableOpacity
              style={[
                styles.spinButton,
                (!canSpin || spinning) && styles.disabled,
              ]}
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
  // OVERLAY
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

  // CARD
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

  // HEADER
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

  // PUNTERO
  pointerWrap: {
    zIndex: 20,
    marginBottom: -12,
  },

  // RULETA
  wheelContainer: {
    width: WHEEL_SIZE + 20,
    height: WHEEL_SIZE + 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  // CENTRO
  centerHub: {
    position: "absolute",
    top: (WHEEL_SIZE - CENTER_SIZE) / 2,
    left: (WHEEL_SIZE - CENTER_SIZE) / 2,
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    borderWidth: 5,
    borderColor: "#dcfce7",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  // INFO
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
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },

  // BOTÓN
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
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
});