import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/callAPI';
import type { HelpFilterProps, Student } from '../interfaces/student.interface';
import type { StudentFiltersProps } from '../components/StudentFilters';

export const getStudents = createAsyncThunk('student/getStudents', async () => {
    const res = await api.get('students');
    return res.data;
});

export const addStudent = createAsyncThunk(
    'student/addStudent',
    async (newStudent: Student) => {
        const res = await api.post('students', newStudent);
        return res.data;
    }
);

export const deleteStudent = createAsyncThunk(
    'student/deleteStudent',
    async (id: number) => {
        await api.delete(`students/${id}`);
        return id;
    }
);

export const updateStudent = createAsyncThunk(
    'student/updateStudent',
    async (student: Student) => {
        const res = await api.put(`students/${student.id}`, student);
        return res.data;
    }
);

export const filterStudent = createAsyncThunk(
    'task/filterStudent',
    async (filters: StudentFiltersProps) => {
        const query = new URLSearchParams();

        if (filters.keyword?.trim()) {
            query.append('name_like', filters.keyword.trim());
        }

        if (filters.grade && filters.grade !== 'Tất cả') {
            query.append('grade', filters.grade);
        }

        const url = query.toString()
            ? `students?${query.toString()}`
            : 'students';

        const res = await api.get(url);
        const data: HelpFilterProps = { data: res.data, sort: filters.sort };
        return data;
    }
);
