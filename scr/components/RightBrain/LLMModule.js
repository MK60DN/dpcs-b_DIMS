import React, { useState } from 'react';
import { MessageSquare, Send, RefreshCw, Brain, Lightbulb, FileText } from 'lucide-react';

const LLMModule = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState('standard');
  const [analysisMode, setAnalysisMode] = useState('detailed');
  const [conversationHistory, setConversationHistory] = useState([]);

  // 预设情景
  const scenarios = {
    standard: {
      label: "标准市场情况",
      description: "库存调拨的标准决策情境，无特殊事件。",
      context: "当前是4月份，仓库库存情况如下：\n- 仓库A: 库存100，预测需求50\n- 仓库B: 库存80，预测需求70\n- 仓库C: 库存120，预测需求60\n- 仓库D: 库存60，预测需求90"
    },
    seasonal: {
      label: "季节性促销",
      description: "即将到来的季节性促销活动将影响D地区的需求。",
      context: "当前是4月份，仓库库存情况如下：\n- 仓库A: 库存100，预测需求50\n- 仓库B: 库存80，预测需求70\n- 仓库C: 库存120，预测需求60\n- 仓库D: 库存60，预测需求90\n\n特殊情况：D地区下个月将举办大型季节性促销活动，预计需求将增加50%。"
    },
    supply_chain: {
      label: "供应链中断",
      description: "供应商延迟将影响C地区的库存补充。",
      context: "当前是4月份，仓库库存情况如下：\n- 仓库A: 库存100，预测需求50\n- 仓库B: 库存80，预测需求70\n- 仓库C: 库存120，预测需求60\n- 仓库D: 库存60，预测需求90\n\n特殊情况：C地区的主要供应商通知下个月的补货将延迟2周。"
    }
  };

  // 分析模式
  const analysisModes = {
    brief: {
      label: "简要分析",
      systemPrompt: "简洁地提供库存调拨建议"
    },
    detailed: {
      label: "详细分析",
      systemPrompt: "详细分析可能的调拨方案"
    },
    strategic: {
      label: "战略规划",
      systemPrompt: "从战略角度分析调拨决策的长期影响"
    }
  };

  // 模拟响应
  const simulatedResponses = {
    standard: {
      brief: "1. 从仓库C调拨25单位到仓库D。\n2. 从仓库A调拨10单位到仓库B。\n3. 维持其他仓库现状。",
      detailed: "根据当前库存情况分析：\n\n各仓库库存/需求比：\n- 仓库A: 2.0 (充足)\n- 仓库B: 1.14 (略微充足)\n- 仓库C: 2.0 (充足)\n- 仓库D: 0.67 (不足)\n\n仓库D明显存在库存短缺风险，而仓库C有较多剩余库存。考虑到C到D的运输成本相对较低，建议首先进行以下调拨：\n\n**主要调拨建议**：从仓库C调拨25单位到仓库D\n\n理由：\n1. 这将使仓库D的库存增加到85单位，基本满足其90单位的预测需求\n2. 仓库C在调拨后仍有95单位库存，远高于其60单位的预测需求\n3. C到D的运输路线最优，成本较低\n\n**次要调拨建议**：从仓库A调拨10单位到仓库B\n\n理由：\n1. 使仓库B的库存更接近其需求水平\n2. 仓库A有足够的剩余库存\n\n这样的调拨方案可以平衡整个系统的库存，提高整体服务水平，同时控制运输成本。",
      strategic: "# 战略库存调拨分析\n\n## 当前情况概述\n四个仓库中，仓库D面临明显的库存短缺(库存/需求比为0.67)，而仓库A和C则有较高的库存过剩(比率均为2.0)。\n\n## 战略考量\n在标准市场环境下，我们需要平衡以下战略目标：\n- 最小化缺货风险\n- 优化库存持有成本\n- 建立高效的库存网络结构\n- 保持适度的库存缓冲以应对未知波动\n\n## 建议的调拨策略\n**主要调拨**：从仓库C调拨30单位到仓库D\n\n这一调拨略高于当前需求差异，原因是：\n1. 为仓库D建立小型安全库存(额外5单位)\n2. 应对可能的市场波动，4-5月通常是需求上升期\n3. 仓库C有足够剩余，不会影响其服务水平"
    },
    seasonal: {
      brief: "从仓库C调拨35单位到仓库D，从仓库A调拨5单位到仓库B。",
      detailed: "考虑到D地区即将迎来季节性促销，需求将增加50%（总计约135单位），当前库存严重不足。推荐以下调拨方案：\n\n**紧急调拨建议**：从仓库C调拨35单位到仓库D\n\n理由：\n1. 促销活动将使仓库D需求激增，目前库存缺口可能达到75单位\n2. 从库存充足的仓库C调拨是最优选择\n3. 调拨后仓库D库存为95单位，虽仍有缺口但大幅降低了缺货风险\n\n**次要调拨**：从仓库A调拨5单位到仓库B\n\n建议同时加快D地区的补货流程，考虑启动应急采购计划。",
      strategic: "# 季节性促销的战略调拨分析\n\n## 情境评估\nD地区的促销活动将导致需求增加50%，这是一个可预见的临时性需求峰值，需要特别的库存策略。\n\n## 多阶段调拨建议\n\n### 第一阶段：立即行动\n- 从仓库C调拨40单位到仓库D\n- 从仓库A调拨15单位到仓库D\n\n### 第二阶段：促销期间监控\n- 建立每日库存监控机制\n- 准备快速响应调拨预案\n\n### 第三阶段：促销后调整\n- 评估实际需求与预测的偏差\n- 必要时将D地区多余库存调回其他仓库\n\n## 长期建议\n为未来类似的季节性促销活动建立标准化的库存预案，优化整个供应链网络对需求波动的敏感性和响应能力。"
    },
    supply_chain: {
      brief: "提前从仓库C调拨20单位到仓库D，保留C仓库足够安全库存应对供应延迟。",
      detailed: "考虑到C地区供应商将延迟2周补货，需要谨慎规划调拨策略：\n\n**保守调拨建议**：从仓库C调拨20单位到仓库D（而非标准情况下的25-30单位）\n\n理由：\n1. 仓库D仍然面临库存短缺问题，需要调拨\n2. 但仓库C即将面临供应中断风险，需保留更多安全库存\n3. 调拨后仓库C保留100单位库存，对应其60单位需求，提供足够的安全库存度过2周补货延迟期\n\n**附加建议**：\n1. 密切监控仓库C的实际消耗速度\n2. 考虑临时从仓库A调拨10单位到仓库D，分散风险\n3. 提前与D地区客户沟通可能的部分缺货风险",
      strategic: "# 供应链中断下的战略调拨分析\n\n## 风险评估\nC地区供应商延迟2周补货代表一个短期但重要的供应链中断。虽然C仓库当前库存充足，但库存调拨决策需要考虑这一中断的影响。\n\n## 风险缓解策略\n\n### 库存保护措施\n- 将仓库C视为战略库存点，限制其向外调拨量\n- 仅从C调拨15单位到D，保持C有105单位的库存（安全系数1.75）\n\n### 多源补给方案\n- 从仓库A调拨15单位到D\n- 从仓库A调拨5单位到B\n\n### 供应恢复计划\n- 确立明确的决策点，评估供应商延迟是否会进一步延长\n- 准备次要供应商的应急采购渠道\n\n## 系统韧性提升\n这次事件揭示了系统对C地区供应商的依赖性。建议启动供应链韧性项目，增加关键地区的供应商多元化，建立更完善的预警机制。"
    }
  };

  // 获取响应
  const getResponse = () => {
    setLoading(true);

    // 模拟API调用延迟
    setTimeout(() => {
      let context = scenarios[scenario].context;

      // 使用模拟响应
      let aiResponse = "根据提供的库存情况分析，建议从库存较多的仓库向库存不足的仓库进行调拨。";

      if (simulatedResponses[scenario] && simulatedResponses[scenario][analysisMode]) {
        aiResponse = simulatedResponses[scenario][analysisMode];
      }

      // 更新对话历史
      const userMessage = {
        role: 'user',
        content: context
      };

      const assistantMessage = {
        role: 'assistant',
        content: aiResponse
      };

      setConversationHistory([...conversationHistory, userMessage, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  // 清空对话
  const clearConversation = () => {
    setConversationHistory([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">右脑语言模型模块 (语义理解)</h2>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧控制面板 */}
        <div className="col-span-1">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-3">情景选择</h3>
            <div className="space-y-2">
              {Object.entries(scenarios).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-2 rounded cursor-pointer border ${
                    scenario === key
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setScenario(key)}
                >
                  <div className="font-medium">{value.label}</div>
                  <div className="text-xs text-gray-500">{value.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-3">分析模式</h3>
            <div className="space-y-2">
              {Object.entries(analysisModes).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-2 rounded cursor-pointer border ${
                    analysisMode === key
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setAnalysisMode(key)}
                >
                  <div className="font-medium">{value.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold mb-3 flex items-center">
              <Brain className="mr-2 text-blue-500" size={18} />
              语言模型原理
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              右脑模块基于大型语言模型，用于处理非结构化数据和复杂语义理解。在库存调拨中，它能够：
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>解读市场趋势和季节性因素</li>
              <li>考虑特殊事件（如促销、天气、供应链中断）</li>
              <li>整合历史经验和行业知识</li>
              <li>生成可解释的调拨建议</li>
            </ul>
          </div>
        </div>

        {/* 右侧会话界面 */}
        <div className="col-span-2">
          <div className="bg-gray-50 rounded-lg h-96 flex flex-col">
            {/* 消息历史 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                  <MessageSquare size={40} />
                  <p>选择情景并点击"获取分析"开始</p>
                </div>
              ) : (
                conversationHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`max-w-3/4 ${
                      message.role === 'user'
                        ? 'ml-auto bg-blue-100 text-blue-800'
                        : 'mr-auto bg-white text-gray-800 border border-gray-200'
                    } rounded-lg p-3`}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {message.role === 'user' ? '用户输入' : 'AI分析'}
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                ))
              )}
              {loading && (
                <div className="max-w-3/4 mr-auto bg-white text-gray-800 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <RefreshCw size={18} className="animate-spin text-blue-500" />
                    <span>正在分析库存情况...</span>
                  </div>
                </div>
              )}
            </div>

            {/* 输入区域 */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText size={18} className="text-gray-600 mr-2" />
                  <div className="text-sm text-gray-600">
                    使用预设情景: <span className="font-medium">{scenarios[scenario].label}</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    className="text-gray-500 hover:text-gray-700 flex items-center"
                    onClick={clearConversation}
                    disabled={loading || conversationHistory.length === 0}
                  >
                    <RefreshCw size={16} className="mr-1" />
                    清空对话
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                    onClick={getResponse}
                    disabled={loading}
                  >
                    <Brain size={16} className="mr-2" />
                    获取分析
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 分析模式说明 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-bold mb-2">当前分析模式: {analysisModes[analysisMode].label}</h3>
            <p className="text-sm text-gray-700">
              {analysisMode === 'brief' && '提供简洁明了的库存调拨建议，只列出关键点，适合快速决策。'}
              {analysisMode === 'detailed' && '全面分析库存情况，考虑多种因素，提供详细的调拨建议及理由。'}
              {analysisMode === 'strategic' && '从战略角度分析调拨决策，考虑长期影响和市场趋势，提供前瞻性建议。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMModule;