import { Modal, Form, Input, Button, message } from 'antd';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { addBook, updateBook } from '../apis/api';
import { useEffect } from 'react';
import { resetBookUpdate } from '../redux/reducers/bookSlice';
import type { Book } from '../interfaces/book.interface';

interface Props {
    open: boolean;
    onCancel: () => void;
}

export default function BookForm({ open, onCancel }: Props) {
    const [form] = Form.useForm();
    const dispatch = atminDispatch();
    const bookUpdate = atminSelector((s) => s.book.bookUpdate);

    useEffect(() => {
        if (bookUpdate) form.setFieldsValue(bookUpdate);
    }, [bookUpdate, form]);

    const handleSubmit = () => {
        form.validateFields().then((values: Omit<Book, 'id'>) => {
            let newBook = {
                ...values,
                id: Math.floor(Math.random() * 1000),
            };
            if (bookUpdate) {
                newBook = { ...newBook, id: bookUpdate.id };
                dispatch(updateBook(newBook));
                message.success('Cập nhật thành công!');
                dispatch(resetBookUpdate());
            } else {
                dispatch(addBook(newBook));
                message.success('Thêm mới thành công!');
            }
            onCancel();
            form.resetFields();
        });
    };

    return (
        <Modal
            title={bookUpdate ? 'Update Book' : 'Add Book'}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="add" type="primary" onClick={handleSubmit}>
                    {bookUpdate ? 'Update' : 'Add'}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" requiredMark={false}>
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter book title' }]}
                >
                    <Input placeholder="Enter book title" />
                </Form.Item>

                <Form.Item
                    label="Author"
                    name="author"
                    rules={[{ required: true, message: 'Please enter author name' }]}
                >
                    <Input placeholder="Enter author name" />
                </Form.Item>

                <Form.Item
                    label="Year"
                    name="year"
                    rules={[{ required: true, message: 'Please enter publish year' }]}
                >
                    <Input type="number" placeholder="Enter publish year" />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please enter category' }]}
                >
                    <Input placeholder="Enter category" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
