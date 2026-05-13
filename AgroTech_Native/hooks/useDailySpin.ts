import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

import { SPIN_REWARDS, SpinReward } from "../constants/spinConfig";
import { API_URL } from "../constants/api";

interface RewardApiResponse {
  points: number;
  reward: {
    type: "points" | "discount" | "shipping";
    value: number;
    label?: string;
  };
}

interface RewardMeResponse {
  points: number;
  last_spin_date: string | null;
  last_reward_type: "points" | "discount" | "shipping" | null;
  last_reward_value: number | null;
  last_reward_label: string | null;
}

export function useDailySpin() {
  const [loading, setLoading] = useState(true);
  const [canSpin, setCanSpin] = useState(true);
  const [points, setPoints] = useState(0);
  const [lastReward, setLastReward] = useState<SpinReward | null>(null);

  useEffect(() => {
    loadSpinData();
  }, []);

  /**
   * Obtiene el token JWT desde AsyncStorage
   */
  const getToken = async (): Promise<string | null> => {
    try {
      const session = await AsyncStorage.getItem("agroSession");
      if (!session) return null;

      const parsed = JSON.parse(session);

      // El token puede venir en parsed.token
      return parsed?.token || null;
    } catch (error) {
      console.log("Token error:", error);
      return null;
    }
  };

  /**
   * Convierte la respuesta del backend al formato SpinReward
   */
  const buildReward = (
    type: "points" | "discount" | "shipping",
    value: number,
    label?: string | null
  ): SpinReward => {
    // Buscar coincidencia exacta en la configuración local
    const match = SPIN_REWARDS.find(
      (r) => r.type === type && r.value === value
    );

    if (match) {
      return match;
    }

    // Si no existe, construir dinámicamente
    return {
      id: Date.now(), // ID único temporal
      label:
        label ||
        (type === "points"
          ? `+${value}`
          : type === "discount"
          ? `${value}% OFF`
          : "FREE"),
      type,
      value,
      weight: 0,
      color: "#22c55e",
    };
  };

  /**
   * Carga los datos actuales de la ruleta
   */
  const loadSpinData = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        setCanSpin(false);
        setPoints(0);
        setLastReward(null);
        return;
      }

      const res = await axios.get<RewardMeResponse>(
        `${API_URL}/rewards/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("🎯 Reward data:", res.data);

      // Puntos acumulados
      setPoints(res.data.points || 0);

      // Último premio
      if (
        res.data.last_reward_type &&
        res.data.last_reward_value !== null
      ) {
        const reward = buildReward(
          res.data.last_reward_type,
          res.data.last_reward_value,
          res.data.last_reward_label
        );

        setLastReward(reward);
      } else {
        setLastReward(null);
      }

      // Verificar si ya giró hoy
      const today = new Date().toISOString().split("T")[0];
      setCanSpin(res.data.last_spin_date !== today);
    } catch (error: any) {
      console.log(
        "❌ ERROR RULETA:",
        error?.response?.data || error.message
      );

      setCanSpin(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ejecuta un giro
   */
  const spin = async (): Promise<SpinReward | null> => {
    try {
      const token = await getToken();
      if (!token) return null;

      const res = await axios.post<RewardApiResponse>(
        `${API_URL}/rewards/spin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("🎉 Resultado spin:", res.data);

      const backendReward = buildReward(
        res.data.reward.type,
        res.data.reward.value,
        res.data.reward.label
      );

      // Actualizar estado
      setPoints(res.data.points);
      setLastReward(backendReward);
      setCanSpin(false);

      // Guardar localmente para que Perfil.tsx pueda leerlo
      try {
        const session = await AsyncStorage.getItem("agroSession");

        if (session) {
          const parsed = JSON.parse(session);
          const user = parsed.user || {};

          const userEmail =
            user?.email ||
            user?.correo ||
            "guest";

          const spinKey = `daily_spin_data_${userEmail}`;

          await AsyncStorage.setItem(
            spinKey,
            JSON.stringify({
              points: res.data.points,
              lastReward: backendReward,
              updatedAt: new Date().toISOString(),
            })
          );
        }
      } catch (storageError) {
        console.log("Error guardando spin local:", storageError);
      }

      return backendReward;
    } catch (error: any) {
      console.log(
        "❌ ERROR SPIN:",
        error?.response?.data || error.message
      );

      if (error?.response?.data?.message) {
        Alert.alert("Ruleta", error.response.data.message);
      }

      return null;
    }
  };

  return {
    loading,
    canSpin,
    points,
    lastReward,
    spin,
    reload: loadSpinData,
  };
}