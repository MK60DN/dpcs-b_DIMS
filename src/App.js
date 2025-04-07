import React, { useState } from 'react';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import NotificationBar from './components/common/NotificationBar';
import Dashboard from './components/Dashboard';
import ArchitectureView from './components/Architecture/ArchitectureView';
import RLModule from './components/LeftBrain/RLModule';
import LLMModule from './components/RightBrain/LLMModule';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedMode, setSelectedMode] = useState('dual');
  const [notification, setNotification] = useState(null);

  // 处理视图切换
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  // 处理处理模式切换
  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  // 显示通知
  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  // 清除通知
  const clearNotification = () => {
    setNotification(null);
  };

  // 渲染当前视图
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard processingMode={selectedMode} showNotification={showNotification} />;
      case 'architecture':
        return <ArchitectureView />;
      case 'rlModule':
        return <RLModule />;
      case 'llmModule':
        return <LLMModule />;
      default:
        return <Dashboard processingMode={selectedMode} showNotification={showNotification} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          selectedMode={selectedMode}
          onModeChange={handleModeChange}
        />

        <main className="flex-1 overflow-auto p-6">
          {notification && (
            <NotificationBar
              type={notification.type}
              message={notification.message}
              onClose={clearNotification}
            />
          )}

          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;