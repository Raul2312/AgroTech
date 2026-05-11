import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { SPIN_REWARDS, SpinReward } from "../constants/spinConfig";
import { API_URL } from "../constants/api";

interface DailySpinResponse {
  points: number;
  reward: {
    type: string;
    value: number;
  };
}

export function useDailySpin() {
  const [loading, setLoading] = useState(true);
  const [canSpin, setCanSpin] = useState(true); // temporal
  const [points, setPoints] = useState(0);
  const [lastReward, setLastReward] = useState<SpinReward | null>(null);

  useEffect(() => {
    loadSpinData();
  }, []);

  const getToken = async (): Promise<string | null> => {
    try {
      const session = await AsyncStorage.getItem("agroSession");
      if (!session) return null;

      return JSON.parse(session)?.token || null;
    } catch (e) {
      console.log("Token error:", e);
      return null;
    }
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

      const res = await axios.get<DailySpinResponse>(
        `${API_URL}/rewards/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      setPoints(res.data.points);

      // normalizar reward del backend
      setLastReward({
        id: 0,
        label: `${res.data.reward.value}`,
        type: res.data.reward.type as any,
        value: res.data.reward.value,
        weight: 0,
        color: "#22c55e",
      });

      setCanSpin(true); // backend aún no manda control de día
    } catch (error: any) {
      console.log("❌ ERROR RULETA:", error.message);
      setCanSpin(false);
    } finally {
      setLoading(false);
    }
  };

  const getRandomReward = (): SpinReward => {
    const total = SPIN_REWARDS.reduce((a, b) => a + b.weight, 0);

    let random = Math.random() * total;

    for (const r of SPIN_REWARDS) {
      random -= r.weight;
      if (random <= 0) return r;
    }

    return SPIN_REWARDS[0];
  };

  const spin = async (): Promise<SpinReward | null> => {
    try {
      const token = await getToken();
      if (!token) return null;

      const reward = getRandomReward();

      const res = await axios.post(
        `${API_URL}/rewards/spin`,
        { reward },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      setPoints(res.data.points);

      setLastReward({
        id: 0,
        label: `${res.data.reward.value}`,
        type: res.data.reward.type,
        value: res.data.reward.value,
        weight: 0,
        color: "#22c55e",
      });

      setCanSpin(false);

      return reward;
    } catch (error: any) {
      console.log("❌ ERROR SPIN:", error.message);
      return null;
    }
  };

  return {
    loading,
    canSpin,
    points,
    lastReward,
    spin,
  };
}