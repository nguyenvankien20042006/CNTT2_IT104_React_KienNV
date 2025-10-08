import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/forms/LoginForm';

import RegisterForm from './components/forms/RegisterForm';
import Dashboard from './pages/admin/dashboard';
import InfoManager from './pages/users/InfoManager';

function App() {
  return (
    <Router>
      <Routes>
        {/* Điều hướng mặc định "/" sang "/register" */}
        <Route index element={<Navigate to="/register" replace />} />

        {/* Route đăng nhập */}
        <Route path="/login" element={<LoginForm />} />

        {/* Route đăng ký */}
        <Route path="/register" element={<RegisterForm />} />

        {/* Route Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/**rote trang user */}
        <Route path="/InfoManager" element={<InfoManager />} />

        {/* Route 404 - không tìm thấy trang */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
