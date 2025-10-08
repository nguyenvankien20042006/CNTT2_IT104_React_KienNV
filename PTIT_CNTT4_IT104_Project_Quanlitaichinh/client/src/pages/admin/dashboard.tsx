// src/components/Dashboard.tsx (hoặc tên component chính của bạn)

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { useState } from "react";
import UsersPage from "./UserPage"; // Import component UsersPage mới
import { useNavigate } from "react-router-dom";
import CategoryPage from "./CategoryPage";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Dashboard"); // State để quản lý tab hiện tại
  const navigate = useNavigate(); // Khởi tạo hook navigate
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State mới cho modal đăng xuất

  const handleLogoutConfirm = () => {
    // Xóa dữ liệu đăng nhập (tùy bạn lưu gì, ví dụ token hoặc currentUser)
    localStorage.removeItem("currentUser");
    // Chuyển về trang đăng nhập
    navigate("/login");
    setShowLogoutModal(false); // Đóng modal sau khi đăng xuất
  };


  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          // Nội dung Dashboard cũ của bạn
          <div style={styles.mainContent}>
            <div style={styles.header}>
              <div style={styles.headerRight}>
                <div style={styles.iconButton}>➕</div>
                <div style={styles.iconButton}>⚙️</div>
              </div>
            </div>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>USER</p>
                <h3 style={styles.statValue}>
                  1,500 <span style={styles.positiveChange}>▲ 36%</span>
                </h3>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>CATEGORY</p>
                <h3 style={styles.statValue}>
                  500 <span style={styles.negativeChange}>▼ 14%</span>
                </h3>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>SPENDING</p>
                <h3 style={styles.statValue}>
                  84,382 <span style={styles.positiveChange}>▲ 36%</span>
                </h3>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>TOTAL MONEY</p>
                <h3 style={styles.statValue}>
                  33,493,022$ <span style={styles.positiveChange}>▲ 36%</span>
                </h3>
              </div>
            </div>

            <div style={styles.chartsAndCustomers}>
              <div style={styles.reportMoneyCard}>
                <div style={styles.reportMoneyHeader}>
                  <h3 style={styles.cardTitle}>report money</h3>
                  <div style={styles.timeframeButtons}>
                    <button style={styles.timeframeButton}>6 Months</button>
                    <button style={styles.timeframeButton}>12 Months</button>
                    <button style={styles.timeframeButton}>30 Days</button>
                    <button style={styles.timeframeButton}>7 Days</button>
                  </div>
                  <button style={styles.exportPdfButton}>Export PDF</button>
                </div>
                <div style={styles.chartPlaceholder}>
                  <p
                    style={{
                      position: "absolute",
                      top: "40%",
                      left: "30%",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    June 2025
                    <br />
                    ($45,591)
                  </p>
                  {/* Sử dụng một ảnh ví dụ cho biểu đồ, hoặc bạn có thể tạo một div màu đơn giản */}
                  <img
                    src="../../../public/images/bieu do chung khoan.png"
                    alt="Biểu đồ chứng khoán"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              </div>

              <div style={styles.recentCustomersCard}>
                <h3 style={styles.cardTitle}>Recent Customers</h3>
                <p style={styles.customerDescription}>
                  Lorem ipsum dolor sit ametis.
                </p>
                <div style={styles.customerList}>
                  {/* Dữ liệu khách hàng mẫu, có thể lấy từ bên ngoài hoặc fetch API */}
                  {[
                    { name: "Jenny Wilson", email: "jenny-wilson@gmail.com", location: "Austin", amount: "$11,234", avatarUrl: "../../../public/images/Image-customer1.png" },
                    { name: "Devon Lane", email: "devon-lane@gmail.com", location: "New York", amount: "$11,591", avatarUrl: "../../../public/images/Image-customer2.png" },
                    { name: "Jane Cooper", email: "jane-cooper@gmail.com", location: "Toledo", amount: "$10,483", avatarUrl: "../../../public/images/Image-customer3.png" },
                    { name: "Dianne Russell", email: "dianne-russell@gmail.com", location: "Naganville", amount: "$9,084", avatarUrl: "../../../public/images/Image-customer4.png" },
                  ].map((customer, index) => (
                    <div key={index} style={styles.customerItem}>
                      <img src={customer.avatarUrl} alt={customer.name} style={styles.avatar} />
                      <div style={styles.customerInfo}>
                        <p style={styles.customerName}>{customer.name}</p>
                        <p style={styles.customerEmail}>{customer.email}</p>
                        <p style={styles.customerLocation}>{customer.location}</p>
                      </div>
                      <p style={styles.customerAmount}>{customer.amount}</p>
                    </div>
                  ))}
                </div>
                <p style={styles.seeAllCustomers}>
                  SEE ALL CUSTOMERS <span style={{ marginLeft: "5px" }}>›</span>
                </p>
              </div>
            </div>
          </div>
        );
      case "Users":
        return <UsersPage />; // Render UsersPage khi activeTab là "Users"
      case "Category":
        return <CategoryPage />
        return (
          <div style={styles.mainContent}>
            <h2 style={{ padding: "20px" }}>Category Page Content</h2>
            {/* Nội dung trang Category */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Financial Manager</h2>
        <ul style={styles.navList}>
          <li
            style={{ ...styles.navItem, ...(activeTab === "Dashboard" && styles.activeNavItem) }}
            onClick={() => setActiveTab("Dashboard")}
          >
            <span style={styles.icon}>📊</span> Dashboard
          </li>
          <li
            style={{ ...styles.navItem, ...(activeTab === "Users" && styles.activeNavItem) }}
            onClick={() => setActiveTab("Users")}
          >
            <span style={styles.icon}>👥</span> Users
          </li>
          <li
            style={{ ...styles.navItem, ...(activeTab === "Category" && styles.activeNavItem) }}
            onClick={() => setActiveTab("Category")}
          >
            <span style={styles.icon}>🗂️</span> Category
          </li>
        </ul>
        <div style={styles.signOut} onClick={() => setShowLogoutModal(true)}>
          <span style={styles.icon}>➡️</span> Sign out
        </div>
      </div>
      {renderContent()}

      {/* Modal xác nhận Đăng xuất */}
      {showLogoutModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h2 style={modalStyles.modalTitle}>Xác nhận</h2>
            <p style={modalStyles.modalText}>
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
            </p>

            <div style={modalStyles.modalActions}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={modalStyles.cancelButton}
              >
                Hủy
              </button>
              <button
                onClick={handleLogoutConfirm}
                style={modalStyles.confirmButton}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};

export default Dashboard;

// Thêm định nghĩa style cho modal đăng xuất
const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "30px",
    width: "400px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#333",
  },
  modalText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "25px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-around",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#4268F6",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "500",
  },
};


