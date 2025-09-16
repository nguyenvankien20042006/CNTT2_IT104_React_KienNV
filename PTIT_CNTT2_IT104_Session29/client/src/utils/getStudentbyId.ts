import axios from 'axios';

interface Student {
    id: number;
    student_name: string;
    email: string;
    address: string;
    phone: string;
    status: boolean;
    created_at: string;
}

const getStudentById = async () => {
    try {
        // Gọi API để lấy toàn bộ data (vì đang bọc trong "data")
        const response = await axios.get('http://localhost:8080/students/');

        // Lấy danh sách sinh viên trong data
        const student: Student = response.data;

        if (student) {
            console.log('Thông tin sinh viên:', student);
        } else {
            console.log('Không tìm thấy bản ghi');
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }
};

// Ví dụ test
getStudentById(); // Tìm sinh viên có id = 1
