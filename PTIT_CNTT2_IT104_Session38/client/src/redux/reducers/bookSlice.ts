import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Book, HelpFilterProps, initialStateType } from "../../interfaces/book.interface";
import { addBook, deleteBook, filterBook, getBooks, updateBook } from "../../apis/api";


const initialState: initialStateType = {
    list: [],
    status: 'idle',
    error: null,
    bookUpdate: null,
};

const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        getBookUpdate: (state, action: PayloadAction<Book>) => {
            state.bookUpdate = action.payload;
        },
        resetBookUpdate: (state) => {
            state.bookUpdate = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getBooks.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
                state.status = 'success';
                state.list = action.payload;
            })
            .addCase(getBooks.rejected, (state, action) => {
                state.error = action.error.message ?? null;
                state.status = 'failed';
            })
            .addCase(addBook.fulfilled, (state, action: PayloadAction<Book>) => {
                state.list.push(action.payload);
            })
            .addCase(deleteBook.fulfilled, (state, action: PayloadAction<number>) => {
                state.list = state.list.filter((b) => b.id !== action.payload);
            })
            .addCase(updateBook.fulfilled, (state, action: PayloadAction<Book>) => {
                state.list = state.list.map((b) =>
                    b.id === action.payload.id ? action.payload : b
                );
            })
            .addCase(filterBook.fulfilled, (state, action: PayloadAction<HelpFilterProps>) => {
                let list: Book[] = action.payload.data;

                if (action.payload.sort) {
                    switch (action.payload.sort) {
                        case 'title-asc':
                            list = [...list].sort((a, b) =>
                                a.title.localeCompare(b.title, 'vi', { sensitivity: 'base' })
                            );
                            break;
                        case 'title-desc':
                            list = [...list].sort((a, b) =>
                                -a.title.localeCompare(b.title, 'vi', { sensitivity: 'base' })
                            );
                            break;
                        case 'year-asc':
                            list = [...list].sort((a, b) => a.year - b.year);
                            break;
                        case 'year-desc':
                            list = [...list].sort((a, b) => b.year - a.year);
                            break;
                    }
                }

                state.list = list;
            });
    },
});

export const bookStore = bookSlice.reducer;
export const { getBookUpdate, resetBookUpdate } = bookSlice.actions;
