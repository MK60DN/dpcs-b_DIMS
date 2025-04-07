// 强化学习服务模块

// 初始化Q表
export const initializeQTable = (warehouseCapacities) => {
  const qTable = {};
  const [capacityA, capacityB, capacityC, capacityD] = warehouseCapacities;

  // 库存离散化步长
  const stepA = Math.ceil(capacityA / 5);
  const stepB = Math.ceil(capacityB / 5);
  const stepC = Math.ceil(capacityC / 5);
  const stepD = Math.ceil(capacityD / 5);

  // 生成所有可能的离散状态和对应的Q值
  for (let inventoryA = 0; inventoryA <= capacityA; inventoryA += stepA) {
    for (let inventoryB = 0; inventoryB <= capacityB; inventoryB += stepB) {
      for (let inventoryC = 0; inventoryC <= capacityC; inventoryC += stepC) {
        for (let inventoryD = 0; inventoryD <= capacityD; inventoryD += stepD) {
          const stateKey = `${inventoryA}-${inventoryB}-${inventoryC}-${inventoryD}`;
          qTable[stateKey] = Array(5).fill(0).map(() => Math.random() * 10); // 随机初始化Q值
        }
      }
    }
  }

  return qTable;
};

// 获取状态的离散表示
export const getDiscreteState = (warehouses, steps) => {
  const discreteA = Math.floor(warehouses[0].inventory / steps[0]) * steps[0];
  const discreteB = Math.floor(warehouses[1].inventory / steps[1]) * steps[1];
  const discreteC = Math.floor(warehouses[2].inventory / steps[2]) * steps[2];
  const discreteD = Math.floor(warehouses[3].inventory / steps[3]) * steps[3];
  return `${discreteA}-${discreteB}-${discreteC}-${discreteD}`;
};

// 计算调拨奖励
export const calculateReward = (state, action) => {
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
export const executeAction = (state, actionIndex, actions) => {
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

  return {newState, reward};
};

// Q-learning更新
export const updateQValue = (qTable, stateKey, actionIndex, reward, newStateKey, learningRate, discountFactor) => {
  const oldQValue = qTable[stateKey][actionIndex];
  const maxNextQ = Math.max(...qTable[newStateKey]);
  const newQValue = oldQValue + learningRate * (reward + discountFactor * maxNextQ - oldQValue);

  // 创建新的Q表以保持不可变性
  const newQTable = {...qTable};
  newQTable[stateKey] = [...qTable[stateKey]]; // 复制数组
  newQTable[stateKey][actionIndex] = newQValue;

  return newQTable;
};

// 获取当前推荐动作
export const getRecommendedAction = (state, qTable, actions, steps) => {
  const stateKey = getDiscreteState(state.warehouses, steps);
  if (!qTable[stateKey]) {
    return { ...actions[0], qValue: 0, confidence: 0 };
  }

  const actionIndex = qTable[stateKey].indexOf(Math.max(...qTable[stateKey]));
  const maxQValue = qTable[stateKey][actionIndex];

  // 计算置信度 (基于最大Q值与平均Q值的差距)
  const avgQValue = qTable[stateKey].reduce((a, b) => a + b, 0) / qTable[stateKey].length;
  const confidence = Math.min(1, Math.max(0, (maxQValue - avgQValue) / (maxQValue || 1)));

  return {
    ...actions[actionIndex],
    qValue: maxQValue,
    confidence
  };
};

// 选择动作 (ε-贪婪策略)
export const selectAction = (state, qTable, actions, explorationRate, steps) => {
  const stateKey = getDiscreteState(state.warehouses, steps);

  // 如果状态不在Q表中，随机选择动作
  if (!qTable[stateKey]) {
    return Math.floor(Math.random() * actions.length);
  }

  // ε-贪婪策略
  if (Math.random() < explorationRate) {
    // 探索 - 随机选择动作
    return Math.floor(Math.random() * actions.length);
  } else {
    // 利用 - 选择Q值最大的动作
    return qTable[stateKey].indexOf(Math.max(...qTable[stateKey]));
  }
};

export default {
  initializeQTable,
  getDiscreteState,
  calculateReward,
  executeAction,
  updateQValue,
  getRecommendedAction,
  selectAction
};