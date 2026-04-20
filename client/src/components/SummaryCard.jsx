import React from "react";

const SummaryCard = ({ title, value, icon, color, bgColor }) => (
  <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 transition hover:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {title}
        </p>
        <h3 className="mt-1 text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`rounded-xl ${bgColor} ${color} p-3`}>{icon}</div>
    </div>
  </div>
);

export default SummaryCard;
