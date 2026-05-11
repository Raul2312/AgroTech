// ==========================================
// hooks/useDailySpin.ts
// SOLUCIÓN: cada usuario tendrá su propia
// ruleta usando una clave única por correo.
// ==========================================

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SPIN_REWARDS, SpinReward } from "@/constants/spinConfig";

interface DailySpinData {
  lastSpinDate: string | null;
  points: number;
  lastReward: SpinReward | null;
}

// ==========================================
// Normaliza el correo para evitar problemas:
// Luis@gmail.com y luis@gmail.com serán iguales
// ==========================================
const normalizeEmail = (email: string) =>
  email.trim().toLowerCase();

// ==========================================
// Clave única por usuario
// ==========================================
const getStorageKey = (correo: string) =>
  `daily_spin_data_${normalizeEmail(correo)}`;

// ==========================================
// Obtiene el correo del usuario actual
// ==========================================
const getCurrentUserEmail = async (): Promise<string | null> => {
  try {
    const session = await AsyncStorage.getItem("agroSession");

    if (!session) return null;

    const parsed = JSON.parse(session);
    const user = parsed?.user;

    const correo =
      user?.email ||
      user?.correo ||
      user?.username ||
      user?.usuario ||
      null;

    if (!correo) return null;

    return normalizeEmail(correo);
  } catch (error) {
    console.log("Error obteniendo usuario:", error);
    return null;
  }
};

export function useDailySpin() {
  const [loading, setLoading] = useState(true);
  const [canSpin, setCanSpin] = useState(false);
  const [points, setPoints] = useState(0);
  const [lastReward, setLastReward] =
    useState<SpinReward | null>(null);

  useEffect(() => {
    loadSpinData();
  }, []);

  // ==========================================
  // Cargar datos del usuario actual
  // ==========================================
  const loadSpinData = async () => {
    try {
      setLoading(true);

      const correo = await getCurrentUserEmail();

      // Si no hay usuario, reiniciar estados
      if (!correo) {
        setPoints(0);
        setLastReward(null);
        setCanSpin(false);
        return;
      }

      const STORAGE_KEY = getStorageKey(correo);

      console.log(
        "🔑 Cargando datos del usuario:",
        correo
      );
      console.log("📦 Storage Key:", STORAGE_KEY);

      const raw = await AsyncStorage.getItem(
        STORAGE_KEY
      );

      // Si el usuario nunca ha girado
      if (!raw) {
        const initialData: DailySpinData = {
          lastSpinDate: null,
          points: 0,
          lastReward: null,
        };

        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(initialData)
        );

        setPoints(0);
        setLastReward(null);
        setCanSpin(true);

        console.log(
          "🆕 Se creó almacenamiento nuevo para:",
          correo
        );

        return;
      }

      const data: DailySpinData = JSON.parse(raw);
      const today = new Date().toDateString();

      setPoints(data.points || 0);
      setLastReward(data.lastReward || null);
      setCanSpin(data.lastSpinDate !== today);

      console.log("📊 Datos cargados:", data);
      console.log(
        "🎯 Puede girar:",
        data.lastSpinDate !== today
      );
    } catch (error) {
      console.log(
        "Error loading spin data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Selección aleatoria ponderada
  // ==========================================
  const getRandomReward = (): SpinReward => {
    const totalWeight = SPIN_REWARDS.reduce(
      (sum, reward) => sum + reward.weight,
      0
    );

    let random = Math.random() * totalWeight;

    for (const reward of SPIN_REWARDS) {
      random -= reward.weight;

      if (random <= 0) {
        return reward;
      }
    }

    return SPIN_REWARDS[0];
  };

  // ==========================================
  // Girar la ruleta
  // ==========================================
  const spin = async (): Promise<SpinReward | null> => {
    if (!canSpin) return null;

    try {
      const correo = await getCurrentUserEmail();

      if (!correo) return null;

      const STORAGE_KEY = getStorageKey(correo);

      const reward = getRandomReward();
      const today = new Date().toDateString();

      const newPoints =
        reward.type === "points"
          ? points + reward.value
          : points;

      const newData: DailySpinData = {
        lastSpinDate: today,
        points: newPoints,
        lastReward: reward,
      };

      // Guardar SOLO para este usuario
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(newData)
      );

      // Actualizar estados
      setPoints(newPoints);
      setLastReward(reward);
      setCanSpin(false);

      console.log(
        "💾 Datos guardados para:",
        correo
      );
      console.log("📦 Key:", STORAGE_KEY);
      console.log("🎁 Reward:", reward);
      console.log("⭐ Points:", newPoints);

      return reward;
    } catch (error) {
      console.log(
        "Error spinning wheel:",
        error
      );
      return null;
    }
  };

  // ==========================================
  // Opcional: limpiar datos del usuario actual
  // ==========================================
  const resetCurrentUserSpin = async () => {
    const correo = await getCurrentUserEmail();

    if (!correo) return;

    const STORAGE_KEY = getStorageKey(correo);

    await AsyncStorage.removeItem(STORAGE_KEY);

    await loadSpinData();
  };

  return {
    loading,
    canSpin,
    points,
    lastReward,
    spin,
    refreshSpin: loadSpinData,
    resetCurrentUserSpin,
  };
}