// 系统常量

// 处理模式
export const PROCESSING_MODES = {
  DUAL: 'dual',
  LEFT: 'left',
  RIGHT: 'right'
};

// 分析模式
export const ANALYSIS_MODES = {
  BRIEF: 'brief',
  DETAILED: 'detailed',
  STRATEGIC: 'strategic'
};

// 情景类型
export const SCENARIO_TYPES = {
  STANDARD: 'standard',
  SEASONAL: 'seasonal',
  SUPPLY_CHAIN: 'supply_chain'
};

// 调拨状态
export const TRANSSHIPMENT_STATUS = {
  PENDING: '待处理',
  IN_PROGRESS: '进行中',
  COMPLETED: '完成',
  CANCELED: '取消'
};

// 库存状态阈值
export const INVENTORY_THRESHOLDS = {
  SUFFICIENT: 1.2, // 库存/需求 > 1.2 为充足
  WARNING: 0.8,    // 库存/需求 < 0.8 为警告
};

// 系统模块
export const SYSTEM_MODULES = {
  LEFT_BRAIN: 'left_brain',
  RIGHT_BRAIN: 'right_brain',
  MID_BRAIN: 'mid_brain',
  CORPUS_CALLOSUM: 'corpus_callosum',
  CEREBELLUM: 'cerebellum',
  PREFRONTAL: 'prefrontal',
  BLOCKCHAIN: 'blockchain'
};

// RL参数范围
export const RL_PARAM_RANGES = {
  LEARNING_RATE: {
    MIN: 0.01,
    MAX: 1,
    DEFAULT: 0.1
  },
  DISCOUNT_FACTOR: {
    MIN: 0.1,
    MAX: 0.99,
    DEFAULT: 0.9
  },
  EXPLORATION_RATE: {
    MIN: 0.01,
    MAX: 1,
    DEFAULT: 0.2
  }
};

// LLM参数范围
export const LLM_PARAM_RANGES = {
  TEMPERATURE: {
    MIN: 0,
    MAX: 2,
    DEFAULT: 0.7
  },
  MAX_TOKENS: {
    MIN: 100,
    MAX: 2000,
    DEFAULT: 1000
  }
};

// 图表颜色
export const CHART_COLORS = {
  WAREHOUSE_A: '#8884d8',
  WAREHOUSE_B: '#82ca9d',
  WAREHOUSE_C: '#ff7300',
  WAREHOUSE_D: '#0088fe',
  REWARD: '#8884d8',
  CUMULATIVE: '#ff7300',
  GOOD: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444'
};

// 时间范围选项
export const TIME_RANGES = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year'
};

// 系统API端点
export const API_ENDPOINTS = {
  WAREHOUSES: '/warehouses',
  FORECAST: '/warehouses/forecast',
  TRANSSHIPMENTS: '/transshipments',
  RL_DECISION: '/decisions/rl',
  LLM_DECISION: '/decisions/llm',
  FUSED_DECISION: '/decisions/fused',
  SETTINGS: '/settings'
};

// 系统事件类型
export const SYSTEM_EVENTS = {
  TRANSSHIPMENT_CREATED: 'transshipment_created',
  FORECAST_UPDATED: 'forecast_updated',
  INVENTORY_WARNING: 'inventory_warning',
  SYSTEM_ERROR: 'system_error'
};

export default {
  PROCESSING_MODES,
  ANALYSIS_MODES,
  SCENARIO_TYPES,
  TRANSSHIPMENT_STATUS,
  INVENTORY_THRESHOLDS,
  SYSTEM_MODULES,
  RL_PARAM_RANGES,
  LLM_PARAM_RANGES,
  CHART_COLORS,
  TIME_RANGES,
  API_ENDPOINTS,
  SYSTEM_EVENTS
};