import React, { useState } from 'react';
import { Brain, Database, Compass, GitMerge, Clock, Award, BarChart2 } from 'lucide-react';

const ArchitectureView = () => {
  const [activeModule, setActiveModule] = useState(null);

  // 模块详细信息
  const moduleDetails = {
    left: {
      title: "左脑（结构化强化学习模块）",
      description: "基于Actor-Critic架构的强化学习模块，专门处理结构化数据和规则明确的决策任务。在库存管理中，它优化库存水平、订货量和调拨决策。",
      features: [
        "状态表示：将库存水平、需求预测、成本结构等转化为向量表示",
        "动作空间：包括不同的订货策略、调拨量和选择目标仓库",
        "奖励函数：基于库存成本、服务水平和调拨效率",
        "策略网络：生成最优决策行动",
        "价值网络：评估状态价值，辅助决策优化"
      ],
      color: "bg-blue-100 border-blue-300"
    },
    right: {
      title: "右脑（语义理解与语言生成模块）",
      description: "基于大型语言模型的处理模块，擅长处理非结构化数据、文本分析和复杂语义理解。在库存调拨中，它分析市场趋势、季节性因素和特殊事件。",
      features: [
        "文本分析：理解市场报告、供应商通知和特殊情况",
        "情境感知：识别季节性波动和市场趋势",
        "多模态融合：整合数值和文本信息",
        "解释生成：为系统决策提供自然语言解释",
        "知识检索：从历史案例中提取相关经验"
      ],
      color: "bg-green-100 border-green-300"
    },
    middle: {
      title: "中脑（路由选择器）",
      description: "动态决策系统，根据输入任务的特征决定使用左脑、右脑或两者协作处理。它是系统的核心调度器，确保每个任务由最合适的模块处理。",
      features: [
        "特征分析：识别任务的结构化程度和语义复杂性",
        "路径选择：决定任务的处理路径（左脑/右脑/双路径）",
        "负载均衡：优化系统资源分配",
        "自适应学习：从历史任务处理中学习最佳路由策略",
        "失败恢复：在单路径失败时切换到备用路径"
      ],
      color: "bg-purple-100 border-purple-300"
    },
    corpus: {
      title: "胼胝体（信息融合模块）",
      description: "负责左右脑信息的对齐与整合，确保两个路径产生的结果能够有效结合。在库存调拨中，它融合基于规则的优化结果和基于语义的市场洞察。",
      features: [
        "表示对齐：将不同模态的信息映射到共享语义空间",
        "冲突解决：处理左右脑结果的冲突和矛盾",
        "信息增强：识别互补信息，增强最终决策",
        "权重分配：动态调整左右脑结果的权重",
        "一致性检查：确保融合结果的内部一致性"
      ],
      color: "bg-yellow-100 border-yellow-300"
    },
    cerebellum: {
      title: "小脑（时序同步模块）",
      description: "处理时序信息并确保系统各部分的同步协调。在库存管理中，它协调预测、订货和调拨的时间关系，管理库存周期。",
      features: [
        "时序管理：协调系统各组件的时间依赖关系",
        "节奏控制：维持库存周期的稳定节奏",
        "异步处理：管理不同速度的处理模块",
        "时间预测：预测处理任务所需时间",
        "事件调度：管理系统事件的先后顺序"
      ],
      color: "bg-red-100 border-red-300"
    },
    prefrontal: {
      title: "额叶（执行控制模块）",
      description: "负责高级决策和控制功能，整合系统各部分的信息并形成最终决策。在库存调拨中，它根据多方面因素做出最终决策并监控执行。",
      features: [
        "决策整合：综合各模块输出形成最终决策",
        "目标管理：维护系统的整体目标和约束",
        "执行监控：跟踪决策执行情况",
        "适应性调整：根据环境变化调整策略",
        "元认知：评估系统自身的决策质量"
      ],
      color: "bg-indigo-100 border-indigo-300"
    },
    blockchain: {
      title: "区块链组件",
      description: "提供数据透明性和处理可验证性的基础设施，包含数据可用性层(DA)和计算聚合层(Rollup)。确保调拨记录的不可篡改和可审计性。",
      features: [
        "透明记录：记录所有库存交易和调拨决策",
        "数据可用性：确保关键数据持久可访问",
        "计算验证：允许第三方验证系统决策的正确性",
        "分层存储：高效管理不同重要程度的数据",
        "智能合约：自动执行调拨和结算流程"
      ],
      color: "bg-gray-100 border-gray-300"
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">DPCS-B 双路径协调系统架构</h2>

      {/* 系统架构图 */}
      <div className="w-full mb-8 relative">
        <div className="flex flex-wrap justify-center">
          {/* 计算层 */}
          <div className="w-full mb-6">
            <div className="text-center mb-2">
              <h3 className="inline-block bg-blue-600 text-white px-4 py-1 rounded">计算层</h3>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-2">
              {/* 左脑 */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 hover:shadow-lg flex flex-col items-center ${activeModule === 'left' ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}
                onClick={() => setActiveModule(activeModule === 'left' ? null : 'left')}
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <BarChart2 size={32} className="text-blue-600" />
                </div>
                <h4 className="font-bold">左脑模块</h4>
                <p className="text-sm text-center text-gray-600">结构化强化学习</p>
              </div>

              {/* 右脑 */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 hover:shadow-lg flex flex-col items-center ${activeModule === 'right' ? 'border-green-500 shadow-lg' : 'border-gray-200'}`}
                onClick={() => setActiveModule(activeModule === 'right' ? null : 'right')}
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Brain size={32} className="text-green-600" />
                </div>
                <h4 className="font-bold">右脑模块</h4>
                <p className="text-sm text-center text-gray-600">语义理解与语言生成</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* 中脑 */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 hover:shadow-lg flex flex-col items-center ${activeModule === 'middle' ? 'border-purple-500 shadow-lg' : 'border-gray-200'}`}
                onClick={() => setActiveModule(activeModule === 'middle' ? null : 'middle')}
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <Compass size={24} className="text-purple-600" />
                </div>
                <h4 className="font-bold text-sm">中脑模块</h4>
                <p className="text-xs text-center text-gray-600">路由选择器</p>
              </div>

              {/* 胼胝体 */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 hover:shadow-lg flex flex-col items-center ${activeModule === 'corpus' ? 'border-yellow-500 shadow-lg' : 'border-gray-200'}`}
                onClick={() => setActiveModule(activeModule === 'corpus' ? null : 'corpus')}
              >
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                  <GitMerge size={24} className="text-yellow-600" />
                </div>
                <h4 className="font-bold text-sm">胼胝体模块</h4>
                <p className="text-xs text-center text-gray-600">信息融合</p>
              </div>

              {/* 小脑 */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 hover:shadow-lg flex flex-col items-center ${activeModule === 'cerebellum' ? 'border-red-500 shadow-lg' : 'border-gray-200'}`}
                onClick={() => setActiveModule(activeModule === 'cerebellum' ? null : 'cerebellum')}
              >
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <Clock size={24} className="text-red-600" />
                </div>
                <h4 className="font-bold text-sm">小脑模块</h4>
                <p className="text-xs text-center text-gray-600">时序同步</p>
              </div>
            </div>

            <div className="mt-4">
              {/* 额叶 */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 hover:shadow-lg flex flex-col items-center mx-auto max-w-md ${activeModule === 'prefrontal' ? 'border-indigo-500 shadow-lg' : 'border-gray-200'}`}
                onClick={() => setActiveModule(activeModule === 'prefrontal' ? null : 'prefrontal')}
              >
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                  <Award size={28} className="text-indigo-600" />
                </div>
                <h4 className="font-bold">额叶模块</h4>
                <p className="text-sm text-center text-gray-600">执行控制</p>
              </div>
            </div>
          </div>

          {/* 数据层 */}
          <div className="w-full mb-6">
            <div className="text-center mb-2">
              <h3 className="inline-block bg-green-600 text-white px-4 py-1 rounded">数据层</h3>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 hover:shadow-lg flex flex-col items-center mx-auto max-w-md ${activeModule === 'blockchain' ? 'border-gray-500 shadow-lg' : 'border-gray-200'}`}
              onClick={() => setActiveModule(activeModule === 'blockchain' ? null : 'blockchain')}
            >
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Database size={28} className="text-gray-600" />
              </div>
              <h4 className="font-bold">区块链组件</h4>
              <p className="text-sm text-center text-gray-600">数据可用性 + 计算聚合</p>
            </div>
          </div>

          {/* 接口层 */}
          <div className="w-full">
            <div className="text-center mb-2">
              <h3 className="inline-block bg-yellow-600 text-white px-4 py-1 rounded">接口层</h3>
            </div>

            <div className="p-4 border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 w-full max-w-lg mx-auto">
                <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">用户界面</button>
                <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">API接口</button>
                <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">外部系统集成</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 模块详情显示 */}
      {activeModule && (
        <div className={`mt-8 p-6 rounded-lg border-2 ${moduleDetails[activeModule].color}`}>
          <h3 className="text-xl font-bold mb-3">{moduleDetails[activeModule].title}</h3>
          <p className="mb-4 text-gray-700">{moduleDetails[activeModule].description}</p>

          <h4 className="font-bold mb-2">核心功能:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {moduleDetails[activeModule].features.map((feature, index) => (
              <li key={index} className="text-gray-700">{feature}</li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between items-center">
            <button
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              onClick={() => setActiveModule(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回架构图
            </button>

            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
              查看详细文档
            </button>
          </div>
        </div>
      )}

      {/* 处理流程说明 */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">DPCS-B 库存调拨处理流程</h3>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <ol className="list-decimal pl-5 space-y-2">
            <li className="text-gray-700">
              <span className="font-medium">任务识别与特征提取</span>:
              当有库存调拨需求时，中脑模块首先分析任务特征，决定是使用左脑(RL)、右脑(LLM)还是双路径协同处理。
            </li>
            <li className="text-gray-700">
              <span className="font-medium">左脑路径(结构化处理)</span>:
              基于强化学习模型分析库存水平、成本结构和历史数据，生成最优调拨方案。
            </li>
            <li className="text-gray-700">
              <span className="font-medium">右脑路径(语义理解)</span>:
              分析非结构化市场信息、季节趋势和特殊事件，提供情境化的调拨建议。
            </li>
            <li className="text-gray-700">
              <span className="font-medium">信息融合</span>:
              胼胝体模块将左右脑的输出进行对齐和整合，解决可能的冲突，形成综合建议。
            </li>
            <li className="text-gray-700">
              <span className="font-medium">决策执行</span>:
              额叶模块做出最终决策，并通过分布式代理网络执行库存调拨操作。
            </li>
            <li className="text-gray-700">
              <span className="font-medium">透明记录</span>:
              所有调拨决策和执行过程通过区块链组件记录，确保透明性和可追溯性。
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureView;