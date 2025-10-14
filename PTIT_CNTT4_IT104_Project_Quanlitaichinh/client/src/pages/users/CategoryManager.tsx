/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, message, Form, Modal } from 'antd';
import { DollarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

interface Category {
  id: string;
  month: string;
  name: string;
  limit: number;
}

interface CategoryPageProps {
  selectedMonth: moment.Moment | null;
  monthlyBudget: number | null;
  fetchCategories: (month: moment.Moment | null) => Promise<void>;
  fetchFinancialData: () => void;
  categories: Category[]; // Pass categories from parent
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>; // This might not be strictly needed if fetchCategories is used
  remainingBalance: number; // For display or other logic if needed
}

const BASE_URL = 'http://localhost:8080';

const CategoryPage: React.FC<CategoryPageProps> = ({
  selectedMonth,
  monthlyBudget,
  fetchCategories,
  fetchFinancialData,
  categories,
  setCategories, // Keeping this for now, but `fetchCategories` is likely enough
  remainingBalance, // Keeping this for now, but `fetchFinancialData` implicitly handles it
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState<number | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editForm] = Form.useForm();

  // Ensure categories are fetched when month changes or component mounts
  useEffect(() => {
    if (selectedMonth) {
      fetchCategories(selectedMonth);
    }
  }, [selectedMonth, fetchCategories]); // Depend on fetchCategories to ensure it's up-to-date


  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryLimit) {
      message.warning('Vui lòng nhập tên và giới hạn cho danh mục!');
      return;
    }
    if (!selectedMonth) {
      message.warning('Vui lòng chọn tháng trước khi thêm danh mục!');
      return;
    }

    if (monthlyBudget === null || monthlyBudget <= 0) { // Check for null or invalid budget
      message.warning('Vui lòng thiết lập ngân sách tháng trước khi thêm danh mục!');
      return;
    }

    if (newCategoryLimit <= 0) {
      message.warning('Số tiền giới hạn phải lớn hơn 0!');
      return;
    }

    const totalCategoryLimit = categories.reduce((sum, cat) => sum + cat.limit, 0);

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
      await axios.post(`${BASE_URL}/categories`, newCategory);

      // Update balance
      const financialDataResponse = await axios.get(`${BASE_URL}/financialData`);
      const existingEntry = financialDataResponse.data.find((item: any) =>
        moment(item.month, 'YYYY-MM').isSame(selectedMonth, 'month')
      );

      if (existingEntry) {
        const updatedEntry = { ...existingEntry, balance: existingEntry.balance - newCategoryLimit };
        await axios.put(
          `${BASE_URL}/financialData/${existingEntry.id}`,
          updatedEntry
        );
        fetchFinancialData(); // Trigger refresh in parent
      }

      message.success('Thêm danh mục thành công!');
      setNewCategoryName('');
      setNewCategoryLimit(null);
      fetchCategories(selectedMonth); // Refresh categories
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
        if (values.limit <= 0) {
          message.warning('Số tiền giới hạn phải lớn hơn 0!');
          return;
        }

        if (monthlyBudget === null || monthlyBudget <= 0) { // Check for null or invalid budget
          message.warning('Ngân sách tháng chưa được thiết lập!');
          return;
        }

        const totalOtherCategoryLimit = categories
          .filter(cat => cat.id !== editingCategory.id)
          .reduce((sum, cat) => sum + cat.limit, 0);

        if (totalOtherCategoryLimit + values.limit > monthlyBudget) {
          message.warning(
            `Tổng giới hạn các danh mục (${(totalOtherCategoryLimit + values.limit).toLocaleString('vi-VN')} VND) vượt quá ngân sách tháng (${monthlyBudget.toLocaleString('vi-VN')} VND)!`
          );
          return;
        }

        const updatedCategory = { ...editingCategory, ...values };
        await axios.put(
          `${BASE_URL}/categories/${editingCategory.id}`,
          updatedCategory
        );

        // Update balance
        const financialDataResponse = await axios.get(`${BASE_URL}/financialData`);
        const existingEntry = financialDataResponse.data.find((item: any) =>
          moment(item.month, 'YYYY-MM').isSame(selectedMonth, 'month')
        );

        if (existingEntry) {
          const oldLimit = editingCategory.limit;
          const newLimit = values.limit;
          const balanceChange = oldLimit - newLimit; // If new limit is higher, balance decreases (negative change)

          const updatedEntry = { ...existingEntry, balance: existingEntry.balance + balanceChange };
          await axios.put(
            `${BASE_URL}/financialData/${existingEntry.id}`,
            updatedEntry
          );
          fetchFinancialData(); // Trigger refresh in parent
        }

        message.success('Cập nhật danh mục thành công!');
        fetchCategories(selectedMonth); // Refresh categories
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
          `${BASE_URL}/categories/${editingCategory.id}`
        );

        // Update balance
        const financialDataResponse = await axios.get(`${BASE_URL}/financialData`);
        const existingEntry = financialDataResponse.data.find((item: any) =>
          moment(item.month, 'YYYY-MM').isSame(selectedMonth, 'month')
        );

        if (existingEntry) {
          const updatedEntry = { ...existingEntry, balance: existingEntry.balance + editingCategory.limit };
          await axios.put(
            `${BASE_URL}/financialData/${existingEntry.id}`,
            updatedEntry
          );
          fetchFinancialData(); // Trigger refresh in parent
        }

        message.success('Xóa danh mục thành công!');
        fetchCategories(selectedMonth); // Refresh categories
        setIsModalVisible(false);
        setEditingCategory(null);
      } catch (error) {
        console.error('Error deleting category:', error);
        message.error('Lỗi khi xóa danh mục.');
      }
    }
  };

  return (
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
    </div>
  );
};

export default CategoryPage;