import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Điều hướng mặc định "/" sang "/register" */}
        <Route index element={<Navigate to="/register" replace />} />
        
        {/* Route đăng nhập */}
        <Route path="/login" element={<Login />} />
        
        {/* Route đăng ký */}
        <Route path="/register" element={<Register />} />
        
        {/* Route 404 - không tìm thấy trang */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </Router>
  );
}

export default App;