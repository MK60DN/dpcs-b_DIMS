import React, { useState } from 'react';
import OverviewTab from './OverviewTab';
import WarehousesTab from './WarehousesTab';
import TransshipmentTab from './TransshipmentTab';
import HistoryTab from './HistoryTab';
import SettingsTab from './SettingsTab';

const Dashboard = ({ processingMode, showNotification }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [processing, setProcessing] = useState(false);

  // 处理标签页切换
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* 标签页导航 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('overview')}
        >
          系统概览
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'warehouses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('warehouses')}
        >
          仓库管理
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'transshipment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('transshipment')}
        >
          库存调拨
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('history')}
        >
          历史记录
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('settings')}
        >
          系统设置
        </button>
      </div>

      {/* 内容区域 */}
      <div>
        {activeTab === 'overview' && <OverviewTab processingMode={processingMode} />}
        {activeTab === 'warehouses' && (
          <WarehousesTab
            processingMode={processingMode}
            showNotification={showNotification}
            setProcessing={setProcessing}
            processing={processing}
          />
        )}
        {activeTab === 'transshipment' && (
          <TransshipmentTab
            processingMode={processingMode}
            showNotification={showNotification}
            setProcessing={setProcessing}
            processing={processing}
          />
        )}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'settings' && <SettingsTab processingMode={processingMode} />}
      </div>
    </div>
  );
};

export default Dashboard;