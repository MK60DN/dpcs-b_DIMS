import React, { useState } from 'react';
import { Truck, Brain, GitMerge } from 'lucide-react';
// 修改后，添加本地模拟数据:
// 在TransshipmentTab.js组件内部定义模拟数据
const mockWarehouseData = [
  { id: 1, name: "仓库A", inventory: 100, forecastDemand: 50, status: "正常" },
  { id: 2, name: "仓库B", inventory: 80, forecastDemand: 70, status: "注意" },
  { id: 3, name: "仓库C", inventory: 120, forecastDemand: 60, status: "正常" },
  { id: 4, name: "仓库D", inventory: 60, forecastDemand: 90, status: "警告" }
];

const TransshipmentTab = ({ processingMode, showNotification, setProcessing, processing }) => {
  const [sourceWarehouse, setSourceWarehouse] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState('');
  const [amount, setAmount] = useState('');

  // 过滤可作为来源的仓库(库存大于需求的仓库)
  const sourceWarehouses = mockWarehouseData.filter(w => w.inventory > w.forecastDemand);

  // 过滤可作为目标的仓库(库存小于需求的仓库)
  const targetWarehouses = mockWarehouseData.filter(w => w.inventory < w.forecastDemand);

  // 执行调拨
  const handleTransshipment = () => {
    // 验证输入
    if (!sourceWarehouse || !targetWarehouse || !amount) {
      showNotification('warning', '请完成所有必填字段');
      return;
    }

    setProcessing(true);

    // 模拟API调用延迟
    setTimeout(() => {
      const source = mockWarehouseData.find(w => w.id === parseInt(sourceWarehouse));
      const target = mockWarehouseData.find(w => w.id === parseInt(targetWarehouse));

      showNotification('success', `成功从${source.name}调拨${amount}单位到${target.name}`);
      setProcessing(false);

      // 重置表单
      setAmount('');
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">库存调拨</h2>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* 来源仓库选择 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-4">来源仓库</h3>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={sourceWarehouse}
            onChange={(e) => setSourceWarehouse(e.target.value)}
          >
            <option value="">选择来源仓库</option>
            {sourceWarehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name} (可用: {warehouse.inventory - warehouse.forecastDemand})
              </option>
            ))}
          </select>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">调拨数量</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="输入数量"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* 调拨箭头 */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Truck size={40} className="text-blue-500" />
            <span className="mt-2 text-sm text-gray-500">库存调拨</span>
          </div>
        </div>

        {/* 目标仓库选择 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-4">目标仓库</h3>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={targetWarehouse}
            onChange={(e) => setTargetWarehouse(e.target.value)}
          >
            <option value="">选择目标仓库</option>
            {targetWarehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name} (缺少: {Math.max(0, warehouse.forecastDemand - warehouse.inventory)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 脑科学决策支持 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center mb-4">
          <Brain className="text-blue-500 mr-2" size={20} />
          <h3 className="font-bold">DPCS-B 决策支持</h3>
        </div>

        <div className="p-4 bg-gray-50 rounded border border-gray-200 mb-4">
          <h4 className="font-medium mb-2">左脑分析 (结构化强化学习)</h4>
          <p className="text-sm text-gray-700 mb-2">
            根据系统的结构化强化学习模块分析，从仓库C调拨25单位到仓库D的成本效益最佳。该决策基于以下因素：
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li>仓库C库存水平高于预测需求60单位</li>
            <li>仓库D库存缺口约30单位</li>
            <li>调拨成本与缺货成本比较显示净收益约750</li>
          </ul>
        </div>

        <div className="p-4 bg-gray-50 rounded border border-gray-200 mb-4">
          <h4 className="font-medium mb-2">右脑分析 (语义理解)</h4>
          <p className="text-sm text-gray-700">
            语义理解模块分析了历史调拨模式和季节性因素，建议从仓库C到仓库D的调拨，理由如下：
            <br />
            "历史数据显示仓库D在当前季节通常面临需求增长，而仓库C历来在此时期保持库存盈余。考虑到仓库间的地理位置和运输条件，C到D的调拨是最合理选择。"
          </p>
        </div>

        {processingMode === 'dual' && (
          <div className="p-4 bg-blue-50 rounded border border-blue-200 mb-4">
            <h4 className="font-medium mb-2 flex items-center">
              <GitMerge className="mr-2 text-blue-500" size={16} />
              融合分析
            </h4>
            <p className="text-sm text-gray-700">
              双路径协同分析结果：左右脑分析结果高度一致，均建议从仓库C到仓库D进行调拨。左脑提供了精确的调拨数量建议（25单位），右脑分析提供了额外的季节性考量。综合建议执行从仓库C到仓库D的25单位调拨。
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            onClick={handleTransshipment}
            disabled={processing}
          >
            {processing ? (
              <span>处理中...</span>
            ) : (
              <>
                <Truck className="mr-2" size={18} />
                执行调拨
              </>
            )}
          </button>
        </div>
      </div>

      {/* 最近调拨记录 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold mb-4">最近调拨记录</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  来源仓库
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  目标仓库
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  数量
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  成本
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日期
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">仓库A</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">仓库D</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥200</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-01</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    完成
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">仓库C</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">仓库B</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥150</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-03</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    完成
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">仓库B</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">仓库D</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥120</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-05</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    进行中
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransshipmentTab;