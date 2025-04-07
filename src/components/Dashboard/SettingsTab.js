import React, { useState } from 'react';
import { BarChart2, Brain, GitMerge, Save } from 'lucide-react';

const SettingsTab = ({ processingMode }) => {
  // 左脑设置
  const [learningRate, setLearningRate] = useState(0.1);
  const [discountFactor, setDiscountFactor] = useState(0.9);
  const [explorationRate, setExplorationRate] = useState(0.2);

  // 右脑设置
  const [llmModel, setLlmModel] = useState('CAMEL Agent');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);

  // 信息融合设置
  const [leftWeight, setLeftWeight] = useState(0.5);
  const [rightWeight, setRightWeight] = useState(0.5);

  // 系统通用设置
  const [autoMode, setAutoMode] = useState(true);
  const [notification, setNotification] = useState(true);

  // 保存设置
  const saveSettings = () => {
    // 这里应该是调用API保存设置
    console.log('设置已保存');

    // 在实际应用中，可以显示保存成功的通知
    alert('设置已成功保存');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">系统设置</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* 左脑设置 */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="text-blue-500 mr-2" size={20} />
            <h3 className="font-bold">左脑（结构化强化学习）设置</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">学习率 (α)</label>
              <input
                type="range"
                min="0.01"
                max="1"
                step="0.01"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0.01</span>
                <span>{learningRate}</span>
                <span>1</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">折扣因子 (γ)</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={discountFactor}
                onChange={(e) => setDiscountFactor(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0.1</span>
                <span>{discountFactor}</span>
                <span>1</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">探索率 (ε)</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explorationRate}
                onChange={(e) => setExplorationRate(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{explorationRate}</span>
                <span>1</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">模型架构</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>Actor-Critic</option>
                <option>DQN</option>
                <option>DDPG</option>
                <option>PPO</option>
              </select>
            </div>
          </div>
        </div>

        {/* 右脑设置 */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center mb-4">
            <Brain className="text-green-500 mr-2" size={20} />
            <h3 className="font-bold">右脑（语义理解）设置</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">模型选择</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={llmModel}
                onChange={(e) => setLlmModel(e.target.value)}
              >
                <option>CAMEL Agent</option>
                <option>GPT-4</option>
                <option>Llama 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">温度</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 (确定性)</span>
                <span>{temperature}</span>
                <span>2 (创造性)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最大令牌数</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>100</span>
                <span>{maxTokens}</span>
                <span>2000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">系统提示定制</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded h-20"
                placeholder="输入自定义系统提示..."
                defaultValue="你是一个专家级库存管理顾问，擅长分析库存数据并提供调拨建议。"
              ></textarea>
            </div>
          </div>
        </div>

        {/* 信息融合设置 */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center mb-4">
            <GitMerge className="text-purple-500 mr-2" size={20} />
            <h3 className="font-bold">信息融合设置</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">左脑权重</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={leftWeight}
                onChange={(e) => {
                  setLeftWeight(parseFloat(e.target.value));
                  setRightWeight(1 - parseFloat(e.target.value));
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{leftWeight}</span>
                <span>1</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">右脑权重</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={rightWeight}
                onChange={(e) => {
                  setRightWeight(parseFloat(e.target.value));
                  setLeftWeight(1 - parseFloat(e.target.value));
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{rightWeight}</span>
                <span>1</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">融合策略</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>加权平均</option>
                <option>投票机制</option>
                <option>自适应权重</option>
                <option>级联决策</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={true}
                readOnly
              />
              <label className="ml-2 block text-sm text-gray-900">启用冲突解决机制</label>
            </div>
          </div>
        </div>

        {/* 系统通用设置 */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center mb-4">
            <h3 className="font-bold">系统通用设置</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">自动模式</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={autoMode}
                  onChange={() => setAutoMode(!autoMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">系统通知</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notification}
                  onChange={() => setNotification(!notification)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">默认处理模式</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>双路径模式</option>
                <option>左脑(RL)模式</option>
                <option>右脑(LLM)模式</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">系统语言</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>中文</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          onClick={saveSettings}
        >
          <Save size={18} className="mr-2" />
          保存设置
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;