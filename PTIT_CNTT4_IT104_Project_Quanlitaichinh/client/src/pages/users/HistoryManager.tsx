/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Input,
  Button,
  DatePicker,
  message,
  Form,
  Select,
  Table,
  Space,
  Popconfirm,
  Tag,
} from "antd";
import {
  DollarOutlined,
  DeleteOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import axios from "axios";

const { Option } = Select;

// Interfaces
interface Category {
  id: string | number;
  month?: string;
  name: string;
  limit: number;
}

interface FinancialData {
  id: string;
  month: string;
  budget: number;
  balance: number;
}

interface Transaction {
  id: string | number;
  month: string;
  type: "income" | "expense";
  amount: number;
  categoryId: string | null;
  categoryName: string | null;
  note: string;
  date: string; // YYYY-MM-DD
}

interface HistoryPageProps {
  selectedMonth: moment.Moment | null;
  fetchFinancialData: () => void; // Function to refresh financial data in parent
  remainingBalance: number; // Pass remainingBalance from parent
  categories: Category[]; // Pass categories from parent
}

const BASE_URL = "http://localhost:8080"; // Update with your json-server port

const HistoryPage: React.FC<HistoryPageProps> = ({
  selectedMonth,
  fetchFinancialData,
  remainingBalance,
  categories,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransactionAmount, setNewTransactionAmount] = useState<
    number | null
  >(null);
  const [newTransactionCategory, setNewTransactionCategory] = useState<
    string | null
  >(null);
  const [newTransactionType, setNewTransactionType] = useState<
    "expense" | "income"
  >("expense");
  const [newTransactionNote, setNewTransactionNote] = useState("");
  const [transactionSearchTerm, setTransactionSearchTerm] = useState("");
  const [sortByPrice, setSortByPrice] = useState<"asc" | "desc" | null>("desc");
  const [transactionCurrentPage, setTransactionCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const [addTransactionForm] = Form.useForm();

  const fetchTransactions = useCallback(async () => {
    if (!selectedMonth) return;
    try {
      const response = await axios.get(`${BASE_URL}/transactions`);
      const filteredTransactions = response.data.filter((trans: Transaction) =>
        moment(trans.month, "YYYY-MM").isSame(selectedMonth, "month")
      );
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      message.error("Failed to load transactions.");
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchTransactions();
    setTransactionCurrentPage(1); // Reset page when month changes
  }, [selectedMonth, fetchTransactions]);

  const handleAddTransaction = async () => {
    try {
      await addTransactionForm.validateFields(); // Validate all fields

      if (!newTransactionAmount || newTransactionAmount <= 0) {
        message.warning("Vui lòng nhập số tiền hợp lệ (lớn hơn 0)!");
        return;
      }
      if (newTransactionType === "expense" && !newTransactionCategory) {
        message.warning("Vui lòng chọn danh mục cho khoản chi tiêu!");
        return;
      }
      if (!selectedMonth) {
        message.warning("Vui lòng chọn tháng trước khi thêm giao dịch!");
        return;
      }

      const monthString = selectedMonth.format("YYYY-MM");
      const transactionDate = moment().format("YYYY-MM-DD"); // Current date for transaction

      const selectedCat = categories.find(
        (cat) => cat.id === newTransactionCategory
      );
      const categoryName =
        newTransactionType === "expense"
          ? selectedCat?.name || null
          : "Thu nhập";

      const newTransaction: Omit<Transaction, "id"> = {
        month: monthString,
        type: newTransactionType,
        amount: newTransactionAmount,
        categoryId: newTransactionCategory,
        categoryName: categoryName,
        note: newTransactionNote.trim(),
        date: transactionDate,
      };
      await axios.post(`${BASE_URL}/transactions`, {
        ...newTransaction,
        id: `trans_${Date.now()}`,
      });

      message.success("Thêm giao dịch thành công!");

      // Update balance
      const financialDataResponse = await axios.get(
        `${BASE_URL}/financialData`
      );
      const currentMonthFinancial = financialDataResponse.data.find(
        (item: FinancialData) =>
          moment(item.month, "YYYY-MM").isSame(selectedMonth, "month")
      );

      if (currentMonthFinancial) {
        const newBalance =
          newTransactionType === "income"
            ? currentMonthFinancial.balance + newTransactionAmount
            : currentMonthFinancial.balance - newTransactionAmount;

        await axios.put(
          `${BASE_URL}/financialData/${currentMonthFinancial.id}`,
          {
            ...currentMonthFinancial,
            balance: newBalance,
          }
        );
        fetchFinancialData(); // Trigger refresh in parent
      }

      addTransactionForm.resetFields();
      setNewTransactionAmount(null);
      setNewTransactionCategory(null);
      setNewTransactionNote("");
      fetchTransactions(); // Refresh transactions
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
      message.error("Vui lòng điền đầy đủ và chính xác thông tin giao dịch.");
    }
  };

  const handleDeleteTransaction = async (
    id: string | number,
    amount: number,
    type: "income" | "expense"
  ) => {
    if (!selectedMonth) return;
    try {
      const deleteUrl = `${BASE_URL}/transactions/${String(id)}`;
      console.log("Deleting transaction at:", deleteUrl);

      await axios.delete(deleteUrl);

      message.success("Xóa giao dịch thành công!");

      // Update balance
      const financialDataResponse = await axios.get(
        `${BASE_URL}/financialData`
      );
      const currentMonthFinancial = financialDataResponse.data.find(
        (item: FinancialData) =>
          moment(item.month, "YYYY-MM").isSame(selectedMonth, "month")
      );

      if (currentMonthFinancial) {
        const newBalance =
          type === "income"
            ? currentMonthFinancial.balance - amount // Subtract income if income transaction is deleted
            : currentMonthFinancial.balance + amount; // Add expense back if expense transaction is deleted

        await axios.put(
          `${BASE_URL}/financialData/${currentMonthFinancial.id}`,
          {
            ...currentMonthFinancial,
            balance: newBalance,
          }
        );
        fetchFinancialData(); // Trigger refresh in parent
      }

      fetchTransactions(); // Refresh transactions
    } catch (error) {
      console.error("Error deleting transaction:", error);
      message.error("Lỗi khi xóa giao dịch.");
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions.filter(
      (trans) =>
        trans.note
          .toLowerCase()
          .includes(transactionSearchTerm.toLowerCase()) ||
        (trans.categoryName &&
          trans.categoryName
            .toLowerCase()
            .includes(transactionSearchTerm.toLowerCase()))
    );

    if (sortByPrice === "desc") {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortByPrice === "asc") {
      result.sort((a, b) => a.amount - b.amount);
    }
    return result;
  }, [transactions, transactionSearchTerm, sortByPrice]);

  // Pagination for transactions
  const totalTransactionPages = Math.ceil(
    filteredAndSortedTransactions.length / transactionsPerPage
  );
  const indexOfLastTransaction = transactionCurrentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredAndSortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber: number) =>
    setTransactionCurrentPage(pageNumber);

  const transactionTableColumns = [
    {
      title: "STT",
      key: "stt",
      render: (text: any, record: Transaction, index: number) =>
        indexOfFirstTransaction + index + 1,
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text: string | null, record: Transaction) => (
        <Tag color={record.type === "income" ? "green" : "blue"}>
          {text || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: Transaction) => (
        <span
          style={{
            color: record.type === "income" ? "#52c41a" : "#faad14",
            fontWeight: "bold",
          }}
        >
          {record.type === "income" ? "+" : "-"}{" "}
          {amount.toLocaleString("vi-VN")} VND
        </span>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date: string) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text: any, record: Transaction) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa giao dịch này?"
            onConfirm={() =>
              handleDeleteTransaction(record.id, record.amount, record.type)
            }
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginBottom: "20px", fontSize: "20px" }}>
        <span role="img" aria-label="history">
          📜
        </span>{" "}
        Lịch sử giao dịch (Theo tháng)
      </h3>

      {/* Form nhập giao dịch */}
      <Form
        form={addTransactionForm}
        layout="vertical"
        onFinish={handleAddTransaction}
        style={{ marginBottom: "30px" }}
      >
        <div
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <Form.Item
            label="Loại giao dịch"
            style={{ minWidth: "150px" }}
            initialValue="expense"
            rules={[{ required: true, message: "Chọn loại!" }]}
          >
            <Select
              value={newTransactionType}
              onChange={(value) => setNewTransactionType(value)}
            >
              <Option value="expense">Chi tiêu</Option>
              <Option value="income">Thu nhập</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Danh mục"
            style={{ flexGrow: 1, minWidth: "180px" }}
            rules={[
              {
                required: newTransactionType === "expense",
                message: "Chọn danh mục!",
              },
            ]}
          >
            <Select
              placeholder="Chọn danh mục"
              value={newTransactionCategory}
              onChange={(value) => setNewTransactionCategory(value)}
              disabled={newTransactionType === "income"}
            >
              {categories.length === 0 && (
                <Option value="" disabled>
                  Chưa có danh mục cho tháng này
                </Option>
              )}
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Số tiền (VND)"
            style={{ flexGrow: 1, minWidth: "180px" }}
            rules={[{ required: true, message: "Nhập số tiền!" }]}
          >
            <Input
              type="number"
              placeholder="VD: 50000"
              value={newTransactionAmount === null ? "" : newTransactionAmount}
              onChange={(e) => setNewTransactionAmount(Number(e.target.value))}
            />
          </Form.Item>

          <Form.Item label="Ghi chú" style={{ flexGrow: 2, minWidth: "200px" }}>
            <Input
              placeholder="Nội dung giao dịch"
              value={newTransactionNote}
              onChange={(e) => setNewTransactionNote(e.target.value)}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#5243aa",
                borderColor: "#5243aa",
                minWidth: "100px",
              }}
            >
              Thêm
            </Button>
          </Form.Item>
        </div>
      </Form>

      {/* Lịch sử giao dịch */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Tìm kiếm theo nội dung/danh mục"
          prefix={<SearchOutlined />}
          value={transactionSearchTerm}
          onChange={(e) => setTransactionSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button
          onClick={() => setSortByPrice(sortByPrice === "asc" ? "desc" : "asc")}
          icon={
            sortByPrice === "asc" ? (
              <SortAscendingOutlined />
            ) : (
              <SortDescendingOutlined />
            )
          }
        >
          Sắp xếp theo giá ({sortByPrice === "asc" ? "Tăng dần" : "Giảm dần"})
        </Button>
      </div>

      <Table
        columns={transactionTableColumns}
        dataSource={currentTransactions}
        rowKey="id"
        pagination={false} // Disable Ant Design's built-in pagination
        bordered
      />

      {/* Custom Pagination */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          onClick={() => paginate(transactionCurrentPage - 1)}
          disabled={transactionCurrentPage === 1}
          style={{ marginRight: "8px" }}
        >
          Trước
        </Button>
        {[...Array(totalTransactionPages)].map((_, i) => (
          <Button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            type={transactionCurrentPage === i + 1 ? "primary" : "default"}
            style={{ marginRight: "8px" }}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          onClick={() => paginate(transactionCurrentPage + 1)}
          disabled={transactionCurrentPage === totalTransactionPages}
        >
          Sau
        </Button>
      </div>
    </div>
  );
};

export default HistoryPage;
