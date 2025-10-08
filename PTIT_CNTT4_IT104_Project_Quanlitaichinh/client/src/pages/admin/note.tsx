import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    // Xóa dữ liệu đăng nhập (tùy bạn lưu gì, ví dụ token hoặc currentUser)
    localStorage.removeItem("currentUser");
    // Chuyển về trang đăng nhập
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      {/* Nút Logout ở góc trên bên phải */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
        >
          Logout
        </button>
      </div>

      {/* Nội dung Dashboard */}
      <div className="flex-grow flex items-center justify-center text-3xl font-bold text-indigo-600">
        <h1>Welcome to your Dashboard </h1>
      </div>

      {/* Modal xác nhận */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-2">Xác nhận</h2>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
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
