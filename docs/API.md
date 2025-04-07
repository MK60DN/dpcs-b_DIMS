# 分布式库存调拨系统 API文档

本文档描述了基于[MK60DN/dpcs-b](https://github.com/MK60DN/dpcs-b)仓库开发的分布式库存调拨系统API接口，包括端点、参数和返回值。该系统采用DPCS-B（Dual-Path Coordination System for Business）架构。

## 基础信息

- 基础URL: `https://api.dpcs-b.example.com/v1`
- 所有请求和响应均使用JSON格式
- 授权使用Bearer Token机制

## 认证

所有API请求都需要在Header中包含授权令牌：

```
Authorization: Bearer YOUR_API_TOKEN
```

## 响应格式

所有API响应遵循以下格式：

```json
{
  "success": true,
  "data": { ... } // 响应数据
}
```

出错时：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

## API端点

### 仓库管理

#### 获取所有仓库
```
GET /warehouses
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "仓库A",
      "inventory": 100,
      "capacity": 200,
      "forecastDemand": 50,
      "cost": 2,
      "status": "正常"
    },
    {
      "id": 2,
      "name": "仓库B",
      "inventory": 80,
      "capacity": 150,
      "forecastDemand": 70,
      "cost": 2.5,
      "status": "注意"
    }
    // ...更多仓库
  ]
}
```

#### 获取单个仓库
```
GET /warehouses/{id}
```

**路径参数：**
- `id` - 仓库ID

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "仓库A",
    "inventory": 100,
    "capacity": 200,
    "forecastDemand": 50,
    "cost": 2,
    "status": "正常",
    "location": {
      "latitude": 30.123,
      "longitude": 120.456
    },
    "lastUpdated": "2025-04-02T10:30:00Z"
  }
}
```

#### 更新仓库信息
```
PUT /warehouses/{id}
```

**路径参数：**
- `id` - 仓库ID

**请求体：**
```json
{
  "inventory": 110,
  "forecastDemand": 55,
  "cost": 2.2
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "仓库A",
    "inventory": 110,
    "capacity": 200,
    "forecastDemand": 55,
    "cost": 2.2,
    "status": "正常",
    "lastUpdated": "2025-04-08T15:45:00Z"
  }
}
```

#### 运行需求预测
```
POST /warehouses/forecast
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "仓库A",
      "forecastDemand": 53,
      "previousForecast": 50,
      "confidence": 0.92
    },
    {
      "id": 2,
      "name": "仓库B",
      "forecastDemand": 68,
      "previousForecast": 70,
      "confidence": 0.89
    }
    // ...更多仓库预测结果
  ]
}
```

### 库存调拨管理

#### 获取调拨记录
```
GET /transshipments
```

**查询参数：**
- `status` (可选) - 筛选状态 (完成、进行中、取消)
- `from` (可选) - 筛选起始日期
- `to` (可选) - 筛选结束日期
- `limit` (可选) - 返回记录数量限制，默认20
- `offset` (可选) - 分页偏移量，默认0

**响应示例：**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "items": [
      {
        "id": 1,
        "from": "仓库A",
        "to": "仓库D",
        "amount": 20,
        "cost": 200,
        "date": "2025-04-01",
        "status": "完成"
      },
      {
        "id": 2,
        "from": "仓库C",
        "to": "仓库B",
        "amount": 15,
        "cost": 150,
        "date": "2025-04-03",
        "status": "完成"
      }
      // ...更多调拨记录
    ]
  }
}
```

#### 创建调拨记录
```
POST /transshipments
```

**请求体：**
```json
{
  "fromWarehouseId": 3,
  "toWarehouseId": 4,
  "amount": 25,
  "priority": "normal"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "from": "仓库C",
    "to": "仓库D",
    "amount": 25,
    "cost": 200,
    "date": "2025-04-08",
    "status": "进行中",
    "estimatedCompletionDate": "2025-04-09"
  }
}
```

#### 获取调拨详情
```
GET /transshipments/{id}
```

