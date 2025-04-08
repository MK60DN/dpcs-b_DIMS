import React from 'react';
import { Brain, Filter, Plus, RefreshCw } from 'lucide-react';
import WarehouseCard from '../common/WarehouseCard';
// 修改后，添加本地模拟数据:
// 在WarehousesTab.js组件内部定义模拟数据
const mockWarehouseData = [
  { id: 1, name: "仓库A", inventory: 100, forecastDemand: 50, status: "正常" },
  { id: 2, name: "仓库B", inventory: 80, forecastDemand: 70, status: "注意" },
  { id: 3, name: "仓库C", inventory: 120, forecastDemand: 60, status: "正常" },
  { id: 4, name: "仓库D", inventory: 60, forecastDemand: 90, status: "警告" }
];
const WarehousesTab = ({ processingMode, showNotification, setProcessing, processing }) => {

  // 运行需求预测
  const runForecast = () => {
    setProcessing(true);

    // 模拟API调用延迟
    setTimeout(() => {
      showNotification('info', '需求预测已更新');
      setProcessing(false);
    }, 1500);
  };

  // 显示处理模式标签
  const renderProcessingModeTag = () => {
    switch (processingMode) {
      case 'dual':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            双路径预测
          </span>
        );
      case 'left':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
            强化学习预测
          </span>
        );
      case 'right':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
            语义理解预测
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">仓库管理</h2>
        <div className="flex space-x-2">
          <div className="flex items-center mr-4">
            {renderProcessingModeTag()}
          </div>
          <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 flex items-center">
            <Filter size={16} className="mr-1" />
            筛选
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 flex items-center">
            <Plus size={16} className="mr-1" />
            添加仓库
          </button>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center"
            onClick={runForecast}
            disabled={processing}
          >
            {processing ? (
              <>
                <RefreshCw size={16} className="mr-1 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <Brain size={16} className="mr-1" />
                运行需求预测
              </>
            )}
          </button>
        </div>
      </div>

      {/* 仓库卡片网格 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {mockWarehouseData.map((warehouse) => (
          <WarehouseCard key={warehouse.id} warehouse={warehouse} />
        ))}
      </div>

      {/* 库存策略建议 */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <div className="flex items-center mb-2">
          <Brain className="text-blue-600 mr-2" size={20} />
          <h3 className="font-bold">智能库存策略建议</h3>
        </div>
        <p className="text-sm text-gray-700 mb-3">
          基于当前库存水平和需求预测，DPCS-B系统提供以下库存优化建议：
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>仓库A库存水平较高，可考虑调整未来采购计划或将多余库存调拨至其他仓库</li>
          <li>仓库D库存不足，建议优先进行库存调拨补充，保障服务水平</li>
          <li>整体库存分布不均衡，通过调拨平衡可提高资源利用率</li>
        </ul>
      </div>

      {/* 库存数据详情 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold mb-4">库存数据详情</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  仓库名称
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  当前库存
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  预测需求
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  库存/需求比
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockWarehouseData.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {warehouse.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {warehouse.inventory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {warehouse.forecastDemand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(warehouse.inventory / warehouse.forecastDemand).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      warehouse.status === "正常" 
                        ? "bg-green-100 text-green-800" 
                        : warehouse.status === "注意" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-red-100 text-red-800"
                    }`}>
                      {warehouse.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WarehousesTab;