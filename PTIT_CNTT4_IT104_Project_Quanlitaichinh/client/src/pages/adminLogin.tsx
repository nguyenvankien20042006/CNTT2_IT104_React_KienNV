import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../apis/api";

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
<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
<div className="w-full max-w-md">
<div className="text-center mb-8">
<h1 className="text-4xl font-bold mb-2">
Financial <span className="text-indigo-600">Manager</span>
</h1>
<p className="text-gray-600">Vui lòng đăng nhập</p>
{error && <p className="text-red-600 font-semibold mt-2">{error}</p>}
</div>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Nhập tên đăng nhập ..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full px-4 py-3 bg-gray-100 border ${
            error && !username.trim() ? "border-red-500" : "border-gray-200"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition`}
        />
        {error && !username.trim() && (
          <p className="text-red-500 text-sm mt-1">Vui lòng nhập tên đăng nhập ...</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Nhập mật khẩu ..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-3 bg-gray-100 border ${
            error && !password.trim() ? "border-red-500" : "border-gray-200"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition`}
        />
        {error && !password.trim() && (
          <p className="text-red-500 text-sm mt-1">Vui lòng nhập mật khẩu ...</p>
        )}
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
          <a href="/register" className="text-indigo-600 hover:underline">
            Đăng ký ngay!
          </a>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>

    <div className="text-center mt-8 text-sm text-gray-500">© 2025 - Rikkei Education</div>
  </div>
</div>


);
}