**路径参数：**
- `id` - 调拨记录ID

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "from": {
      "id": 2,
      "name": "仓库B",
      "inventoryBefore": 95,
      "inventoryAfter": 85
    },
    "to": {
      "id": 4,
      "name": "仓库D",
      "inventoryBefore": 60,
      "inventoryAfter": 70
    },
    "amount": 10,
    "cost": 120,
    "date": "2025-04-05",
    "status": "进行中",
    "progress": 0.6,
    "createdBy": "system",
    "createdAt": "2025-04-05T09:22:15Z",
    "events": [
      {
        "timestamp": "2025-04-05T09:22:15Z",
        "event": "created",
        "details": "系统自动创建调拨"
      },
      {
        "timestamp": "2025-04-05T10:30:45Z",
        "event": "started",
        "details": "开始执行调拨"
      }
    ]
  }
}
```

### 决策支持

#### 获取强化学习决策
```
POST /decisions/rl
```

**请求体：**
```json
{
  "state": {
    "warehouses": [
      {"id": 1, "name": "仓库A", "inventory": 100, "demand": 50},
      {"id": 2, "name": "仓库B", "inventory": 80, "demand": 70},
      {"id": 3, "name": "仓库C", "inventory": 120, "demand": 60},
      {"id": 4, "name": "仓库D", "inventory": 60, "demand": 90}
    ],
    "transportCosts": [
      [0, 10, 15, 20],
      [10, 0, 12, 18],
      [15, 12, 0, 8],
      [20, 18, 8, 0]
    ]
  }
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "action": {
      "from": 2,
      "to": 3,
      "amount": 25
    },
    "expectedReward": 750.5,
    "confidence": 0.92,
    "alternatives": [
      {
        "from": 0,
        "to": 3,
        "amount": 20,
        "expectedReward": 620.3,
        "confidence": 0.85
      }
    ]
  }
}
```

#### 获取语言模型决策
```
POST /decisions/llm
```

**请求体：**
```json
{
  "scenario": "standard",
  "mode": "detailed",
  "warehouseData": [
    {"id": 1, "name": "仓库A", "inventory": 100, "forecastDemand": 50},
    {"id": 2, "name": "仓库B", "inventory": 80, "forecastDemand": 70},
    {"id": 3, "name": "仓库C", "inventory": 120, "forecastDemand": 60},
    {"id": 4, "name": "仓库D", "inventory": 60, "forecastDemand": 90}
  ],
  "scenarioContext": null
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "recommendation": "根据当前库存情况分析：\n\n各仓库库存/需求比：\n- 仓库A: 2.0 (充足)\n- 仓库B: 1.14 (略微充足)\n- 仓库C: 2.0 (充足)\n- 仓库D: 0.67 (不足)\n\n仓库D明显存在库存短缺风险，而仓库C有较多剩余库存。考虑到C到D的运输成本相对较低，建议首先进行以下调拨：\n\n**主要调拨建议**：从仓库C调拨25单位到仓库D\n\n理由：\n1. 这将使仓库D的库存增加到85单位，基本满足其90单位的预测需求\n2. 仓库C在调拨后仍有95单位库存，远高于其60单位的预测需求\n3. C到D的运输路线最优，成本较低\n\n**次要调拨建议**：从仓库A调拨10单位到仓库B\n\n理由：\n1. 使仓库B的库存更接近其需求水平\n2. 仓库A有足够的剩余库存\n\n这样的调拨方案可以平衡整个系统的库存，提高整体服务水平，同时控制运输成本。",
    "suggestions": [
      {
        "from": "仓库C",
        "to": "仓库D",
        "amount": 25,
        "primary": true
      },
      {
        "from": "仓库A",
        "to": "仓库B",
        "amount": 10,
        "primary": false
      }
    ]
  }
}
```

#### 获取融合决策
```
POST /decisions/fused
```

**请求体：**
```json
{
  "state": {
    "warehouses": [
      {"id": 1, "name": "仓库A", "inventory": 100, "demand": 50},
      {"id": 2, "name": "仓库B", "inventory": 80, "demand": 70},
      {"id": 3, "name": "仓库C", "inventory": 120, "demand": 60},
      {"id": 4, "name": "仓库D", "inventory": 60, "demand": 90}
    ],
    "transportCosts": [
      [0, 10, 15, 20],
      [10, 0, 12, 18],
      [15, 12, 0, 8],
      [20, 18, 8, 0]
    ]
  },
  "scenario": "standard",
  "mode": "detailed",
  "weights": {
    "left": 0.5,
    "right": 0.5
  }
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "fusedRecommendation": {
      "from": 2,
      "to": 3,
      "amount": 25,
      "confidence": 0.94
    },
    "leftBrainResult": {
      "action": {
        "from": 2,
        "to": 3,
        "amount": 25
      },
      "expectedReward": 750.5,
      "confidence": 0.92
    },
    "rightBrainResult": {
      "suggestions": [
        {
          "from": "仓库C",
          "to": "仓库D",
          "amount": 25,
          "primary": true
        },
        {
          "from": "仓库A",
          "to": "仓库B",
          "amount": 10,
          "primary": false
        }
      ]
    },
    "explanation": "左右脑分析结果高度一致，均建议从仓库C到仓库D的25单位调拨。左脑强化学习模型预期收益值为750.5，右脑语义理解模型提供了详细的理由，包括仓库D面临库存短缺风险，而仓库C有足够的库存余量。综合考虑成本和服务水平，此调拨为最优选择。"
  }
}
```

### 系统设置

#### 获取系统设置
```
GET /settings
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "leftBrain": {
      "learningRate": 0.1,
      "discountFactor": 0.9,
      "explorationRate": 0.2,
      "modelArchitecture": "Actor-Critic"
    },
    "rightBrain": {
      "model": "CAMEL Agent",
      "temperature": 0.7,
      "maxTokens": 1000,
      "systemPrompt": "你是一个专家级库存管理顾问，擅长分析库存数据并提供调拨建议。"
    },
    "fusion": {
      "leftWeight": 0.5,
      "rightWeight": 0.5,
      "fusionStrategy": "加权平均",
      "enableConflictResolution": true
    },
    "system": {
      "autoMode": true,
      "notifications": true,
      "defaultProcessingMode": "dual",
      "language": "中文"
    }
  }
}
```

#### 更新系统设置
```
PUT /settings
```

**请求体：**
```json
{
  "leftBrain": {
    "learningRate": 0.15,
    "discountFactor": 0.95
  },
  "rightBrain": {
    "temperature": 0.8
  },
  "fusion": {
    "leftWeight": 0.6,
    "rightWeight": 0.4
  }
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "updated": [
      "leftBrain.learningRate",
      "leftBrain.discountFactor",
      "rightBrain.temperature",
      "fusion.leftWeight",
      "fusion.rightWeight"
    ],
    "settings": {
      "leftBrain": {
        "learningRate": 0.15,
        "discountFactor": 0.95,
        "explorationRate": 0.2,
        "modelArchitecture": "Actor-Critic"
      },
      "rightBrain": {
        "model": "CAMEL Agent",
        "temperature": 0.8,
        "maxTokens": 1000,
        "systemPrompt": "你是一个专家级库存管理顾问，擅长分析库存数据并提供调拨建议。"
      },
      "fusion": {
        "leftWeight": 0.6,
        "rightWeight": 0.4,
        "fusionStrategy": "加权平均",
        "enableConflictResolution": true
      },
      "system": {
        "autoMode": true,
        "notifications": true,
        "defaultProcessingMode": "dual",
        "language": "中文"
      }
    }
  }
}
```

## 错误代码

| 代码 | 描述 |
|------|------|
| `INVALID_TOKEN` | 无效或过期的认证令牌 |
| `PERMISSION_DENIED` | 权限不足 |
| `RESOURCE_NOT_FOUND` | 请求的资源不存在 |
| `INVALID_PARAMETERS` | 请求参数无效 |
| `SERVER_ERROR` | 服务器内部错误 |
| `SERVICE_UNAVAILABLE` | 服务暂时不可用 |

## 速率限制

API请求受到速率限制，默认为每分钟60个请求。超出限制时，将返回HTTP状态码429。

## 版本控制

当前API版本为v1。未来版本将通过URL路径中的版本号进行区分，如`/v2/warehouses`。