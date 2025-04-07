// API服务封装
import { mockWarehouseData, mockTransshipmentHistory, mockLLMResponses } from './mockData';

// 基础URL，在实际项目中应该从环境变量中读取
const BASE_URL = process.env.REACT_APP_API_URL || 'https://api.dpcs-b.example.com/v1';

// 创建通用的请求函数
const request = async (endpoint, options = {}) => {
  // 在实际项目中，这里会进行真实的API调用
  // 这里使用模拟数据进行演示
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟网络延迟
      console.log(`API Call to ${endpoint}`, options);
      resolve(mockResponse(endpoint, options));
    }, 800);
  });
};

// 模拟API响应
const mockResponse = (endpoint, options) => {
  switch (endpoint) {
    case '/warehouses':
      return { success: true, data: mockWarehouseData };

    case '/warehouses/forecast':
      return {
        success: true,
        data: mockWarehouseData.map(w => ({
          ...w,
          forecastDemand: Math.round(w.forecastDemand * (0.9 + Math.random() * 0.2)) // 模拟略微不同的预测结果
        }))
      };

    case '/transshipments':
      if (options.method === 'GET') {
        return { success: true, data: mockTransshipmentHistory };
      } else if (options.method === 'POST') {
        // 模拟创建调拨记录
        return {
          success: true,
          data: {
            id: mockTransshipmentHistory.length + 1,
            ...options.body,
            date: new Date().toISOString().split('T')[0],
            status: "进行中"
          }
        };
      }
      break;

    case '/decisions/llm':
      // 模拟LLM决策
      const { scenario, mode } = options.body || {};
      return {
        success: true,
        data: {
          recommendation: mockLLMResponses[scenario]?.[mode] || "分析库存数据后，建议进行适当的库存调拨以平衡各仓库库存。"
        }
      };

    case '/decisions/rl':
      // 模拟RL决策
      return {
        success: true,
        data: {
          action: { from: 2, to: 3, amount: 25 },
          expectedReward: 750.5,
          confidence: 0.92
        }
      };

    default:
      return { success: false, error: "未知的API端点" };
  }
};

// 导出API函数
export const API = {
  // 仓库相关API
  getWarehouses: () => request('/warehouses'),

  updateWarehouse: (id, data) => request(`/warehouses/${id}`, {
    method: 'PUT',
    body: data
  }),

  runDemandForecast: () => request('/warehouses/forecast', {
    method: 'POST'
  }),

  // 调拨相关API
  getTransshipments: () => request('/transshipments'),

  createTransshipment: (data) => request('/transshipments', {
    method: 'POST',
    body: data
  }),

  // 决策相关API
  getLLMDecision: (scenario, mode) => request('/decisions/llm', {
    method: 'POST',
    body: { scenario, mode }
  }),

  getRLDecision: (state) => request('/decisions/rl', {
    method: 'POST',
    body: { state }
  }),

  // 融合决策
  getFusedDecision: (state, scenario, mode) => request('/decisions/fused', {
    method: 'POST',
    body: { state, scenario, mode }
  }),

  // 系统设置
  getSystemSettings: () => request('/settings'),

  updateSystemSettings: (settings) => request('/settings', {
    method: 'PUT',
    body: settings
  })
};

export default API;