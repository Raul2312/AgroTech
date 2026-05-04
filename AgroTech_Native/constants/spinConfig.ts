export type RewardType = "points" | "discount" | "shipping";

export interface SpinReward {
  id: number;
  label: string;
  type: RewardType;
  value: number;
  weight: number;
  color: string;
}

export const SPIN_REWARDS: SpinReward[] = [
  {
    id: 1,
    label: "+5",
    type: "points",
    value: 5,
    weight: 30,
    color: "#22c55e",
  },
  {
    id: 2,
    label: "+10",
    type: "points",
    value: 10,
    weight: 25,
    color: "#16a34a",
  },
  {
    id: 3,
    label: "+20",
    type: "points",
    value: 20,
    weight: 15,
    color: "#15803d",
  },
  {
    id: 4,
    label: "5% OFF",
    type: "discount",
    value: 5,
    weight: 10,
    color: "#84cc16",
  },
  {
    id: 5,
    label: "FREE",
    type: "shipping",
    value: 0,
    weight: 5,
    color: "#0f766e",
  },
  {
    id: 6,
    label: "+15",
    type: "points",
    value: 15,
    weight: 15,
    color: "#65a30d",
  },
];