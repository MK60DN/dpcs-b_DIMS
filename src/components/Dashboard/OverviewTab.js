import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, Database, ShoppingCart, TrendingUp } from 'lucide-react';
// 修改后，添加本地模拟数据:
// 在OverviewTab.js组件内部定义模拟数据
const mockWarehouseData = [
  { id: 1, name: "仓库A", inventory: 100, forecastDemand: 50, status: "正常" },
  { id: 2, name: "仓库B", inventory: 80, forecastDemand: 70, status: "注意" },
  { id: 3, name: "仓库C", inventory: 120, forecastDemand: 60, status: "正常" },
  { id: 4, name: "仓库D", inventory: 60, forecastDemand: 90, status: "警告" }
];

const mockInventoryTrends = [
  { date: '03-10', '仓库A': 90, '仓库B': 75, '仓库C': 110, '仓库D': 50 },
  { date: '03-15', '仓库A': 95, '仓库B': 70, '仓库C': 115, '仓库D': 45 },
  { date: '03-20', '仓库A': 100, '仓库B': 65, '仓库C': 118, '仓库D': 40 },
  { date: '03-25', '仓库A': 105, '仓库B': 70, '仓库C': 120, '仓库D': 45 },
  { date: '03-30', '仓库A': 110, '仓库B': 75, '仓库C': 125, '仓库D': 50 },
  { date: '04-01', '仓库A': 100, '仓库B': 80, '仓库C': 120, '仓库D': 60 },
  { date: '04-05', '仓库A': 95, '仓库B': 90, '仓库C': 105, '仓库D': 70 }
];

const OverviewTab = ({ processingMode }) => {
  // 计算概览数据
  const totalInventory = mockWarehouseData.reduce((sum, w) => sum + w.inventory, 0);
  const totalDemand = mockWarehouseData.reduce((sum, w) => sum + w.forecastDemand, 0);
  const warehouseCount = mockWarehouseData.length;
  const activeTransshipments = 2;

  // 库存健康度数据
  const inventoryHealthData = [
    { name: '充足', value: mockWarehouseData.filter(w => w.inventory / w.forecastDemand > 1.2).length },
    { name: '适中', value: mockWarehouseData.filter(w => w.inventory / w.forecastDemand <= 1.2 && w.inventory / w.forecastDemand >= 0.8).length },
    { name: '不足', value: mockWarehouseData.filter(w => w.inventory / w.forecastDemand < 0.8).length }
  ];

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

  // 处理模式说明
  const processingModeDetails = {
    dual: {
      title: "双路径协同模式",
      description: "结合结构化强化学习和语言模型的语义理解，提供全面平衡的决策支持。",
      icon: <Brain size={24} className="text-blue-500" />
    },
    left: {
      title: "左脑模式（强化学习优先）",
      description: "侧重基于结构化数据的优化决策，适合标准化、重复性的库存调拨任务。",
      icon: <TrendingUp size={24} className="text-blue-500" />
    },
    right: {
      title: "右脑模式（语义理解优先）",
      description: "侧重市场趋势和特殊事件分析，适合复杂多变的决策环境。",
      icon: <Database size={24} className="text-blue-500" />
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">系统概览</h2>

      {/* 当前处理模式卡片 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center">
          {processingModeDetails[processingMode].icon}
          <h3 className="font-bold ml-2">{processingModeDetails[processingMode].title}</h3>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          {processingModeDetails[processingMode].description}
        </p>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">总库存</h3>
          <p className="text-2xl font-bold">{totalInventory}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">总需求预测</h3>
          <p className="text-2xl font-bold">{totalDemand}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">仓库数量</h3>
          <p className="text-2xl font-bold">{warehouseCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">进行中调拨</h3>
          <p className="text-2xl font-bold">{activeTransshipments}</p>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-5 gap-6 mb-6">
        {/* 库存趋势图 */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-4">库存趋势 (近30天)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockInventoryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="仓库A" stroke="#8884d8" />
                <Line type="monotone" dataKey="仓库B" stroke="#82ca9d" />
                <Line type="monotone" dataKey="仓库C" stroke="#ff7300" />
                <Line type="monotone" dataKey="仓库D" stroke="#0088fe" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 库存健康度饼图 */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-4">仓库库存健康度</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryHealthData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 系统状态摘要 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="font-bold mb-4">系统状态摘要</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="font-medium">需求预测准确率</span>
            </div>
            <span className="font-medium">91%</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="font-medium">系统响应时间</span>
            </div>
            <span className="font-medium">0.8s</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="font-medium">调拨执行率</span>
            </div>
            <span className="font-medium">87%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="font-medium">系统健康度</span>
            </div>
            <span className="font-medium">98%</span>
          </div>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold mb-4">最近活动</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <ShoppingCart size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="font-medium">从仓库C调拨25单位到仓库D</div>
              <div className="text-sm text-gray-500">2025-04-07 10:45:23</div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <TrendingUp size={16} className="text-green-600" />
            </div>
            <div>
              <div className="font-medium">需求预测更新完成</div>
              <div className="text-sm text-gray-500">2025-04-06 17:30:10</div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <Database size={16} className="text-yellow-600" />
            </div>
            <div>
              <div className="font-medium">仓库B库存水平预警</div>
              <div className="text-sm text-gray-500">2025-04-05 09:12:45</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;