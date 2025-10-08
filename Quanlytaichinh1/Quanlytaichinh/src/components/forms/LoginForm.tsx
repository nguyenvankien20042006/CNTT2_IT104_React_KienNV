import { useState } from 'react';

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Kiểm tra email không được trống
    if (!username.trim()) {
      newErrors.username = 'Email không được để trống';
    } else if (!username.includes('@')) {
      newErrors.username = 'Email không hợp lệ';
    }

    // Kiểm tra mật khẩu không được trống
    if (!password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Xóa lỗi cũ trước khi validate
    setErrors({});
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Giả lập API call để kiểm tra đăng nhập
      setTimeout(() => {
        // Thông tin đăng nhập mẫu (trong thực tế sẽ gọi API)
        const validEmail = 'vankien.200406@gmail.com';
        const validPassword = '12345678';

        if (username === validEmail && password === validPassword) {
          console.log('Đăng nhập thành công:', { username });
          alert('Đăng nhập thành công! Chuyển đến trang chủ...');
          // Trong code thực tế: navigate('/');
          window.location.href = '/home'; // Chuyển hướng đến trang Home
        } else {
          // Hiển thị lỗi khi email hoặc mật khẩu không đúng
          setErrors({ 
            general: 'Email hoặc mật khẩu không đúng. Vui lòng thử lại!' 
          });
        }
        
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    // Xóa lỗi khi user bắt đầu nhập lại
    if (errors.username || errors.general) {
      setErrors({ ...errors, username: undefined, general: undefined });
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    // Xóa lỗi khi user bắt đầu nhập lại
    if (errors.password || errors.general) {
      setErrors({ ...errors, password: undefined, general: undefined });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ảnh đồng xu Binance - FULL SCREEN */}
      <div className="fixed inset-0 w-full h-full z-0">
        <img 
          src="/images/image%209.png"
          alt="Binance Coin"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Sign In Form */}
      <div className="bg-white rounded-lg shadow-2xl p-8 z-10 relative" style={{ width: '350px' }}>
        {/* Header với icon khóa */}
        <div className="text-center mb-6">
          <div className="inline-block mb-2">
            <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Sign In</h2>
        </div>

        <div className="space-y-4">
          {/* Thông báo lỗi chung khi email/mật khẩu không đúng */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition text-sm ${
                errors.username
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.username}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu của bạn..."
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition text-sm ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Ghi chú thông tin test */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded text-xs">
            <strong>Thông tin test:</strong> admin@binance.com / 123456
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Sign In'}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-4 text-sm text-gray-600">
          You don't have account?{' '}
          <span 
            className="text-indigo-600 hover:underline font-semibold cursor-pointer"
          >
            Sign Up Now
          </span>
        </div>
      </div>
    </div>
  );
}