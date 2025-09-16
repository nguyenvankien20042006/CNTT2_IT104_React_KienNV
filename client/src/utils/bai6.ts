import { question } from 'readline-sync';
import type { Student } from '../components/Bai4';
import dayjs from 'dayjs';
import axios from 'axios';

function inputStudent(): Student {
    const student_name = question(`Enter name: `);
    const email = question('Enter email: ');
    const address = question('Enter address: ');
    const phone = question('Enter phone: ');

    const student: Student = {
        id: Math.floor(Math.random() * 100),
        student_name,
        email,
        address,
        phone,
        status: true, // mặc định là true
        created_at: dayjs().format('DD/MM/YYYY'), // ngày giờ hiện tại ISO format
    };

    return student;
}

const loadData = async (): Promise<Student[]> => {
    try {
        const res = await axios.get('http://localhost:8080/students');
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const addStudent = async (student: Student) => {
    try {
        const res = await axios.post('http://localhost:8080/students', student);
        if (res.status === 201) {
            console.log('Add student susscessfull');
        }
    } catch (error) {
        console.log(error);
    }
};

const main = async () => {
    const newStudent = inputStudent();
    await addStudent(newStudent);

    const students = await loadData();
    console.log('📚 Danh sách sinh viên:', students);
};

main();

