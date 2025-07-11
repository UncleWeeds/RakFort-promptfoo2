import React from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  change?: string;
  isPositiveTrend?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositiveTrend,
  icon,
}) => {
  const trendColor = isPositiveTrend ? "text-green-400" : "text-red-400";
  const TrendIcon = isPositiveTrend ? TrendingUpIcon : TrendingDownIcon;

  return (
    <div className="bg-gray-800 w-full max-w-sm rounded-2xl p-5 shadow-md transition-transform hover:scale-[1.02] duration-200">
      <div className="flex items-center justify-between">
        <div className="text-gray-200 text-lg font-semibold">{title}</div>
        <div className="text-2xl">{icon}</div>
      </div>
      <div className="mt-3 text-4xl font-extrabold text-white">{value}</div>
      {change && typeof isPositiveTrend === "boolean" && (
        <div className={`mt-2 text-sm flex items-center gap-2 ${trendColor}`}>
          <TrendIcon fontSize="small" />
          <span>{change}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