// Styles cũ và thêm styles mới cho avatar, customerItem, v.v.
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f8f8fa",
    color: "#333",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#fff",
    padding: "30px 20px",
    boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid #eee",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "40px",
    color: "#333",
  },
  navList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    flexGrow: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    marginBottom: "10px",
    borderRadius: "8px",
    color: "#666",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  activeNavItem: {
    backgroundColor: "#f0f4f8",
    color: "#4268F6",
    fontWeight: "500",
  },
  icon: {
    marginRight: "10px",
    fontSize: "18px",
  },
  signOut: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    marginTop: "20px",
    color: "#666",
    cursor: "pointer",
  },
  mainContent: {
    flexGrow: 1,
    padding: "30px",
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "30px",
  },
  headerRight: {
    display: "flex",
    gap: "15px",
  },
  iconButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
    cursor: "pointer",
    fontSize: "18px",
    color: "#666",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  statLabel: {
    fontSize: "13px",
    color: "#999",
    marginBottom: "5px",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "600",
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
  },
  positiveChange: {
    color: "#28a745",
    fontSize: "14px",
    fontWeight: "normal",
  },
  negativeChange: {
    color: "#dc3545",
    fontSize: "14px",
    fontWeight: "normal",
  },
  chartsAndCustomers: {
    display: "flex",
    gap: "20px",
  },
  reportMoneyCard: {
    flex: 3,
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    position: "relative", // Quan trọng cho placeholder biểu đồ
  },
  reportMoneyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },
  timeframeButtons: {
    display: "flex",
    gap: "5px",
  },
  timeframeButton: {
    backgroundColor: "transparent",
    border: "1px solid #eee",
    borderRadius: "5px",
    padding: "8px 12px",
    fontSize: "13px",
    cursor: "pointer",
    color: "#666",
  },
  exportPdfButton: {
    backgroundColor: "#4268F6",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 15px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
  },
  chartPlaceholder: {
    width: "100%",
    height: "250px", // Chiều cao của biểu đồ
    backgroundColor: "#f0f4f8",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#999",
    fontSize: "16px",
    position: "relative",
    overflow: "hidden",
  },
  // Styles mới cho avatar, customerItem, v.v.
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '15px',
    border: '1px solid #eee',
  },
  customerItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  customerInfo: {
    flexGrow: 1,
  },
  customerName: {
    fontWeight: '500',
    marginBottom: '2px',
    fontSize: '15px',
  },
  customerEmail: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '2px',
  },
  customerLocation: {
    fontSize: '12px',
    color: '#aaa',
  },
  customerAmount: {
    fontWeight: '600',
    color: '#333',
    fontSize: '15px',
  },
  seeAllCustomers: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#4268F6',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
  },
  recentCustomersCard: { // Đảm bảo style này tồn tại
    flex: 1,
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  customerDescription: {
    fontSize: '13px',
    color: '#999',
    marginBottom: '20px',
  },
  customerList: {
    maxHeight: '300px', // Giới hạn chiều cao và thêm cuộn nếu cần
    overflowY: 'auto',
  },
};