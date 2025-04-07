import React from 'react';
import { BarChart2, Layers, Truck, Settings, Brain, Code } from 'lucide-react';

const Sidebar = ({ activeView, onViewChange, selectedMode, onModeChange }) => {
  return (
    <aside className="bg-gray-800 text-white w-56 flex-shrink-0">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <button
              className={`flex items-center w-full p-2 rounded ${activeView === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => onViewChange('dashboard')}
            >
              <BarChart2 className="mr-2" size={18} />
              <span>系统面板</span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full p-2 rounded ${activeView === 'architecture' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => onViewChange('architecture')}
            >
              <Code className="mr-2" size={18} />
              <span>系统架构</span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full p-2 rounded ${activeView === 'rlModule' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => onViewChange('rlModule')}
            >
              <BarChart2 className="mr-2" size={18} />
              <span>左脑模块</span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full p-2 rounded ${activeView === 'llmModule' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => onViewChange('llmModule')}
            >
              <Brain className="mr-2" size={18} />
              <span>右脑模块</span>
            </button>
          </li>
        </ul>

        {/* 处理模式选择 */}
        <div className="mt-8 p-2 bg-gray-700 rounded">
          <h3 className="font-medium mb-2 text-gray-300">处理模式</h3>
          <select
            className="w-full p-1 bg-gray-600 rounded border border-gray-500 text-white"
            value={selectedMode}
            onChange={(e) => onModeChange(e.target.value)}
          >
            <option value="dual">双路径模式</option>
            <option value="left">左脑(RL)模式</option>
            <option value="right">右脑(LLM)模式</option>
          </select>

          <div className="mt-3 flex items-center text-sm text-gray-300">
            {selectedMode === 'dual' && (
              <>
                <Brain size={16} className="mr-1" />
                <span>左右脑协同工作</span>
              </>
            )}
            {selectedMode === 'left' && (
              <>
                <BarChart2 size={16} className="mr-1" />
                <span>强化学习优化</span>
              </>
            )}
            {selectedMode === 'right' && (
              <>
                <Layers size={16} className="mr-1" />
                <span>语义理解驱动</span>
              </>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;