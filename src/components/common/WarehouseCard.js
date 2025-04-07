import React from 'react';

const WarehouseCard = ({ warehouse }) => {
  // 计算库存健康度百分比
  const healthPercentage = Math.round((warehouse.inventory / warehouse.forecastDemand) * 100);

  // 根据库存状态确定颜色
  const getStatusColor = () => {
    if (warehouse.status === "正常") return "bg-green-100 text-green-800";
    if (warehouse.status === "注意") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // 根据库存/需求比确定进度条颜色
  const getProgressColor = () => {
    const ratio = warehouse.inventory / warehouse.forecastDemand;
    if (ratio > 1.2) return "bg-green-500";
    if (ratio > 0.8) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">{warehouse.name}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
          {warehouse.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-gray-500 text-sm">当前库存</span>
          <p className="text-xl font-bold">{warehouse.inventory}</p>
        </div>
        <div>
          <span className="text-gray-500 text-sm">预测需求</span>
          <p className="text-xl font-bold">{warehouse.forecastDemand}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm">库存健康度</span>
          <span className="text-sm font-medium">
            {healthPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressColor()}`}
            style={{ width: `${Math.min(100, healthPercentage)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseCard;