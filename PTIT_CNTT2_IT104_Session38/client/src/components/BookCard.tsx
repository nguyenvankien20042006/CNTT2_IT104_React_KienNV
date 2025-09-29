import { Card, Typography, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { atminDispatch } from '../hooks/reduxHook';
import { useState } from 'react';
import type { Book } from '../interfaces/book.interface';
import { getBookUpdate } from '../redux/reducers/bookSlice';
import { deleteBook } from '../apis/api';

const { Text } = Typography;

interface Props {
    book: Book;
    onOpen: () => void;
}

export default function BookCard({ book, onOpen }: Props) {
    const dispatch = atminDispatch();
    const [open, setOpen] = useState<boolean>(false);

    const handleUpdate = (book: Book) => {
        dispatch(getBookUpdate(book));
        onOpen();
    };

    const handleOk = () => {
        dispatch(deleteBook(book.id));
        message.success('Xóa thành công !');
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Card
            style={{
                width: '100%',
                minHeight: 100,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #d9d9d9',
            }}
            styles={{ body: { padding: '12px 16px', width: '100%' } }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                {/* Bên trái: thông tin */}
                <Space direction="vertical" size={2}>
                    <Text strong style={{ fontSize: 16 }}>
                        {book.title}
                    </Text>
                    <Text type="secondary">
                        {book.author} • {book.year} • {book.category}
                    </Text>
                </Space>

                {/* Bên phải: icon */}
                <Space size="middle" align="center">
                    <EditOutlined
                        style={{ cursor: 'pointer', fontSize: 18 }}
                        onClick={() => handleUpdate(book)}
                    />
                    <DeleteOutlined
                        style={{
                            color: 'red',
                            cursor: 'pointer',
                            fontSize: 18,
                        }}
                        onClick={() => setOpen(true)}
                    />
                </Space>
            </div>
            <Modal
                open={open}
                title="Xác nhận xóa"
                okText="Xóa"
                okType="danger"
                cancelText="Hủy"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>
                    Bạn có chắc chắn muốn xóa <b>{book.title}</b> không?
                </p>
            </Modal>
        </Card>
    );
}
