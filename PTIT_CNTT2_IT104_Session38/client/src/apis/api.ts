import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/callAPI';
import type { HelpFilterProps, Book } from '../interfaces/book.interface';
import type { BookFiltersProps } from '../components/BookFilters';

// Lấy tất cả sách
export const getBooks = createAsyncThunk('book/getBooks', async () => {
    const res = await api.get('books');
    return res.data;
});

// Thêm mới sách
export const addBook = createAsyncThunk(
    'book/addBook',
    async (newBook: Book) => {
        const res = await api.post('books', newBook);
        return res.data;
    }
);

// Xóa sách theo id
export const deleteBook = createAsyncThunk(
    'book/deleteBook',
    async (id: number) => {
        await api.delete(`books/${id}`);
        return id;
    }
);

// Cập nhật thông tin sách
export const updateBook = createAsyncThunk(
    'book/updateBook',
    async (book: Book) => {
        const res = await api.put(`books/${book.id}`, book);
        return res.data;
    }
);

// Lọc và sắp xếp sách
export const filterBook = createAsyncThunk(
    'book/filterBook',
    async (filters: BookFiltersProps) => {
        const query = new URLSearchParams();

        if (filters.keyword?.trim()) {
            query.append('title_like', filters.keyword.trim());
        }

        if (filters.category && filters.category !== 'All') {
            query.append('category', filters.category);
        }

        const url = query.toString() ? `books?${query.toString()}` : 'books';

        const res = await api.get(url);
        const data: HelpFilterProps = { data: res.data, sort: filters.sort };
        return data;
    }
);
