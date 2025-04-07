import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const RLModule = () => {
  // 导入状态、Q表、参数等数据和功能从服务
  const [state, setState] = useState({
    warehouses: [
      { id: 1, name: "仓库A", inventory: 100, capacity: 200, demand: 50, cost: 2 },
      { id: 2, name: "仓库B", inventory: 80, capacity: 150, demand: 70, cost: 2.5 },
      { id: 3, name: "仓库C", inventory: 120, capacity: 200, demand: 60, cost: 1.8 },
      { id: 4, name: "仓库D", inventory: 60, capacity: 180, demand: 90, cost: 3 }
    ],
    transportCosts: [
      [0, 10, 15, 20],
      [10, 0, 12, 18],
      [15, 12, 0, 8],
      [20, 18, 8, 0]
    ],
    epoch: 0,
    cumulativeReward: 0,
    history: [],
    actionHistory: []
  });

  // 模拟RL动作空间
  const actions = [
    { from: 2, to: 3, amount: 25 }, // 从仓库C到仓库D调拨25单位
    { from: 0, to: 3, amount: 20 }, // 从仓库A到仓库D调拨20单位
    { from: 0, to: 1, amount: 15 }, // 从仓库A到仓库B调拨15单位
    { from: 2, to: 1, amount: 10 }, // 从仓库C到仓库B调拨10单位
    { from: 1, to: 3, amount: 5 }   // 从仓库B到仓库D调拨5单位
  ];

  // RL参数
  const [learningRate, setLearningRate] = useState(0.1);
  const [discountFactor, setDiscountFactor] = useState(0.9);
  const [explorationRate, setExplorationRate] = useState(0.2);
  const [autoTraining, setAutoTraining] = useState(false);
  const [trainSpeed, setTrainSpeed] = useState(500); // ms
  const [selectedActionIndex, setSelectedActionIndex] = useState(null);
  const [qTable, setQTable] = useState({});

  // 初始化Q表
  useEffect(() => {
    initializeQTable();
  }, []);

  // Q表初始化
  const initializeQTable = () => {
    const initialQTable = {};
    for (let inventoryA = 0; inventoryA <= 200; inventoryA += 40) {
      for (let inventoryB = 0; inventoryB <= 150; inventoryB += 30) {
        for (let inventoryC = 0; inventoryC <= 200; inventoryC += 40) {
          for (let inventoryD = 0; inventoryD <= 180; inventoryD += 35) {
            const stateKey = `${inventoryA}-${inventoryB}-${inventoryC}-${inventoryD}`;
            initialQTable[stateKey] = actions.map(() => Math.random() * 10); // 随机初始化Q值
          }
        }
      }
    }
    setQTable(initialQTable);
  };

  // 获取状态的离散表示
  const getDiscreteState = (warehouses) => {
    const discreteA = Math.floor(warehouses[0].inventory / 40) * 40;
    const discreteB = Math.floor(warehouses[1].inventory / 30) * 30;
    const discreteC = Math.floor(warehouses[2].inventory / 40) * 40;
    const discreteD = Math.floor(warehouses[3].inventory / 35) * 35;
    return `${discreteA}-${discreteB}-${discreteC}-${discreteD}`;
  };

  // 计算奖励
  const calculateReward = (state, action) => {
    const { warehouses, transportCosts } = state;
    const { from, to, amount } = action;

    // 检查库存是否足够
    if (warehouses[from].inventory < amount) {
      return -50; // 严重惩罚不可行动作
    }

    // 计算调拨后的库存水平
    const fromInventory = warehouses[from].inventory - amount;
    const toInventory = warehouses[to].inventory + amount;

    // 计算调拨成本
    const transportCost = transportCosts[from][to] * amount;

    // 计算调拨收益 (改善目标仓库的库存缺口)
    const inventoryGap = warehouses[to].demand - warehouses[to].inventory;
    const improvementValue = Math.min(amount, Math.max(0, inventoryGap)) * 5;

    // 计算源仓库的潜在风险
    const sourceRisk = Math.max(0, warehouses[from].demand - fromInventory) * 3;

    // 计算持有成本变化
    const oldHoldingCost = warehouses[from].cost * warehouses[from].inventory +
                         warehouses[to].cost * warehouses[to].inventory;
    const newHoldingCost = warehouses[from].cost * fromInventory +
                         warehouses[to].cost * toInventory;
    const holdingCostDiff = oldHoldingCost - newHoldingCost;

    // 计算总奖励
    return improvementValue - transportCost - sourceRisk + holdingCostDiff;
  };

  // 执行动作并更新状态
  const executeAction = (state, actionIndex) => {
    const action = actions[actionIndex];
    const newState = JSON.parse(JSON.stringify(state)); // 深拷贝

    // 计算奖励
    const reward = calculateReward(state, action);

    // 如果是有效动作，更新库存
    if (reward > -50) {
      newState.warehouses[action.from].inventory -= action.amount;
      newState.warehouses[action.to].inventory += action.amount;
    }

    // 更新状态
    newState.epoch += 1;
    newState.cumulativeReward += reward;

    // 记录历史
    newState.history.push({
      epoch: newState.epoch,
      reward: reward,
      cumulativeReward: newState.cumulativeReward,
      warehouseA: newState.warehouses[0].inventory,
      warehouseB: newState.warehouses[1].inventory,
      warehouseC: newState.warehouses[2].inventory,
      warehouseD: newState.warehouses[3].inventory
    });

    newState.actionHistory.push({
      epoch: newState.epoch,
      from: state.warehouses[action.from].name,
      to: state.warehouses[action.to].name,
      amount: action.amount,
      reward: reward
    });

    return newState;
  };

  // RL训练步骤
  const trainStep = () => {
    // 获取当前状态
    const currentStateKey = getDiscreteState(state.warehouses);

    // 选择动作 (ε-贪婪策略)
    let actionIndex;
    if (Math.random() < explorationRate) {
      // 探索 - 随机选择动作
      actionIndex = Math.floor(Math.random() * actions.length);
    } else {
      // 利用 - 选择Q值最大的动作
      actionIndex = qTable[currentStateKey].indexOf(Math.max(...qTable[currentStateKey]));
    }

    // 执行动作，获取新状态和奖励
    const newState = executeAction(state, actionIndex);
    const reward = newState.history[newState.history.length - 1].reward;

    // 获取新状态的离散表示
    const newStateKey = getDiscreteState(newState.warehouses);

    // Q-learning更新
    const oldQValue = qTable[currentStateKey][actionIndex];
    const maxNextQ = Math.max(...qTable[newStateKey]);
    const newQValue = oldQValue + learningRate * (reward + discountFactor * maxNextQ - oldQValue);

    // 更新Q表
    const newQTable = {...qTable};
    newQTable[currentStateKey][actionIndex] = newQValue;

    // 更新状态和Q表
    setQTable(newQTable);
    setState(newState);
    setSelectedActionIndex(actionIndex);
  };

  // 自动训练
  useEffect(() => {
    let intervalId;
    if (autoTraining) {
      intervalId = setInterval(() => {
        trainStep();
        // 逐渐减小探索率
        setExplorationRate(prev => Math.max(0.05, prev * 0.995));
      }, trainSpeed);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoTraining, trainSpeed, state, qTable, learningRate, discountFactor, explorationRate]);

  // 获取当前推荐动作
  const getRecommendedAction = () => {
    const currentStateKey = getDiscreteState(state.warehouses);
    const actionIndex = qTable[currentStateKey] ?
      qTable[currentStateKey].indexOf(Math.max(...qTable[currentStateKey])) : 0;

    return {
      ...actions[actionIndex],
      qValue: qTable[currentStateKey] ? qTable[currentStateKey][actionIndex] : 0
    };
  };

  // 重置状态
  const resetState = () => {
    setState({
      warehouses: [
        { id: 1, name: "仓库A", inventory: 100, capacity: 200, demand: 50, cost: 2 },
        { id: 2, name: "仓库B", inventory: 80, capacity: 150, demand: 70, cost: 2.5 },
        { id: 3, name: "仓库C", inventory: 120, capacity: 200, demand: 60, cost: 1.8 },
        { id: 4, name: "仓库D", inventory: 60, capacity: 180, demand: 90, cost: 3 }
      ],
      transportCosts: [
        [0, 10, 15, 20],
        [10, 0, 12, 18],
        [15, 12, 0, 8],
        [20, 18, 8, 0]
      ],
      epoch: 0,
      cumulativeReward: 0,
      history: [],
      actionHistory: []
    });
    setExplorationRate(0.2);
    setSelectedActionIndex(null);
  };

  // 格式化货币显示
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">左脑强化学习模块 (结构化决策)</h2>

      {/* 控制面板 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">学习率 (α)</label>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0.01</span>
            <span>{learningRate.toFixed(2)}</span>
            <span>0.5</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">折扣因子 (γ)</label>
          <input
            type="range"
            min="0.1"
            max="0.99"
            step="0.01"
            value={discountFactor}
            onChange={(e) => setDiscountFactor(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0.1</span>
            <span>{discountFactor.toFixed(2)}</span>
            <span>0.99</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">探索率 (ε)</label>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={explorationRate}
            onChange={(e) => setExplorationRate(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0.01</span>
            <span>{explorationRate.toFixed(2)}</span>
            <span>0.5</span>
          </div>
        </div>
      </div>

      {/* 训练控制 */}
      <div className="flex justify-between mb-6">
        <div className="flex space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={trainStep}
            disabled={autoTraining}
          >
            单步训练
          </button>

          <button
            className={`px-4 py-2 rounded ${autoTraining ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            onClick={() => setAutoTraining(!autoTraining)}
          >
            {autoTraining ? '停止自动训练' : '开始自动训练'}
          </button>

          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            onClick={resetState}
            disabled={autoTraining}
          >
            重置
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm">训练速度:</span>
          <select
            value={trainSpeed}
            onChange={(e) => setTrainSpeed(parseInt(e.target.value))}
            className="border border-gray-300 rounded p-1"
            disabled={autoTraining}
          >
            <option value="1000">慢速</option>
            <option value="500">中速</option>
            <option value="200">快速</option>
            <option value="50">极速</option>
          </select>
        </div>
      </div>

      {/* 状态显示 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-3">当前状态</h3>
          <div className="grid grid-cols-2 gap-4">
            {state.warehouses.map(warehouse => (
              <div key={warehouse.id} className="bg-white p-3 rounded shadow">
                <h4 className="font-medium mb-2">{warehouse.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">当前库存:</span>
                    <p className="font-medium">{warehouse.inventory}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">预测需求:</span>
                    <p className="font-medium">{warehouse.demand}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">库存容量:</span>
                    <p className="font-medium">{warehouse.capacity}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">持有成本:</span>
                    <p className="font-medium">{formatCurrency(warehouse.cost)}/单位</p>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs">
                    <span>库存水平</span>
                    <span>{Math.round((warehouse.inventory / warehouse.capacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        warehouse.inventory < warehouse.demand 
                          ? "bg-red-500" 
                          : warehouse.inventory > warehouse.capacity * 0.8 
                            ? "bg-orange-500" 
                            : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(100, (warehouse.inventory / warehouse.capacity) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-3">强化学习状态</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-3 rounded shadow">
              <h4 className="font-medium mb-2">训练指标</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">当前周期:</span>
                  <p className="font-medium">{state.epoch}</p>
                </div>
                <div>
                  <span className="text-gray-500">累计奖励:</span>
                  <p className="font-medium">{state.cumulativeReward.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-500">状态空间大小:</span>
                  <p className="font-medium">6 × 6 × 6 × 6</p>
                </div>
                <div>
                  <span className="text-gray-500">动作空间大小:</span>
                  <p className="font-medium">{actions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded shadow">
              <h4 className="font-medium mb-2">推荐调拨</h4>
              {state.epoch > 0 && (
                <div className="text-sm">
                  <div className="mb-2">
                    <span className="text-gray-500">来源仓库:</span>
                    <p className="font-medium">{state.warehouses[getRecommendedAction().from].name}</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-500">目标仓库:</span>
                    <p className="font-medium">{state.warehouses[getRecommendedAction().to].name}</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-500">调拨数量:</span>
                    <p className="font-medium">{getRecommendedAction().amount} 单位</p>
                  </div>
                  <div>
                    <span className="text-gray-500">预期奖励:</span>
                    <p className="font-medium">{getRecommendedAction().qValue.toFixed(2)}</p>
                  </div>
                </div>
              )}
              {state.epoch === 0 && (
                <p className="text-gray-500 text-sm">尚未开始训练</p>
              )}
            </div>
          </div>

          {/* 上一步执行的动作 */}
          {selectedActionIndex !== null && state.actionHistory.length > 0 && (
            <div className="bg-white p-3 rounded shadow mb-4">
              <h4 className="font-medium mb-2">上一步执行动作</h4>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">来源:</span>
                  <p className="font-medium">{state.actionHistory[state.actionHistory.length - 1].from}</p>
                </div>
                <div>
                  <span className="text-gray-500">目标:</span>
                  <p className="font-medium">{state.actionHistory[state.actionHistory.length - 1].to}</p>
                </div>
                <div>
                  <span className="text-gray-500">数量:</span>
                  <p className="font-medium">{state.actionHistory[state.actionHistory.length - 1].amount}</p>
                </div>
                <div>
                  <span className="text-gray-500">奖励:</span>
                  <p className={`font-medium ${state.actionHistory[state.actionHistory.length - 1].reward >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {state.actionHistory[state.actionHistory.length - 1].reward.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 图表展示 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-3">库存变化历史</h3>
          <div className="h-64">
            {state.history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={state.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="epoch" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="warehouseA" stroke="#8884d8" name="仓库A" />
                  <Line type="monotone" dataKey="warehouseB" stroke="#82ca9d" name="仓库B" />
                  <Line type="monotone" dataKey="warehouseC" stroke="#ff7300" name="仓库C" />
                  <Line type="monotone" dataKey="warehouseD" stroke="#0088fe" name="仓库D" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                暂无数据，开始训练后显示
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-3">奖励历史</h3>
          <div className="h-64">
            {state.history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={state.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="epoch" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reward" fill="#8884d8" name="即时奖励" />
                  <Line type="monotone" dataKey="cumulativeReward" stroke="#ff7300" name="累计奖励" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                暂无数据，开始训练后显示
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RL原理说明 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-bold mb-2">强化学习原理</h3>
        <p className="text-sm text-gray-700 mb-3">
          本模块采用Q-learning算法实现库存调拨决策的强化学习优化，算法核心公式：
        </p>
        <div className="bg-white p-2 rounded text-center mb-3">
          <code>Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]</code>
        </div>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li><strong>状态空间</strong>：由各仓库离散化的库存水平组成</li>
          <li><strong>动作空间</strong>：包含预定义的库存调拨选项（来源仓库、目标仓库、数量）</li>
          <li><strong>奖励函数</strong>：考虑调拨效益、运输成本、源仓库风险和持有成本变化</li>
          <li><strong>探索策略</strong>：采用ε-贪婪策略，平衡探索与利用</li>
          <li><strong>学习过程</strong>：通过多次尝试和经验积累，学习最优的调拨决策策略</li>
        </ul>
      </div>
    </div>
  );
};

export default RLModule;