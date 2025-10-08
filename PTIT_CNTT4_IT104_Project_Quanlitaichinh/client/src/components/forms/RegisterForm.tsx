import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../apis/api";

interface FormErrors {
username?: string;
password?: string;
confirmPassword?: string;
}

export default function RegisterForm() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [errors, setErrors] = useState<FormErrors>({});
const [isSubmitting, setIsSubmitting] = useState(false);
const navigate = useNavigate();

const validateEmail = (email: string): boolean => {
const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
return emailRegex.test(email);
};

const validateForm = (): boolean => {
const newErrors: FormErrors = {};


if (!username.trim()) {
  newErrors.username = "Email không được để trống";
} else if (!validateEmail(username)) {
  newErrors.username = "Email phải đúng định dạng";
}

if (!password) {
  newErrors.password = "Mật khẩu không được để trống";
} else if (password.length < 6) {
  newErrors.password = "Mật khẩu tối thiểu 6 ký tự trở lên";
}

if (!confirmPassword) {
  newErrors.confirmPassword = "Mật khẩu xác nhận không được để trống";
} else if (confirmPassword !== password) {
  newErrors.confirmPassword = "Mật khẩu xác nhận phải trùng khớp với mật khẩu";
}

setErrors(newErrors);
return Object.keys(newErrors).length === 0;


};

const handleSubmit = async () => {
if (!validateForm()) return;
setIsSubmitting(true);


try {
  await register(username, password);
  alert("Đăng ký thành công! Chuyển đến trang đăng nhập...");
  navigate("/login");
} catch (err: any) {
  const msg = err.response?.data?.message || "Đăng ký thất bại";
  alert(msg);
} finally {
  setIsSubmitting(false);
}


};

const handleUsernameChange = (value: string) => {
setUsername(value);
if (errors.username) {
setErrors({ ...errors, username: undefined });
}
};

const handlePasswordChange = (value: string) => {
setPassword(value);
if (errors.password) {
setErrors({ ...errors, password: undefined });
}
};

const handleConfirmPasswordChange = (value: string) => {
setConfirmPassword(value);
if (errors.confirmPassword) {
setErrors({ ...errors, confirmPassword: undefined });
}
};

return ( <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden"> <div className="fixed inset-0 w-full h-full z-0"> <img 
       src="/images/image%209.png"
       alt="Binance Coin"
       className="w-full h-full object-cover"
     /> </div>


  <div className="bg-white rounded-lg shadow-2xl p-8 z-10 relative" style={{ width: '448px', minHeight: '342px' }}>
    <h2 className="text-2xl font-bold text-center mb-6">Đăng ký tài khoản</h2>

    <div className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="Email đăng nhập ..."
          value={username}
          onChange={(e) => handleUsernameChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
            errors.username
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Mật khẩu ..."
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
            errors.password
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Xác nhận mật khẩu ..."
          value={confirmPassword}
          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
            errors.confirmPassword
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
      </button>
    </div>

    <div className="text-center mt-4 text-sm text-gray-600">
      Đã có tài khoản?{' '}
      <span 
        onClick={() => navigate('/login')}
        className="text-green-600 hover:underline font-semibold cursor-pointer"
      >
        Đăng nhập
      </span>
    </div>
  </div>
</div>


);
}
