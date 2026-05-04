import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SPIN_REWARDS, SpinReward } from "@/constants/spinConfig";

const STORAGE_KEY = "daily_spin_data";

interface DailySpinData {
  lastSpinDate: string | null;
  points: number;
  lastReward: SpinReward | null;
}

export function useDailySpin() {
  const [loading, setLoading] = useState(true);
  const [canSpin, setCanSpin] = useState(false);
  const [points, setPoints] = useState(0);
  const [lastReward, setLastReward] = useState<SpinReward | null>(null);

  useEffect(() => {
    loadSpinData();
  }, []);

  const loadSpinData = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);

      if (!raw) {
        const initialData: DailySpinData = {
          lastSpinDate: null,
          points: 0,
          lastReward: null,
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        setCanSpin(true);
        setPoints(0);
        setLastReward(null);
        return;
      }

      const data: DailySpinData = JSON.parse(raw);
      const today = new Date().toDateString();

      setPoints(data.points || 0);
      setLastReward(data.lastReward || null);
      setCanSpin(data.lastSpinDate !== today);
    } catch (error) {
      console.log("Error loading spin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomReward = (): SpinReward => {
    const totalWeight = SPIN_REWARDS.reduce(
      (sum, reward) => sum + reward.weight,
      0
    );

    let random = Math.random() * totalWeight;

    for (const reward of SPIN_REWARDS) {
      random -= reward.weight;
      if (random <= 0) return reward;
    }

    return SPIN_REWARDS[0];
  };

  const spin = async (): Promise<SpinReward | null> => {
    if (!canSpin) return null;

    try {
      const reward = getRandomReward();
      const today = new Date().toDateString();

      const newPoints =
        reward.type === "points" ? points + reward.value : points;

      const newData: DailySpinData = {
        lastSpinDate: today,
        points: newPoints,
        lastReward: reward,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

      setPoints(newPoints);
      setLastReward(reward);
      setCanSpin(false);

      return reward;
    } catch (error) {
      console.log("Error spinning wheel:", error);
      return null;
    }
  };

  return {
    loading,
    canSpin,
    points,
    lastReward,
    spin,
    refreshSpin: loadSpinData,
  };
}