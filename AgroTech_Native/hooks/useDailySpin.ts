import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { SPIN_REWARDS, SpinReward } from "../constants/spinConfig";
import { API_URL } from "../constants/api";

import { Alert } from "react-native";

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

  const getToken = async (): Promise<string | null> => {
    try {
      const session = await AsyncStorage.getItem("agroSession");
      if (!session) return null;

      const parsed = JSON.parse(session);
      return parsed?.token || null;
    } catch (error) {
      console.log("Token error:", error);
      return null;
    }
  };

  const buildReward = (
    type: "points" | "discount" | "shipping",
    value: number,
    label?: string | null
  ): SpinReward => {
    const match = SPIN_REWARDS.find(
      (r) => r.type === type && r.value === value
    );

    if (match) {
      return match;
    }

    return {
      id: 0,
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

      setPoints(res.data.points || 0);

      if (
        res.data.last_reward_type &&
        res.data.last_reward_value !== null
      ) {
        setLastReward(
          buildReward(
            res.data.last_reward_type,
            res.data.last_reward_value,
            res.data.last_reward_label
          )
        );
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

      const backendReward = buildReward(
        res.data.reward.type,
        res.data.reward.value,
        res.data.reward.label
      );

      setPoints(res.data.points);
      setLastReward(backendReward);
      setCanSpin(false);

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