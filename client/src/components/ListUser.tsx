import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState, useCallback } from "react";

interface User {
  id?: number;
  name?: string;
  dateOfBirth?: string;
  email?: string;
}

export default function ListUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [user, setUser] = useState<User>({
    name: "",
    dateOfBirth: "",
    email: "",
  });

  // ✅ Dùng useCallback để tránh loop vô hạn
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/users?name_like=${searchValue}`
      );
      setUsers(response.data);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchValue]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ✅ Xóa user
  const handleDelete = async (id?: number) => {
    if (!id) return; // tránh lỗi khi id undefined
    try {
      const response = await axios.delete(`http://localhost:8080/users/${id}`);
      if (response.status === 200) {
        alert("Xóa thành công");
        loadUsers();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // ✅ Lấy giá trị trong input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // ✅ Submit form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (mode === "add") {
        const response = await axios.post("http://localhost:8080/users", user);
        if (response.status === 201) {
          alert("Thêm mới thành công");
        }
      } else {
        const response = await axios.put(
          `http://localhost:8080/users/${user.id}`,
          user
        );
        if (response.status === 200) {
          alert("Cập nhật thành công");
        }
      }

      loadUsers();
      // ✅ Reset form
      setUser({
        name: "",
        email: "",
        dateOfBirth: "",
      });
      setMode("add");
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // ✅ Edit user
  const handleGetUser = (userInfo: User) => {
    setMode("edit");
    setUser({
      ...userInfo,
      dateOfBirth: userInfo.dateOfBirth
        ? dayjs(userInfo.dateOfBirth).format("YYYY-MM-DD")
        : "",
    });
  };

  return (
    <div>
      <h3>Danh sách người dùng</h3>

      {/* Form nhập user */}
      <form onSubmit={handleSubmit}>
        <input
          value={user.name}
          onChange={handleChange}
          name="name"
          type="text"
          placeholder="Họ và tên"
        />
        <input
          value={user.dateOfBirth}
          onChange={handleChange}
          name="dateOfBirth"
          type="date"
          placeholder="Ngày sinh"
        />
        <input
          value={user.email}
          onChange={handleChange}
          name="email"
          type="text"
          placeholder="Email"
        />
        <button type="submit">{mode === "add" ? "Thêm" : "Lưu"}</button>
      </form>

      {/* Tìm kiếm */}
      <input
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        type="text"
        placeholder="Tìm kiếm theo tên"
      />

      {/* Danh sách */}
      <table border={1}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Ngày sinh</th>
            <th>Email</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5}>Loading...</td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.dateOfBirth}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleGetUser(user)}>Sửa</button>
                  <button onClick={() => handleDelete(user.id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination demo */}
      <div>
        <button>Prev</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>Next</button>
      </div>
    </div>
  );
}
