import React, { useState } from 'react';
import { Calendar, Search, Filter, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HistoryTab = () => {
  const [dateRange, setDateRange] = useState('month');
  const [filterStatus, setFilterStatus] = useState('all');

  // 模拟历史调拨数据
  const historyData = [
    { id: 1, from: "仓库A", to: "仓库D", amount: 20, cost: 200, date: "2025-04-01", status: "完成" },
    { id: 2, from: "仓库C", to: "仓库B", amount: 15, cost: 150, date: "2025-04-03", status: "完成" },
    { id: 3, from: "仓库B", to: "仓库D", amount: 10, cost: 120, date: "2025-04-05", status: "进行中" },
    { id: 4, from: "仓库A", to: "仓库B", amount: 25, cost: 250, date: "2025-03-28", status: "完成" },
    { id: 5, from: "仓库C", to: "仓库D", amount: 30, cost: 240, date: "2025-03-20", status: "完成" }
  ];

  // 模拟历史库存趋势数据
  const trendData = [
    { date: '2025-03-10', '仓库A': 90, '仓库B': 75, '仓库C': 110, '仓库D': 50 },
    { date: '2025-03-17', '仓库A': 95, '仓库B': 68, '仓库C': 115, '仓库D': 45 },
    { date: '2025-03-24', '仓库A': 110, '仓库B': 65, '仓库C': 120, '仓库D': 40 },
    { date: '2025-03-31', '仓库A': 105, '仓库B': 85, '仓库C': 125, '仓库D': 50 },
    { date: '2025-04-01', '仓库A': 100, '仓库B': 80, '仓库C': 120, '仓库D': 60 },
    { date: '2025-04-03', '仓库A': 100, '仓库B': 95, '仓库C': 105, '仓库D': 60 },
    { date: '2025-04-06', '仓库A': 95, '仓库B': 90, '仓库C': 105, '仓库D': 70 }
  ];

  // 过滤历史记录
  const filterHistory = () => {
    let filtered = [...historyData];

    // 按状态过滤
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // 按日期范围过滤 (简化版，实际应用中需要更复杂的日期处理)
    if (dateRange === 'week') {
      filtered = filtered.filter(item => new Date(item.date) >= new Date('2025-04-01'));
    }

    return filtered;
  };

  const filteredHistory = filterHistory();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">历史记录</h2>

      {/* 筛选工具栏 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">日期范围</label>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <div className="px-2 py-1 bg-gray-100">
                <Calendar size={16} className="text-gray-500" />
              </div>
              <select
                className="p-1 border-0 outline-none"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="week">最近一周</option>
                <option value="month">最近一个月</option>
                <option value="quarter">最近一季度</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">状态</label>
            <select
              className="p-2 border border-gray-300 rounded"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">全部</option>
              <option value="完成">已完成</option>
              <option value="进行中">进行中</option>
              <option value="取消">已取消</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">搜索</label>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <input type="text" className="p-2 outline-none" placeholder="搜索仓库名称..." />
              <div className="px-2 bg-gray-100">
                <Search size={16} className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center">
          <Download size={16} className="mr-1" />
          导出记录
        </button>
      </div>

      {/* 历史趋势图 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-bold mb-4">库存历史趋势</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
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

      {/* 历史记录表格 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold mb-4">调拨历史记录</h3>
        {filteredHistory.length > 0 ? (
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.from}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.to}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{item.cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === "完成" 
                          ? "bg-green-100 text-green-800" 
                          : item.status === "进行中" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-red-100 text-red-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                      <button>查看详情</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            没有找到匹配的记录
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTab;