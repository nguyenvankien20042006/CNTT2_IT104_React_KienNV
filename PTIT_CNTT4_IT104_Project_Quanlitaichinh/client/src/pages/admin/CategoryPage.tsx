/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/CategoryPage.tsx
import axios from "axios";
import React, { useState, useMemo, useCallback, useEffect } from "react";

// Định nghĩa kiểu dữ liệu cho danh mục
interface Category {
  id: number;
  name: string;
  image: string; // URL hoặc đường dẫn icon
  status: "Active" | "Inactive";
}

// Dữ liệu danh mục mẫu (13 đối tượng)
let nextCategoryId = 14; // Bắt đầu ID từ 14 cho các danh mục mới
const initialCategories: Category[] = [
  { id: 1, name: "Tiền tiết kiệm", image: "💰", status: "Active" },
  { id: 2, name: "Tiền vàng", image: "👑", status: "Inactive" },
  { id: 3, name: "Tiền ăn", image: "🍔", status: "Active" },
  { id: 4, name: "Tiền đi chơi", image: "🎲", status: "Inactive" },
  { id: 5, name: "Tiền cho con", image: "🍼", status: "Active" },
  { id: 6, name: "Tiền dự phòng", image: "💯", status: "Active" },
  { id: 7, name: "Tiền sửa đồ", image: "⚙️", status: "Inactive" },
  { id: 8, name: "Tiền cà phê", image: "☕", status: "Active" },
  { id: 9, name: "Tiền điện nước", image: "⚡", status: "Active" },
  { id: 10, name: "Tiền thuê nhà", image: "🏠", status: "Inactive" },
  { id: 11, name: "Tiền đi lại", image: "🚗", status: "Active" },
  { id: 12, name: "Tiền học phí", image: "📚", status: "Active" },
  { id: 13, name: "Tiền sức khỏe", image: "❤️", status: "Inactive" },
];

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // === API CALLS ===
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories.");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (newCat: Omit<Category, "id" | "status">) => {
    try {
      const response = await axios.post("http://localhost:8080/categories", {
        ...newCat,
        id: Date.now().toString(), // Generate unique ID
        status: "Active", // Default status
      });
      setCategories((prev) => [...prev, response.data]);
      alert("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    }
  };

  const updateCategory = async (updatedCat: Category) => {
    try {
      await axios.put(
        `http://localhost:8080/categories/${updatedCat.id}`,
        updatedCat
      );
      setCategories((prev) =>
        prev.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat))
      );
      alert("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category.");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  // Lọc danh mục theo searchTerm
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Tính toán số lượng trang và danh mục cho trang hiện tại
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  // Xử lý thay đổi trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Xử lý tìm kiếm
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  // Mở/khóa danh mục (Toggle Status)
  const toggleCategoryStatus = async (id: string) => {
    const categoryToToggle = categories.find((cat) => cat.id === id);
    if (categoryToToggle) {
      const newStatus =
        categoryToToggle.status === "Active" ? "Inactive" : "Active";
      const updatedCategory = { ...categoryToToggle, status: newStatus };
      await updateCategory(updatedCategory); // Update via API
    }
  };

  // Mở modal thêm danh mục mới
  const handleAddCategoryClick = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage("");
    setUploadedFileName(null);
    setPreviewImage(null);
    setShowCategoryModal(true);
  };

  // Mở modal để cập nhật danh mục
  const handleEditCategoryClick = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryImage(category.image);

    // Kiểm tra nếu image là URL (bắt đầu bằng http) hoặc base64 (data:image) thì hiển thị tên file giả định
    if (category.image.startsWith("http") || category.image.startsWith("data:image")) {
      setUploadedFileName("image.png"); // Placeholder file name
    } else {
      setUploadedFileName(null); // Không có file nếu là icon
    }
    setPreviewImage(category.image);
    setShowCategoryModal(true);
  };

  // Xử lý khi chọn file ảnh (đọc thành Data URL để lưu vào API)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryImage(reader.result as string); // Lưu Data URL vào state
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xóa ảnh đã upload
  const handleRemoveImage = () => {
    setCategoryImage("");
    setUploadedFileName(null);
    setPreviewImage(null);
  };

  // Lưu danh mục (Thêm mới hoặc Cập nhật)
  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      alert("Tên danh mục không được để trống!");
      return;
    }

    if (editingCategory) {
      // Cập nhật danh mục
      const updatedCat: Category = {
        ...editingCategory,
        name: categoryName,
        image: categoryImage || editingCategory.image, // Giữ ảnh cũ nếu không có ảnh mới
      };
      await updateCategory(updatedCat);
    } else {
      // Thêm danh mục mới
      const newCat: Omit<Category, "id" | "status"> = {
        name: categoryName,
        image: categoryImage || "❓", // Mặc định nếu không có ảnh
      };
      await addCategory(newCat);
    }
    setShowCategoryModal(false); // Đóng modal
  };

  // Hàm tạo các nút phân trang
  const renderPaginationButtons = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

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
      <div style={categoryPageStyles.paginationWrapper}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={categoryPageStyles.paginationButton}
        >
          ←
        </button>
        {pageNumbers.map((number, index) =>
          typeof number === "number" ? (
            <button
              key={index}
              onClick={() => paginate(number)}
              style={{
                ...categoryPageStyles.paginationButton,
                ...(currentPage === number &&
                  categoryPageStyles.activePageButton),
              }}
            >
              {number}
            </button>
          ) : (
            <span key={index} style={categoryPageStyles.ellipsis}>
              {number}
            </span>
          )
        )}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={categoryPageStyles.paginationButton}
        >
          →
        </button>
      </div>
    );
  };

  return (
    <div style={categoryPageStyles.mainContent}>
      <div style={categoryPageStyles.header}>
        <button
          onClick={handleAddCategoryClick}
          style={categoryPageStyles.addCategoryButton}
        >
          Add Category
        </button>
        <div style={categoryPageStyles.headerRight}>
          <div style={categoryPageStyles.searchBox}>
            <span style={categoryPageStyles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search here..."
              style={categoryPageStyles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div style={categoryPageStyles.iconButton}>➕</div>
          <div style={categoryPageStyles.iconButton}>⚙️</div>
        </div>
      </div>

      <div style={categoryPageStyles.tableCard}>
        <table style={categoryPageStyles.table}>
          <thead>
            <tr>
              <th style={categoryPageStyles.tableHeader}>STT</th>
              <th style={categoryPageStyles.tableHeader}>Name</th>
              <th style={categoryPageStyles.tableHeader}>Image</th>
              <th style={categoryPageStyles.tableHeader}>Status</th>
              <th style={categoryPageStyles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category, index) => (
              <tr key={category.id} style={categoryPageStyles.tableRow}>
                <td style={categoryPageStyles.tableData}>{indexOfFirstCategory + index + 1}</td> {/* Use calculated index for STT */}
                <td
                  style={{ ...categoryPageStyles.tableData, cursor: "pointer" }}
                  onClick={() => handleEditCategoryClick(category)}
                >
                  {category.name}
                </td>
                <td style={categoryPageStyles.tableData}>
                  {category.image.startsWith("http") ||
                  category.image.startsWith("data:image") ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "24px" }}>{category.image}</span>
                  )}
                </td>
                <td style={categoryPageStyles.tableData}>
                  <span
                    style={{
                      ...categoryPageStyles.statusBadge,
                      ...(category.status === "Active"
                        ? categoryPageStyles.statusActive
                        : categoryPageStyles.statusInactive),
                    }}
                  >
                    {category.status}
                  </span>
                </td>
                <td style={categoryPageStyles.tableData}>
                  <button
                    onClick={() => toggleCategoryStatus(category.id)}
                    style={{
                      ...categoryPageStyles.actionButton,
                      ...(category.status === "Active"
                        ? categoryPageStyles.actionButtonBlock
                        : categoryPageStyles.actionButtonUnblock),
                    }}
                    title={
                      category.status === "Active"
                        ? "Block Category"
                        : "Unblock Category"
                    }
                  >
                    {category.status === "Active" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang */}
        {renderPaginationButtons()}
      </div>

      {/* Modal Thêm/Cập nhật Danh mục */}
      {showCategoryModal && (
        <div style={modalCategoryStyles.overlay}>
          <div style={modalCategoryStyles.modal}>
            <div style={modalCategoryStyles.modalHeader}>
              <h2 style={modalCategoryStyles.modalTitle}>
                {editingCategory ? "Update Category" : "Add Category"}
              </h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                style={modalCategoryStyles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={modalCategoryStyles.modalBody}>
              <div style={modalCategoryStyles.formGroup}>
                <label htmlFor="categoryName" style={modalCategoryStyles.label}>
                  Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  style={modalCategoryStyles.input}
                  placeholder="Enter category name"
                />
              </div>

              <div style={modalCategoryStyles.formGroup}>
                <label style={modalCategoryStyles.label}>Image</label>
                <div style={modalCategoryStyles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    style={modalCategoryStyles.fileInput}
                    onChange={handleImageUpload}
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    style={modalCategoryStyles.uploadButton}
                  >
                    <span style={{ fontSize: "20px", marginRight: "10px" }}>
                      ⬆️
                    </span>{" "}
                    Upload Image
                  </label>
                </div>
                {previewImage && (
                  <div style={modalCategoryStyles.uploadedFile}>
                    {(previewImage.startsWith("http") || previewImage.startsWith("data:image")) ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={modalCategoryStyles.previewImage}
                      />
                    ) : (
                      <span style={categoryPageStyles.categoryImageText}>
                        {previewImage}
                      </span>
                    )}
                    <span style={modalCategoryStyles.fileName}>
                      {uploadedFileName || (previewImage.length > 1 ? "Custom Image" : "Emoji Icon")}
                    </span>
                    <button
                      onClick={handleRemoveImage}
                      style={modalCategoryStyles.removeFileButton}
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={modalCategoryStyles.modalFooter}>
              {editingCategory && ( // Chỉ hiện nút Delete khi đang chỉnh sửa
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this category?")) {
                      deleteCategory(editingCategory.id);
                      setShowCategoryModal(false);
                    }
                  }}
                  style={{ ...modalCategoryStyles.cancelButton, color: "#cc0000", borderColor: "#ffdddd" }} // Custom delete style
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setShowCategoryModal(false)}
                style={modalCategoryStyles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                style={modalCategoryStyles.saveButton}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default CategoryPage;

// Styles riêng cho CategoryPage (có thể tái sử dụng một số từ UsersPage)
const categoryPageStyles: { [key: string]: React.CSSProperties } = {
  mainContent: {
    flexGrow: 1,
    padding: "30px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between", // Thay đổi để có nút Add Category ở trái
    alignItems: "center",
    marginBottom: "30px",
  },
  addCategoryButton: {
    backgroundColor: "#4268F6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#345bbd",
    },
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
    width: "200px",
  },
  iconButton: {
    // Nút + và cài đặt
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
  tableRow: {
    "&:hover": {
      backgroundColor: "#f9f9f9",
    },
  },
  tableData: {
    padding: "15px 10px",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "14px",
    color: "#555",
  },
  categoryImage: {
    width: "40px",
    height: "40px",
    borderRadius: "4px",
    objectFit: "cover",
    verticalAlign: "middle", // Căn giữa với text
  },
  categoryImageText: {
    fontSize: "28px", // Kích thước lớn hơn cho icon
    display: "inline-block",
    width: "40px",
    height: "40px",
    textAlign: "center",
    lineHeight: "40px",
    verticalAlign: "middle",
    backgroundColor: "#f0f4f8",
    borderRadius: "4px",
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
  statusInactive: {
    // Đổi từ Deactivated thành Inactive
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
  actionButtonBlock: {
    color: "#dc3545", // Màu đỏ cho khóa
  },
  actionButtonUnblock: {
    color: "#28a745", // Màu xanh cho mở khóa
  },
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
    minWidth: "35px",
    textAlign: "center",
  },
  activePageButton: {
    backgroundColor: "#4268F6",
    color: "#fff",
    borderColor: "#4268F6",
  },
  ellipsis: {
    padding: "8px 12px",
    color: "#888",
  },
};

// Styles riêng cho Modal Thêm/Cập nhật danh mục
const modalCategoryStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    width: "90%",
    maxWidth: "500px", // Độ rộng modal
    animation: "fadeIn 0.2s ease-out",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: "15px",
  },
  modalTitle: {
    fontSize: "1.25rem", // text-xl
    fontWeight: "700", // font-bold
    color: "#333",
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "1.5rem",
    color: "#999",
    cursor: "pointer",
    "&:hover": {
      color: "#333",
    },
  },
  modalBody: {
    flexGrow: 1,
    padding: "10px 0",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    "&:focus": {
      outline: "none",
      borderColor: "#4268F6",
      boxShadow: "0 0 0 2px rgba(66, 104, 246, 0.2)",
    },
  },
  uploadArea: {
    border: "2px dashed #ff8c00", // Màu cam
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#fff8f0", // Nền nhạt
    transition: "background-color 0.2s, border-color 0.2s",
    "&:hover": {
      backgroundColor: "#fff3e6",
      borderColor: "#ff6c00",
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  fileInput: {
    display: "none",
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff8c00", // Màu cam
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#ff6c00",
    },
  },
  uploadedFile: {
    display: "flex",
    alignItems: "center",
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #eee",
  },
  previewImage: {
    width: "40px",
    height: "40px",
    objectFit: "cover",
    borderRadius: "4px",
    marginRight: "10px",
  },
  fileName: {
    flexGrow: 1,
    fontSize: "14px",
    color: "#555",
  },
  removeFileButton: {
    backgroundColor: "transparent",
  },
  modalFooter:{
  display:"flex",
  justifyContent:"flex-end",
  gap:"20px"
  }
};
