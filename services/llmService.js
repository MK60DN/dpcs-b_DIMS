// 语言模型服务模块
import { mockLLMResponses } from './mockData';

// 生成系统提示
export const generateSystemPrompt = (mode) => {
  const basePrompt = "你是一个专家级库存管理顾问，擅长分析库存数据并提供调拨建议。";

  switch (mode) {
    case 'brief':
      return `${basePrompt} 请简洁地提供库存调拨建议，只列出关键点。`;
    case 'detailed':
      return `${basePrompt} 请详细分析库存情况，考虑多种因素，提供详细的调拨建议及理由。`;
    case 'strategic':
      return `${basePrompt} 请从战略角度分析调拨决策，考虑长期影响和市场趋势，提供前瞻性建议。`;
    default:
      return basePrompt;
  }
};

// 生成用户提示
export const generateUserPrompt = (warehouseData, scenarioContext) => {
  // 格式化库存数据
  const inventoryInfo = warehouseData.map(warehouse =>
    `- ${warehouse.name}: 库存${warehouse.inventory}，预测需求${warehouse.forecastDemand}`
  ).join('\n');

  let prompt = `当前库存情况如下：\n${inventoryInfo}\n\n请分析这些数据并推荐最佳的库存调拨策略。`;

  // 添加场景特定信息
  if (scenarioContext) {
    prompt += `\n\n特殊情况：${scenarioContext}`;
  }

  return prompt;
};

// 从响应中提取调拨建议
export const extractTransshipmentSuggestions = (llmResponse) => {
  const suggestions = [];

  // 尝试识别常见的调拨建议格式
  // 例如 "从仓库X调拨Y单位到仓库Z"
  const regex = /从(仓库[A-Z])\s*调拨\s*(\d+)\s*单位\s*到\s*(仓库[A-Z])/g;
  let match;

  while ((match = regex.exec(llmResponse)) !== null) {
    suggestions.push({
      from: match[1],
      to: match[3],
      amount: parseInt(match[2])
    });
  }

  return suggestions;
};

// 模拟LLM请求函数
export const requestLLMAnalysis = async (scenario, mode, temperature = 0.7) => {
  // 在实际应用中，这里应该调用真实的LLM API
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 使用模拟响应
      const response = mockLLMResponses[scenario]?.[mode] ||
                     "根据提供的库存情况分析，建议从库存较多的仓库向库存不足的仓库进行调拨。";

      resolve({
        response,
        suggestions: extractTransshipmentSuggestions(response)
      });
    }, 1000);
  });
};

// 情景描述生成
export const getScenarioDescription = (scenario) => {
  switch (scenario) {
    case 'seasonal':
      return "D地区下个月将举办大型季节性促销活动，预计需求将增加50%。";
    case 'supply_chain':
      return "C地区的主要供应商通知下个月的补货将延迟2周。";
    case 'standard':
    default:
      return null; // 标准情况下没有特殊上下文
  }
};

// 评估LLM建议的可行性
export const evaluateSuggestionFeasibility = (suggestion, warehouseData) => {
  // 获取来源和目标仓库
  const fromWarehouse = warehouseData.find(w => w.name === suggestion.from);
  const toWarehouse = warehouseData.find(w => w.name === suggestion.to);

  if (!fromWarehouse || !toWarehouse) {
    return {
      feasible: false,
      reason: "找不到指定的仓库"
    };
  }

  // 检查是否有足够库存
  if (fromWarehouse.inventory < suggestion.amount) {
    return {
      feasible: false,
      reason: `${suggestion.from}没有足够的库存进行调拨`
    };
  }

  // 检查是否超过目标仓库容量
  if (toWarehouse.inventory + suggestion.amount > toWarehouse.capacity) {
    return {
      feasible: false,
      reason: `调拨后将超过${suggestion.to}的库存容量`
    };
  }

  return {
    feasible: true
  };
};

export default {
  generateSystemPrompt,
  generateUserPrompt,
  extractTransshipmentSuggestions,
  requestLLMAnalysis,
  getScenarioDescription,
  evaluateSuggestionFeasibility
};