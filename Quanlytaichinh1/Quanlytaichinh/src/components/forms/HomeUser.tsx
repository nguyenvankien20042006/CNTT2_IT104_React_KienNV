import  { useState } from 'react';
import {  Calendar, DollarSign, Info, Grid, Clock, ChevronDown } from 'lucide-react';

const HomeUser = () => {
  const [balance, setBalance] = useState(0);
  const [month, setMonth] = useState('September 2025');
  const [amount, setAmount] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: 'Nguyen Van A',
    email: 'nguyenvana@gmail.com',
    phone: '0987654321',
    gender: 'Male'
  });
  const [activeTab, setActiveTab] = useState('information');

  const handleSave = () => {
    if (amount && !isNaN(Number(amount))) {
      setBalance(prev => prev + Number(amount));
      setAmount('');
    }
  };

  // const handleLogout = () => {
  //   // Chuyển hướng về trang đăng nhập
  //   window.location.href = '/login';
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          <h1 className="text-lg font-semibold">Tài Chính Cá Nhân K24_Rikkei</h1>
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <span>Tài khoản</span>
          <ChevronDown className="w-4 h-4" />
        </div>
        
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen shadow-sm">
          <nav className="p-4">
            <button
              onClick={() => setActiveTab('information')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === 'information'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Info className="w-5 h-5" />
              <span className="font-medium">Information</span>
            </button>
            <button
              onClick={() => setActiveTab('category')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === 'category'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
              <span className="font-medium">Category</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">History</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Alert Box */}
          <div className="bg-indigo-600 text-white rounded-lg p-6 mb-8 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💝</span>
              <h2 className="text-xl font-semibold">Kiểm soát chi tiêu thông minh</h2>
            </div>
            <p className="text-indigo-100">Theo dõi ngân sách và thu chi hàng tháng dễ dàng</p>
          </div>

          {/* Finance Management Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-indigo-600 rounded"></div>
              <h3 className="text-xl font-semibold text-indigo-700">Quản Lý Tài Chính Cá Nhân</h3>
            </div>

            {/* Balance Display */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
              <p className="text-gray-600 mb-2">Số tiền còn lại</p>
              <p className="text-3xl font-bold text-green-600">{balance.toLocaleString()} VNĐ</p>
            </div>

            {/* Month Selector */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 font-medium">Chọn tháng</span>
              </div>
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 font-medium">Ngân sách tháng</span>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="VD: 5000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>

          {/* User Information Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-indigo-700 mb-6">Quản Lý Thông tin cá nhân</h3>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userInfo.gender}
                  onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                Change Information
              </button>
              <button className="flex-1 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                Change Password
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeUser;