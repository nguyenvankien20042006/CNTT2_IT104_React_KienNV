/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Input,
  Button,
  DatePicker,
  message,
  Form,
  Dropdown,
  Modal,
  Select,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  HistoryOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Header, Content, Sider } = Layout;
const { Option } = Select;

interface Category {
  id: string;
  month: string;
  name: string;
  limit: number;
}

const UserDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<moment.Moment | null>(
    moment()
  );
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);
  const [remainingBalance, setRemainingBalance] = useState<number>(0);
  const [userInfo, setUserInfo] = useState({
    name: 'Nguyen Van A',
    email: 'nguyenvana@gmail.com',
    phone: '0987654321',
    gender: 'Male',
  });
  const [selectedKey, setSelectedKey] = useState('1');
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState<number | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editForm] = Form.useForm();

  const [form] = Form.useForm();

  useEffect(() => {
    fetchFinancialData();
    fetchUserInfo();
    if (selectedKey === '2') {
      fetchCategories(selectedMonth);
    }
  }, [selectedKey, selectedMonth]);

  const fetchFinancialData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/financialData');
      const data = response.data;
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
      const response = await axios.get('http://localhost:8080/users/1');
      setUserInfo(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      message.error('Failed to load user information.');
    }
  };

  const fetchCategories = async (month: moment.Moment | null) => {
    if (!month) return;
    try {
      const response = await axios.get('http://localhost:8080/categories');
      const filteredCategories = response.data.filter((cat: Category) =>
        moment(cat.month, 'YYYY-MM').isSame(month, 'month')
      );
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to load categories.');
    }
  };

  const handleMonthChange = (date: moment.Moment | null) => {
    setSelectedMonth(date);
    if (date) {
      fetchFinancialDataByMonth(date);
      if (selectedKey === '2') {
        fetchCategories(date);
      }
    }
  };

  const fetchFinancialDataByMonth = async (month: moment.Moment) => {
    try {
      const response = await axios.get('http://localhost:8080/financialData');
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
      const response = await axios.get('http://localhost:8080/financialData');
      const financialData = response.data;

      const existingEntryIndex = financialData.findIndex((item: any) =>
        moment(item.month, 'YYYY-MM').isSame(selectedMonth, 'month')
      );

      // Tính tổng giới hạn của các danh mục hiện tại
      const totalCategoryLimit = categories.reduce((sum, cat) => sum + cat.limit, 0);

      // Kiểm tra ngân sách mới phải lớn hơn hoặc bằng tổng giới hạn các danh mục
      if (monthlyBudget < totalCategoryLimit) {
        message.warning(
          `Ngân sách tháng (${monthlyBudget.toLocaleString('vi-VN')} VND) không được nhỏ hơn tổng giới hạn các danh mục (${totalCategoryLimit.toLocaleString('vi-VN')} VND)!`
        );
        return;
      }

      const newBalance = monthlyBudget - totalCategoryLimit;

      if (existingEntryIndex > -1) {
        const updatedEntry = { 
          ...financialData[existingEntryIndex], 
          budget: monthlyBudget,
          balance: newBalance
        };
        await axios.put(
          `http://localhost:8080/financialData/${financialData[existingEntryIndex].id}`,
          updatedEntry
        );
        message.success('Cập nhật ngân sách tháng thành công!');
        setRemainingBalance(newBalance);
      } else {
        const newEntry = {
          id: Date.now().toString(),
          month: monthString,
          budget: monthlyBudget,
          balance: monthlyBudget,
        };
        await axios.post('http://localhost:8080/financialData', newEntry);
        message.success('Lưu ngân sách tháng thành công!');
        setRemainingBalance(monthlyBudget);
      }
      fetchFinancialData();
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

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryLimit) {
      message.warning('Vui lòng nhập tên và giới hạn cho danh mục!');
      return;
    }
    if (!selectedMonth) {
      message.warning('Vui lòng chọn tháng trước khi thêm danh mục!');
      return;
    }
    
    // Kiểm tra ngân sách tháng đã được thiết lập chưa
    if (!monthlyBudget || monthlyBudget <= 0) {
      message.warning('Vui lòng thiết lập ngân sách tháng trước khi thêm danh mục!');
      return;
    }

    // Kiểm tra số tiền giới hạn phải là số dương
    if (newCategoryLimit <= 0) {
      message.warning('Số tiền giới hạn phải lớn hơn 0!');
      return;
    }

    // Tính tổng giới hạn của các danh mục hiện tại
    const totalCategoryLimit = categories.reduce((sum, cat) => sum + cat.limit, 0);
    
    // Kiểm tra tổng giới hạn mới không vượt quá ngân sách tháng
    if (totalCategoryLimit + newCategoryLimit > monthlyBudget) {
      message.warning(
        `Tổng giới hạn các danh mục (${(totalCategoryLimit + newCategoryLimit).toLocaleString('vi-VN')} VND) vượt quá ngân sách tháng (${monthlyBudget.toLocaleString('vi-VN')} VND)!`
      );
      return;
    }

    const monthString = selectedMonth.format('YYYY-MM');

    try {
      const newCategory: Category = {
        id: Date.now().toString(),
        month: monthString,
        name: newCategoryName.trim(),
        limit: newCategoryLimit,
      };
      await axios.post('http://localhost:8080/categories', newCategory);
      
      // Cập nhật số tiền còn lại
      const newBalance = monthlyBudget - (totalCategoryLimit + newCategoryLimit);
      const response = await axios.get('http://localhost:8080/financialData');
      const financialData = response.data;
      const existingEntry = financialData.find((item: any) =>
        moment(item.month, 'YYYY-MM').isSame(selectedMonth, 'month')
      );
      
      if (existingEntry) {
        const updatedEntry = { ...existingEntry, balance: newBalance };
        await axios.put(
          `http://localhost:8080/financialData/${existingEntry.id}`,
          updatedEntry
        );
        setRemainingBalance(newBalance);
      }
      
      message.success('Thêm danh mục thành công!');
      setNewCategoryName('');
      setNewCategoryLimit(null);
      fetchCategories(selectedMonth);
    } catch (error) {
      console.error('Error adding category:', error);
      message.error('Lỗi khi thêm danh mục.');
    }
  };

  const handleCategoryClick = (category: Category) => {
    setEditingCategory(category);
    editForm.setFieldsValue({
      name: category.name,
      limit: category.limit,
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await editForm.validateFields();
      if (editingCategory) {
        // Kiểm tra số tiền giới hạn phải là số dương
        if (values.limit <= 0) {
          message.warning('Số tiền giới hạn phải lớn hơn 0!');
          return;
        }

        // Kiểm tra ngân sách tháng
        if (!monthlyBudget || monthlyBudget <= 0) {
          message.warning('Ngân sách tháng chưa được thiết lập!');
          return;
        }

        // Tính tổng giới hạn của các danh mục khác (không bao gồm danh mục đang chỉnh sửa)
        const totalOtherCategoryLimit = categories
          .filter(cat => cat.id !== editingCategory.id)
          .reduce((sum, cat) => sum + cat.limit, 0);
        
        // Kiểm tra tổng giới hạn mới không vượt quá ngân sách tháng
        if (totalOtherCategoryLimit + values.limit > monthlyBudget) {
          message.warning(
            `Tổng giới hạn các danh mục (${(totalOtherCategoryLimit + values.limit).toLocaleString('vi-VN')} VND) vượt quá ngân sách tháng (${monthlyBudget.toLocaleString('vi-VN')} VND)!`
          );
          return;
        }

        const updatedCategory = { ...editingCategory, ...values };
        await axios.put(
          `http://localhost:8080/categories/${editingCategory.id}`,
          updatedCategory
        );
        
        // Cập nhật số tiền còn lại
        const newBalance = monthlyBudget - (totalOtherCategoryLimit + values.limit);
        const response = await axios.get('http://localhost:8080/financialData');
        const financialData = response.data;
        const existingEntry = financialData.find((item: any) =>
          moment(item.month, 'YYYY-MM').isSame(selectedMonth, 'month')
        );
        
        if (existingEntry) {
          const updatedEntry = { ...existingEntry, balance: newBalance };
          await axios.put(
            `http://localhost:8080/financialData/${existingEntry.id}`,
            updatedEntry
          );
          setRemainingBalance(newBalance);
        }
        
        message.success('Cập nhật danh mục thành công!');
        fetchCategories(selectedMonth);
        setIsModalVisible(false);
        setEditingCategory(null);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      message.error('Lỗi khi cập nhật danh mục.');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async () => {
    if (editingCategory && selectedMonth) {
      try {
        await axios.delete(
          `http://localhost:8080/categories/${editingCategory.id}`
        );
        
        // Cập nhật số tiền còn lại khi xóa danh mục
        const totalOtherCategoryLimit = categories
          .filter(cat => cat.id !== editingCategory.id)
          .reduce((sum, cat) => sum + cat.limit, 0);
        
        const newBalance = (monthlyBudget || 0) - totalOtherCategoryLimit;
        const response = await axios.get('http://localhost:8080/financialData');
        const financialData = response.data;
        const existingEntry = financialData.find((item: any) =>
          moment(item.month, 'YYYY-MM').isSame(selectedMonth, 'month')
        );
        
        if (existingEntry) {
          const updatedEntry = { ...existingEntry, balance: newBalance };
          await axios.put(
            `http://localhost:8080/financialData/${existingEntry.id}`,
            updatedEntry
          );
          setRemainingBalance(newBalance);
        }
        
        message.success('Xóa danh mục thành công!');
        fetchCategories(selectedMonth);
        setIsModalVisible(false);
        setEditingCategory(null);
      } catch (error) {
        console.error('Error deleting category:', error);
        message.error('Lỗi khi xóa danh mục.');
      }
    }
  };

  // Menu items cho Dropdown - Sử dụng items thay vì overlay
  const dropdownMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Đăng xuất',
    },
  ];

  // Menu items cho Sidebar - Sử dụng items thay vì children
  const sidebarMenuItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: 'Information',
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: 'Category',
    },
    {
      key: '3',
      icon: <HistoryOutlined />,
      label: 'History',
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
            onClick={handleMenuClick}
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

            {selectedKey === '1' && (
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
                      <Input type="email" disabled />
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
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ flex: 1, backgroundColor: '#5243aa', borderColor: '#5243aa' }}
                    >
                      Change Information
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      style={{ flex: 1, borderColor: '#5243aa', color: '#5243aa' }}
                    >
                      Change Password
                    </Button>
                  </div>
                </Form>
              </div>
            )}

            {selectedKey === '2' && (
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>
                  <span role="img" aria-label="folder">🗂️</span> Quản lý danh mục (Theo tháng)
                </h3>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <Input
                    placeholder="Tên danh mục"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <Input
                    placeholder="Giới hạn (VND)"
                    type="number"
                    value={newCategoryLimit === null ? '' : newCategoryLimit}
                    onChange={(e) => setNewCategoryLimit(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <Button type="primary" onClick={handleAddCategory} style={{ backgroundColor: '#5243aa', borderColor: '#5243aa' }}>
                    Thêm danh mục
                  </Button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                  {categories.length === 0 && <p>Chưa có danh mục nào cho tháng này.</p>}
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      style={{
                        width: 'calc(33% - 10px)',
                        minWidth: '180px',
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        padding: '15px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '5px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)')}
                    >
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                        {category.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#5243aa' }}>
                        <DollarOutlined style={{ marginRight: '5px' }} />
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {category.limit.toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Chỉnh sửa danh mục"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
          <Button key="delete" danger onClick={handleDeleteCategory}>
            Xóa
          </Button>,
          <Button key="cancel" onClick={handleModalCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk} style={{ backgroundColor: '#5243aa', borderColor: '#5243aa' }}>
            Lưu
          </Button>,
        ]}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="limit"
            label="Giới hạn (VND)"
            rules={[{ required: true, message: 'Vui lòng nhập giới hạn!' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default UserDashboard;