import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">DPCS-B 分布式库存调拨系统</h1>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
            系统已连接
          </span>
          <span>版本: 0.1.0</span>
        </div>
      </div>
    </header>
  );
};

export default Header;