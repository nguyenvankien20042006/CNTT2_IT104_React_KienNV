/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const API_URL = "http://localhost:8080";
const api = axios.create({
baseURL: "http://localhost:8080", // JSON Server mặc định không có /api
headers: { "Content-Type": "application/json" },
});
export const login = async (username: string, password: string) => {
  const res = await axios.get(`${API_URL}/users`, {
    params: { username, password },
  });

  const users = res.data;
  if (users.length === 0) {
    throw new Error("Tài khoản hoặc mật khẩu không đúng");
  }

  // Giả lập token trả về
  return { data: { token: "fake-token", user: users[0] } };
};


// Đăng ký tài khoản mới
export const register = async (username: string, password: string) => {
const res = await api.post("/users", { username, password });
return res.data;
};

export default api;