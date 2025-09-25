import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InitialStateType, Task } from '../interfaces/task.interface';
import {
    createTask,
    deleteTask,
    getAllTask,
    searchTasks,
    updateTask,
} from '../apis/api';

// Khai báo giá trị khởi tạo cho state
const initialState: InitialStateType = {
    status: 'idle',
    data: [],
    error: null,
    task: null,
};

// Tạo slice cho task
const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        getTaskDetail(state, action) {
            state.task = action.payload;
        },
        resetTask: (s) => {
            s.task = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getAllTask.pending, (state) => {
                // Cập nhật trạng thái (status)
                state.status = 'pending';
            })
            .addCase(getAllTask.fulfilled, (state, action) => {
                state.status = 'success';
                state.data = action.payload;
            })
            .addCase(getAllTask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                // Cập nhật lại state data
                state.data.push(action.payload); // action.payload là dữ liệu trả về từ hàm createTask trong API
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.data = state.data.filter(
                    (task) => task.id !== action.payload
                );
            })
            .addCase(
                updateTask.fulfilled,
                (state, action: PayloadAction<Task>) => {
                    state.data = state.data.map((task) =>
                        task.id === action.payload.id ? action.payload : task
                    );
                }
            )
            .addCase(
                searchTasks.fulfilled,
                (state, action: PayloadAction<Task[]>) => {
                    state.status = 'success';
                    state.data = action.payload; 
                }
            );
    },
});

export default taskSlice.reducer; // Cần export như thế này thì store mới hiểu đây là 1 reducer

export const { getTaskDetail, resetTask } = taskSlice.actions;
export const taskStore = taskSlice.reducer;
