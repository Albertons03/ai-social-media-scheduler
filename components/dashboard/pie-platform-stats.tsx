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

const COLORS = ["#FE2C55", "#0077B5", "#1D9BF0"];
const TEXT_COLOR = "hsl(var(--foreground))";

export type PiePlatformStatsProps = {
  stats: {
    tiktok: number;
    linkedin: number;
    twitter: number;
  };
};

type PieLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  name: string;
  percent: number;
};

const RADIAN = Math.PI / 180;

function renderLabel({ cx, cy, midAngle, outerRadius, name, percent }: PieLabelProps) {
  const radius = outerRadius + 16;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill={TEXT_COLOR}
      fontSize={12}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

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
            label={renderLabel}
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
          <Tooltip
            formatter={(value: number) => value + " posts"}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              color: TEXT_COLOR,
            }}
            itemStyle={{ color: TEXT_COLOR }}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: TEXT_COLOR }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
