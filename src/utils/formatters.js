// 格式化工具函数

// 格式化货币
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0
  }).format(value);
};

// 格式化日期
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

// 格式化日期时间
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

// 格式化百分比
export const formatPercent = (value, fractionDigits = 0) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);
};

// 格式化数字，添加千位分隔符
export const formatNumber = (value, fractionDigits = 0) => {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);
};

// 格式化库存健康度状态
export const formatInventoryHealthStatus = (inventory, demand) => {
  const ratio = inventory / demand;

  if (ratio > 1.2) {
    return {
      status: "正常",
      color: "bg-green-100 text-green-800",
      progressColor: "bg-green-500"
    };
  } else if (ratio >= 0.8) {
    return {
      status: "注意",
      color: "bg-yellow-100 text-yellow-800",
      progressColor: "bg-yellow-500"
    };
  } else {
    return {
      status: "警告",
      color: "bg-red-100 text-red-800",
      progressColor: "bg-red-500"
    };
  }
};

// 格式化调拨状态
export const formatTransshipmentStatus = (status) => {
  switch (status) {
    case "完成":
      return {
        label: "完成",
        color: "bg-green-100 text-green-800"
      };
    case "进行中":
      return {
        label: "进行中",
        color: "bg-yellow-100 text-yellow-800"
      };
    case "取消":
      return {
        label: "已取消",
        color: "bg-red-100 text-red-800"
      };
    default:
      return {
        label: status,
        color: "bg-gray-100 text-gray-800"
      };
  }
};

// 截断长文本并添加省略号
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// 格式化处理模式标签
export const formatProcessingMode = (mode) => {
  switch (mode) {
    case 'dual':
      return {
        label: "双路径模式",
        color: "bg-blue-100 text-blue-800",
        description: "结合结构化强化学习和语义理解"
      };
    case 'left':
      return {
        label: "左脑模式",
        color: "bg-green-100 text-green-800",
        description: "基于强化学习的结构化决策"
      };
    case 'right':
      return {
        label: "右脑模式",
        color: "bg-purple-100 text-purple-800",
        description: "基于语言模型的语义理解"
      };
    default:
      return {
        label: mode,
        color: "bg-gray-100 text-gray-800",
        description: "未知模式"
      };
  }
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPercent,
  formatNumber,
  formatInventoryHealthStatus,
  formatTransshipmentStatus,
  truncateText,
  formatProcessingMode
};