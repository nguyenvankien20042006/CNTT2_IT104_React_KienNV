import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../apis/api";

export default function LoginForm() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [rememberMe, setRememberMe] = useState(false);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setError("");

if (!username.trim() || !password.trim()) {
  setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
  return;
}

setLoading(true);
try {
  const res = await login(username, password);
  const data = res.data;

  if (rememberMe) {
    localStorage.setItem("token", data.token);
  } else {
    sessionStorage.setItem("token", data.token);
  }

  navigate("/dashboard");
} catch (err: any) {
  const msg = err.response?.data?.message || "Tài khoản hoặc mật khẩu không đúng";
  setError(msg);
} finally {
  setLoading(false);
}


};

return (
<div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
{/* Ảnh nền */}
<div className="fixed inset-0 w-full h-full z-0">
<img src="../../../public/images/image 9.png" alt="Binance Coin" className="w-full h-full object-cover" />
</div>

  {/* Form đăng nhập */}
  <div
    className="bg-white rounded-lg shadow-2xl p-8 z-10 relative"
    style={{ width: "448px", minHeight: "342px" }}
  >
    <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>

    {error && <p className="text-red-600 font-semibold text-center mb-4">{error}</p>}

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Email đăng nhập ..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
            error && !username.trim()
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-indigo-500"
          }`}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Mật khẩu ..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
            error && !password.trim()
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-indigo-500"
          }`}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-700">Ghi nhớ đăng nhập</span>
        </label>

        <div className="text-gray-600">
          Chưa có tài khoản?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:underline font-semibold cursor-pointer"
          >
            Đăng ký ngay
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  </div>
</div>


);
}