import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import type { Task } from '../interfaces/task.interface';
import type { TaskFiltersProps } from '../components/TaskFilters';

// Gọi các API bên ngoài
export const getAllTask = createAsyncThunk('task/getAllTask', async () => {
    const response = axiosInstance.get('tasks');

    return (await response).data;
});

// Thêm mới task
export const createTask = createAsyncThunk(
    'task/createTask',
    async (task: Task) => {
        const response = await axiosInstance.post('tasks', task);

        return response.data;
    }
);

// Hàm xóa task
export const deleteTask = createAsyncThunk(
    'task/deleteTask',
    async (id: number, thunkAPI) => {
        try {
            await axiosInstance.delete(`tasks/${id}`);
            return id;
        } catch (error) {
            console.error('Delete failed:', error);
            return thunkAPI.rejectWithValue('Task not found or server down');
        }
    }
);

// Hàm sửa task
export const updateTask = createAsyncThunk(
    'task/updateTask',
    async (task: Task, thunkAPI) => {
        try {
            const response = await axiosInstance.put(`tasks/${task.id}`, task);
            console.log(response.data);

            return response.data;
        } catch (error) {
            console.error('Update failed:', error);
            return thunkAPI.rejectWithValue('Task not found or server down');
        }
    }
);

export const searchTasks = createAsyncThunk(
    'task/searchTasks',
    async (filter: TaskFiltersProps) => {
        const query = new URLSearchParams();

        // Nếu có keyword, dùng _like để tìm substring
        if (filter.keyword?.trim()) {
            query.append('title_like', filter.keyword.trim());
        }

        // Nếu có priority, filter exact match
        if (filter.priority) {
            query.append('priority', filter.priority);
        }

        // Nếu có completed, filter exact match
        if (filter.completed !== null) {
            query.append('completed', filter.completed.toString());
        }

        // Nếu query rỗng, fetch tất cả
        const url = query.toString() ? `tasks?${query.toString()}` : 'tasks';

        const res = await axiosInstance.get(url);
        return res.data;
    }
);
