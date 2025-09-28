import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
    HelpFilterProps,
    initialStateType,
    Student,
} from '../../interfaces/student.interface';
import {
    addStudent,
    deleteStudent,
    filterStudent,
    getStudents,
    updateStudent,
} from '../../apis/api';

const initialState: initialStateType = {
    list: [],
    status: 'idle',
    error: null,
    studentUpdate: null,
};

function compareVietnameseName(a: string, b: string) {
    const splitName = (fullName: string) => fullName.trim().split(/\s+/);
    const nameA = splitName(a);
    const nameB = splitName(b);
    // So sánh từ cuối → tên
    const len = Math.max(nameA.length, nameB.length);
    for (let i = 1; i <= len; i++) {
        const partA = nameA[nameA.length - i] ?? '';
        const partB = nameB[nameB.length - i] ?? '';
        const cmp = partA.localeCompare(partB, 'vi', { sensitivity: 'base' });
        if (cmp !== 0) return cmp;
    }

    return 0;
}

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        getStudentUpdate: (state, action: PayloadAction<Student>) => {
            state.studentUpdate = action.payload;
        },
        resetStudentUpdate: (state) => {
            state.studentUpdate = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getStudents.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(
                getStudents.fulfilled,
                (state, action: PayloadAction<Student[]>) => {
                    state.status = 'success';
                    state.list = action.payload;
                }
            )
            .addCase(getStudents.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })
            .addCase(
                addStudent.fulfilled,
                (state, action: PayloadAction<Student>) => {
                    state.list.push(action.payload);
                }
            )
            .addCase(
                deleteStudent.fulfilled,
                (state, action: PayloadAction<number>) => {
                    state.list = state.list.filter(
                        (s) => s.id !== action.payload
                    );
                }
            )
            .addCase(
                updateStudent.fulfilled,
                (state, action: PayloadAction<Student>) => {
                    state.list = state.list.map((s) =>
                        s.id === action.payload.id ? action.payload : s
                    );
                }
            )
            .addCase(
                filterStudent.fulfilled,
                (state, action: PayloadAction<HelpFilterProps>) => {
                    let list: Student[] = action.payload.data;
                    if (action.payload.sort) {
                        switch (action.payload.sort) {
                            case 'name-asc':
                                list = [...list].sort((a, b) =>
                                    compareVietnameseName(a.name, b.name)
                                );
                                break;
                            case 'name-desc':
                                list = [...list].sort(
                                    (a, b) =>
                                        -compareVietnameseName(a.name, b.name)
                                );
                                break;
                            case 'age-asc':
                                list = [...list].sort((a, b) => a.age - b.age);
                                break;
                            case 'age-desc':
                                list = [...list].sort((a, b) => b.age - a.age);
                                break;
                        }
                    }

                    state.list = list;
                }
            );
    },
});

export const studentStore = studentSlice.reducer;
export const { getStudentUpdate, resetStudentUpdate } = studentSlice.actions;
