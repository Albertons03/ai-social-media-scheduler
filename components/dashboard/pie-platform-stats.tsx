"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#FE2C55", "#0077B5", "#000000"];
const PLATFORM_LABELS = ["TikTok", "LinkedIn", "Twitter/X"];

export type PiePlatformStatsProps = {
  stats: {
    tiktok: number;
    linkedin: number;
    twitter: number;
  };
};

export default function PiePlatformStats({ stats }: PiePlatformStatsProps) {
  const data = [
    { name: "TikTok", value: stats.tiktok },
    { name: "LinkedIn", value: stats.linkedin },
    { name: "Twitter/X", value: stats.twitter },
  ];

  return (
    <div className="w-full h-72 flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-2">
        Posts by Platform (Pie Chart)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => value + " posts"} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
