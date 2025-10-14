/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Layout,
  Menu,
  Input,
  Button,
  DatePicker,
  message,
  Form,
  Dropdown,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

// Import các trang con
import InformationPage from './InfoManager';
import CategoryPage from './CategoryManager';
import HistoryPage from './HistoryManager';
import style from 'antd/es/affix/style';

const { Header, Content, Sider } = Layout;

// Interfaces
interface Category {
  id: string;
  month: string;
  name: string;
  limit: number;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  gender: string;
}

interface FinancialData {
  id: string;
  month: string;
  budget: number;
  balance: number;
}

const BASE_URL = 'http://localhost:8080'; // Update with your json-server port

const DashboardLayout: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<moment.Moment | null>(
    moment()
  );
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);
  const [remainingBalance, setRemainingBalance] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'Nguyen Van A',
    email: 'nguyenvana@gmail.com',
    phone: '0987654321',
    gender: 'Male',
  });
  const [categories, setCategories] = useState<Category[]>([]);

  const [form] = Form.useForm(); // Form for InformationPage
  const navigate = useNavigate();
  const location = useLocation();

  // Determine selectedKey based on current path
  const [selectedKey, setSelectedKey] = useState('1');

  useEffect(() => {
    switch (location.pathname) {
      case '/UserDashboard/information':
        setSelectedKey('1');
        break;
      case '/UserDashboard/category':
        setSelectedKey('2');
        break;
      case '/UserDashboard/history':
        setSelectedKey('3');
        break;
      default:
        setSelectedKey('1');
        navigate('/UserDashboard/information', { replace: true }); // Redirect to default if path is unknown
    }
  }, [location.pathname, navigate]);


  // Fetch financial data (budget, balance)
  const fetchFinancialData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/financialData`);
      const data: FinancialData[] = response.data;
      const currentMonthData = data.find((item: FinancialData) =>
        moment(item.month, 'YYYY-MM').isSame(selectedMonth, 'month')
      );
      if (currentMonthData) {
        setMonthlyBudget(currentMonthData.budget);
        setRemainingBalance(currentMonthData.balance);
        form.setFieldsValue({
          monthlyBudget: currentMonthData.budget,
        });
      } else {
        setMonthlyBudget(null);
        setRemainingBalance(0);
        form.setFieldsValue({
          monthlyBudget: null,
        });
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
      message.error('Failed to load financial data.');
    }
  }, [selectedMonth, form]); // form is a stable ref, selectedMonth might change

  // Fetch user info
  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/1`); // Assuming user ID 1
      setUserInfo(response.data);
      form.setFieldsValue(response.data); // Set initial values for InformationPage form
    } catch (error) {
      console.error('Error fetching user info:', error);
      message.error('Failed to load user information.');
    }
  }, [form]);

  // Fetch categories for the selected month
  const fetchCategories = useCallback(async (month: moment.Moment | null) => {
    if (!month) {
      setCategories([]);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      const filteredCategories = response.data.filter((cat: Category) =>
        moment(cat.month, 'YYYY-MM').isSame(month, 'month')
      );
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to load categories.');
    }
  }, []);

  // Initial data fetch on component mount and when selectedMonth changes
  useEffect(() => {
    fetchFinancialData();
    fetchUserInfo();
    fetchCategories(selectedMonth);
  }, [selectedMonth, fetchFinancialData, fetchUserInfo, fetchCategories]);


  const handleMonthChange = (date: moment.Moment | null) => {
    setSelectedMonth(date);
  };

  const handleBudgetSave = async () => {
    if (!monthlyBudget || monthlyBudget <= 0) {
      message.warning('Vui lòng nhập ngân sách tháng hợp lệ (lớn hơn 0)!');
      return;
    }

    if (!selectedMonth) {
      message.warning('Vui lòng chọn tháng trước khi lưu!');
      return;
    }

    const monthString = selectedMonth.format('YYYY-MM');

    try {
      const response = await axios.get(`${BASE_URL}/financialData`);
      const financialData: FinancialData[] = response.data;

      const existingEntryIndex = financialData.findIndex((item: FinancialData) =>
        moment(item.month, 'YYYY-MM').isSame(selectedMonth, 'month')
      );

      // Khi mới tạo ngân sách tháng => số tiền còn lại ban đầu = toàn bộ ngân sách
const newBalance = monthlyBudget;


      if (existingEntryIndex > -1) {
        const updatedEntry = {
          ...financialData[existingEntryIndex],
          budget: monthlyBudget,
          balance: newBalance,
        };
        await axios.put(
          `${BASE_URL}/financialData/${financialData[existingEntryIndex].id}`,
          updatedEntry
        );
        message.success('Cập nhật ngân sách tháng thành công!');
        setRemainingBalance(newBalance);
      } else {
        const newEntry = {
          id: Date.now().toString(),
          month: monthString,
          budget: monthlyBudget,
          balance: newBalance, // Initial balance is budget minus existing category limits
        };
        await axios.post(`${BASE_URL}/financialData`, newEntry);
        message.success('Lưu ngân sách tháng thành công!');
        setRemainingBalance(newBalance);
      }
      fetchFinancialData(); // Re-fetch to ensure all states are in sync
    } catch (error) {
      console.error('Error saving budget:', error);
      message.error('Lỗi khi lưu ngân sách tháng.');
    }
  };

  const dropdownMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Đăng xuất',
      // Add actual logout logic here
      onClick: () => message.info('Đăng xuất thành công!'),
    },
  ];

  const sidebarMenuItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <Link to="/dashboard/information">Information</Link>,
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: <Link to="/dashboard/category">Category</Link>,
    },
    {
      key: '3',
      icon: <HistoryOutlined />,
      label: <Link to="/dashboard/history">History</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header" style={{ backgroundColor: '#5243aa', padding: '0 20px' }}>
        <div style={{ float: 'left', color: 'white', fontSize: '18px' }}>
          Tài Chính Cá Nhân KZ4_Rikkei
        </div>
        <div style={{ float: 'right' }}>
          <Dropdown
            menu={{ items: dropdownMenuItems }}
            trigger={['click']}
          >
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} style={{ color: 'white' }}>
              Tài khoản <UserOutlined />
            </a>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background" style={{ backgroundColor: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => setSelectedKey(key)}
            items={sidebarMenuItems}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              backgroundColor: '#f0f2f5',
            }}
          >
            {/* Smart Spending Control Section */}
            <div
              style={{
                backgroundColor: '#5243aa',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ color: 'white', margin: '0 0 5px 0' }}>
                <span role="img" aria-label="lightbulb">💡</span> Kiểm soát chi tiêu thông minh
              </h2>
              <p style={{ margin: 0 }}>
                Theo dõi ngân sách và thu chi hàng tháng dễ dàng
              </p>
            </div>

            {/* Personal Financial Management Section */}
            <div
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>
                <span role="img" aria-label="chart">📊</span> Quản Lý Tài Chính Cá Nhân
              </h3>

              <div
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  backgroundColor: '#e6f7ff',
                }}
              >
                <p style={{ margin: '0', fontSize: '16px', color: '#555' }}>Số tiền còn lại</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {remainingBalance.toLocaleString('vi-VN')} VND
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <span style={{ marginRight: '10px' }}>
                  <span role="img" aria-label="calendar">🗓️</span> Chọn tháng:
                </span>
                <DatePicker
                  picker="month"
                  format="MMMM YYYY"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  allowClear={false}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ marginRight: '10px' }}>
                  <span role="img" aria-label="money-bag">💰</span> Ngân sách tháng:
                </span>
                <Input
                  placeholder="VD: 5000000"
                  type="number"
                  value={monthlyBudget === null ? '' : monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  style={{ width: '150px' }}
                />
                <Button type="primary" onClick={handleBudgetSave}>
                  Lưu
                </Button>
              </div>
            </div>

            {/* Router Outlet for Page Content */}
            <Routes>
              <Route path="information" element={<InformationPage userInfo={userInfo} setUserInfo={setUserInfo} form={form} />} />
              <Route
                path="category"
                element={
                  <CategoryPage
                    selectedMonth={selectedMonth}
                    monthlyBudget={monthlyBudget}
                    fetchCategories={fetchCategories}
                    fetchFinancialData={fetchFinancialData}
                    categories={categories}
                    setCategories={setCategories}
                    remainingBalance={remainingBalance}
                  />
                }
              />
              <Route
                path="history"
                element={
                  <HistoryPage
                    selectedMonth={selectedMonth}
                    fetchFinancialData={fetchFinancialData}
                    remainingBalance={remainingBalance}
                    categories={categories}
                  />
                }
              />
              <Route path="/" element={<InformationPage userInfo={userInfo} setUserInfo={setUserInfo} form={form} />} /> {/* Default route */}
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;