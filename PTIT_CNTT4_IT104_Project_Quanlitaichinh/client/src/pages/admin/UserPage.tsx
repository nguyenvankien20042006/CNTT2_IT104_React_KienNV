// src/components/UsersPage.tsx

import React, { useState, useMemo } from "react";

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female";
  status: "Active" | "Deactive";
}

// Dữ liệu người dùng mẫu (20 người dùng)
const allUsers: User[] = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvanA@gmail.com", phone: "0987654321", gender: "Female", status: "Active" },
  { id: 2, name: "Phạm Thị B", email: "phamthiB@gmail.com", phone: "0987654321", gender: "Male", status: "Deactive" },
  { id: 3, name: "Trần Minh C", email: "tranminhC@gmail.com", phone: "0987654321", gender: "Male", status: "Active" },
  { id: 4, name: "Nguyễn Duy D", email: "nguyenduyD@gmail.com", phone: "0987654321", gender: "Female", status: "Deactive" },
  { id: 5, name: "Nguyễn Quang E", email: "nguyenquangE@gmail.com", phone: "0987654321", gender: "Male", status: "Active" },
  { id: 6, name: "Ngô Văn F", email: "ngovanF@gmail.com", phone: "0987654321", gender: "Female", status: "Deactive" },
  { id: 7, name: "Hồ Xuân G", email: "hoxuanG@gmail.com", phone: "0987654321", gender: "Female", status: "Deactive" },
  { id: 8, name: "Trịnh Quốc K", email: "trinhquocK@gmail.com", phone: "0987654321", gender: "Male", status: "Active" },
  { id: 9, name: "Lê Thị L", email: "lethiL@gmail.com", phone: "0987654322", gender: "Female", status: "Active" },
  { id: 10, name: "Võ Minh M", email: "vominhM@gmail.com", phone: "0987654323", gender: "Male", status: "Deactive" },
  { id: 11, name: "Đặng Thu N", email: "dangthuN@gmail.com", phone: "0987654324", gender: "Female", status: "Active" },
  { id: 12, name: "Bùi Quốc O", email: "buiquocO@gmail.com", phone: "0987654325", gender: "Male", status: "Deactive" },
  { id: 13, name: "Mai Thanh P", email: "maithanhP@gmail.com", phone: "0987654326", gender: "Female", status: "Active" },
  { id: 14, name: "Hoàng Văn Q", email: "hoangvanQ@gmail.com", phone: "0987654327", gender: "Male", status: "Deactive" },
  { id: 15, name: "Phan Thị R", email: "phanthiR@gmail.com", phone: "0987654328", gender: "Female", status: "Active" },
  { id: 16, name: "Vương Đình S", email: "vuongdinhS@gmail.com", phone: "0987654329", gender: "Male", status: "Deactive" },
  { id: 17, name: "Đỗ Thị T", email: "dothiT@gmail.com", phone: "0987654330", gender: "Female", status: "Active" },
  { id: 18, name: "Chu Văn U", email: "chuvanU@gmail.com", phone: "0987654331", gender: "Male", status: "Deactive" },
  { id: 19, name: "Nguyễn Thị V", email: "nguyenthIV@gmail.com", phone: "0987654332", gender: "Female", status: "Active" },
  { id: 20, name: "Trần Văn X", email: "tranvanX@gmail.com", phone: "0987654333", gender: "Male", status: "Deactive" },
];

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(allUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6; // Mỗi trang 6 người dùng

  // Lọc người dùng theo searchTerm
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Tính toán số lượng trang và người dùng cho trang hiện tại
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Xử lý thay đổi trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Xử lý tìm kiếm
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  // Mở/khóa người dùng
  const toggleUserStatus = (id: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id
          ? { ...user, status: user.status === "Active" ? "Deactive" : "Active" }
          : user
      )
    );
  };

  // Hàm tạo các nút phân trang
  const renderPaginationButtons = () => {
    const pageNumbers = [];
    // Hiển thị 2 trang trước, trang hiện tại, 2 trang sau
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Điều chỉnh nếu ở đầu hoặc cuối danh sách trang
    if (currentPage <= 3) {
      endPage = Math.min(totalPages, 5);
    }
    if (currentPage > totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return (
      <div style={paginationStyles.paginationWrapper}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={paginationStyles.paginationButton}
        >
          ←
        </button>
        {pageNumbers.map((number, index) =>
          typeof number === "number" ? (
            <button
              key={index}
              onClick={() => paginate(number)}
              style={{
                ...paginationStyles.paginationButton,
                ...(currentPage === number && paginationStyles.activePageButton),
              }}
            >
              {number}
            </button>
          ) : (
            <span key={index} style={paginationStyles.ellipsis}>
              {number}
            </span>
          )
        )}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={paginationStyles.paginationButton}
        >
          →
        </button>
      </div>
    );
  };


  return (
    <div style={userPageStyles.mainContent}>
      <div style={userPageStyles.header}>
        {/* Placeholder cho nút thêm và cài đặt, hoặc bạn có thể bỏ qua */}
        <div style={userPageStyles.headerRight}>
          <div style={userPageStyles.searchBox}>
            <span style={userPageStyles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search here..."
              style={userPageStyles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div style={userPageStyles.iconButton}>➕</div>
          <div style={userPageStyles.iconButton}>⚙️</div>
        </div>
      </div>

      <div style={userPageStyles.tableCard}>
        <table style={userPageStyles.table}>
          <thead>
            <tr>
              <th style={userPageStyles.tableHeader}>STT</th>
              <th style={userPageStyles.tableHeader}>Name</th>
              <th style={userPageStyles.tableHeader}>Email</th>
              <th style={userPageStyles.tableHeader}>Phone</th>
              <th style={userPageStyles.tableHeader}>Gender</th>
              <th style={userPageStyles.tableHeader}>Status</th>
              <th style={userPageStyles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} style={userPageStyles.tableRow}>
                <td style={userPageStyles.tableData}>{user.id}</td>
                <td style={userPageStyles.tableData}>{user.name}</td>
                <td style={userPageStyles.tableData}>{user.email}</td>
                <td style={userPageStyles.tableData}>{user.phone}</td>
                <td style={userPageStyles.tableData}>{user.gender}</td>
                <td style={userPageStyles.tableData}>
                  <span
                    style={{
                      ...userPageStyles.statusBadge,
                      ...(user.status === "Active"
                        ? userPageStyles.statusActive
                        : userPageStyles.statusDeactivated),
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td style={userPageStyles.tableData}>
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    style={{
                      ...userPageStyles.actionButton,
                      ...(user.status === "Active"
                        ? userPageStyles.actionButtonLock
                        : userPageStyles.actionButtonUnlock),
                    }}
                    title={user.status === "Active" ? "Deactivate User" : "Activate User"}
                  >
                    {user.status === "Active" ? "🔒" : "🔓"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang */}
        {renderPaginationButtons()}
      </div>
    </div>
  );
};

export default UsersPage;

// Styles riêng cho UsersPage
const userPageStyles: { [key: string]: React.CSSProperties } = {
  mainContent: {
    flexGrow: 1,
    padding: "30px",
  },
  header: {
    display: "flex",
    justifyContent: "flex-end", // Căn chỉnh sang phải
    alignItems: "center",
    marginBottom: "30px",
  },
  headerRight: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "8px 15px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  },
  searchIcon: {
    marginRight: "10px",
    color: "#999",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    width: "200px", // Độ rộng ô tìm kiếm
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
  tableCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    padding: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  tableHeader: {
    textAlign: "left",
    padding: "15px 10px",
    borderBottom: "1px solid #f0f0f0",
    color: "#888",
    fontSize: "13px",
    textTransform: "uppercase",
  },
  // tableRow: {
  //   "&:hover": {
  //     backgroundColor: "#f9f9f9",
  //   },
  // },
  tableData: {
    padding: "15px 10px",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "14px",
    color: "#555",
  },
  statusBadge: {
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block",
  },
  statusActive: {
    backgroundColor: "#e6ffed",
    color: "#28a745",
  },
  statusDeactivated: {
    backgroundColor: "#ffe9e9",
    color: "#dc3545",
  },
  actionButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    marginLeft: "5px",
  },
  actionButtonLock: {
    color: "#dc3545", // Màu đỏ cho khóa
  },
  actionButtonUnlock: {
    color: "#28a745", // Màu xanh cho mở khóa
  },
};

const paginationStyles: { [key: string]: React.CSSProperties } = {
  paginationWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    gap: "5px",
  },
  paginationButton: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    color: "#555",
    fontSize: "14px",
    transition: "background-color 0.2s, border-color 0.2s",
    minWidth: '35px',
    textAlign: 'center',
  },
  activePageButton: {
    backgroundColor: "#4268F6",
    color: "#fff",
    borderColor: "#4268F6",
  },
  paginationButtonHover: {
    backgroundColor: "#f0f4f8",
    borderColor: "#c9d6e4",
  },
  paginationButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  ellipsis: {
    padding: "8px 12px",
    color: "#888",
  },
};