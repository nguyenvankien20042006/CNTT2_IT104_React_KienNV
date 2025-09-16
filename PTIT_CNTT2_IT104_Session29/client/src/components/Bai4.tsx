import axios from 'axios';
import { useEffect } from 'react';

export interface Student {
    id: number;
    student_name: string;
    email: string;
    address: string;
    phone: string;
    status: boolean;
    created_at: string; // dạng ISO date string
}

export default function Bai4() {
    const getAllStudents = async () => {
        try {
            const res = await axios.get('http://localhost:8080/students');
            const students: Student[] = res.data;
            console.log('List student: ', students);
        } catch (error) {
            console.error('Lỗi khi load dữ liệu:', error);
        }
    };

    useEffect(() => {
        getAllStudents();
    },[]);
    
    return <></>;
}
