import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, DatePicker, message, Form, Dropdown } from 'antd';
import { UserOutlined, SettingOutlined, HistoryOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios'; // For interacting with db.json

const { Header, Content, Sider } = Layout;

const UserDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<moment.Moment | null>(moment());
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);
  const [remainingBalance, setRemainingBalance] = useState<number>(0);
  const [userInfo, setUserInfo] = useState({
    name: 'Nguyen Van A',
    email: 'nguyenvana@gmail.com',
    phone: '0987654321',
    gender: 'Male',
  });

  const [form] = Form.useForm();

  // Load data from db.json on component mount
  useEffect(() => {
    fetchFinancialData();
    fetchUserInfo();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/financialData');
      const data = response.data;
      // Assuming financialData is an array of { month: string, budget: number, balance: number }
      const currentMonthData = data.find((item: any) =>
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
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/1'); // Assuming a user with ID 1
      setUserInfo(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      message.error('Failed to load user information.');
    }
  };

  const handleMonthChange = (date: moment.Moment | null) => {
    setSelectedMonth(date);
    // When month changes, refetch budget and balance for that month
    if (date) {
      fetchFinancialDataByMonth(date);
    }
  };

  const fetchFinancialDataByMonth = async (month: moment.Moment) => {
    try {
      const response = await axios.get('http://localhost:3000/financialData');
      const data = response.data;
      const currentMonthData = data.find((item: any) =>
        moment(item.month, 'YYYY-MM').isSame(month, 'month')
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
      console.error('Error fetching financial data for month:', error);
    }
  };

  const handleBudgetSave = async () => {
    if (!monthlyBudget) {
      message.warning('Vui lòng nhập ngân sách tháng trước khi lưu!');
      return;
    }

    if (!selectedMonth) {
      message.warning('Vui lòng chọn tháng trước khi lưu!');
      return;
    }

    const monthString = selectedMonth.format('YYYY-MM');

    try {
      const response = await axios.get('http://localhost:8080/financialData');
      const financialData = response.data;

      const existingEntryIndex = financialData.findIndex((item: any) =>
        moment(item.month, 'YYYY-MM').isSame(selectedMonth, 'month')
      );

      if (existingEntryIndex > -1) {
        // Update existing entry
        const updatedEntry = { ...financialData[existingEntryIndex], budget: monthlyBudget };
        await axios.put(`http://localhost:8080/financialData/${financialData[existingEntryIndex].id}`, updatedEntry);
        message.success('Cập nhật ngân sách tháng thành công!');
      } else {
        // Add new entry
        const newEntry = {
          id: Date.now().toString(), // Simple ID generation
          month: monthString,
          budget: monthlyBudget,
          balance: monthlyBudget, // Initially balance is equal to budget
        };
        await axios.post('http://localhost:8080/financialData', newEntry);
        message.success('Lưu ngân sách tháng thành công!');
        setRemainingBalance(monthlyBudget);
      }
      fetchFinancialData(); // Re-fetch to update the state
    } catch (error) {
      console.error('Error saving budget:', error);
      message.error('Lỗi khi lưu ngân sách tháng.');
    }
  };

  const handleUserInfoChange = async (values: any) => {
    try {
      await axios.put('http://localhost:8080/users/1', values);
      setUserInfo(values);
      message.success('Cập nhật thông tin cá nhân thành công!');
    } catch (error) {
      console.error('Error updating user info:', error);
      message.error('Lỗi khi cập nhật thông tin cá nhân.');
    }
  };

  const handleChangePassword = () => {
    message.info('Chức năng đổi mật khẩu sẽ được phát triển sau!');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header" style={{ backgroundColor: '#5243aa', padding: '0 20px' }}>
        <div style={{ float: 'left', color: 'white', fontSize: '18px' }}>
          Tài Chính Cá Nhân KZ4_Rikkei
        </div>
        <div style={{ float: 'right' }}>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="logout">Đăng xuất</Menu.Item>
              </Menu>
            }
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
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<UserOutlined />}>
              Information
            </Menu.Item>
            <Menu.Item key="2" icon={<SettingOutlined />}>
              Category
            </Menu.Item>
            <Menu.Item key="3" icon={<HistoryOutlined />}>
              History
            </Menu.Item>
          </Menu>
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
                  backgroundColor: '#e6f7ff', // Light blue background for balance
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

            {/* Personal Information Management Section */}
            <div
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>
                Quản Lý Thông tin cá nhân
              </h3>
              <Form
                form={form}
                layout="vertical"
                initialValues={userInfo}
                onFinish={handleUserInfoChange}
              >
                <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                  <Form.Item label="Name *" name="name" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Email *" name="email" style={{ flex: 1 }}>
                    <Input type="email" disabled /> {/* Email typically not editable */}
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <Form.Item label="Phone *" name="phone" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Gender *" name="gender" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <Button type="primary" htmlType="submit" style={{ flex: 1, backgroundColor: '#5243aa', borderColor: '#5243aa' }}>
                    Change Information
                  </Button>
                  <Button onClick={handleChangePassword} style={{ flex: 1, borderColor: '#5243aa', color: '#5243aa' }}>
                    Change Password
                  </Button>
                </div>
              </Form>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default UserDashboard;