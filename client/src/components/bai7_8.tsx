import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Checkbox, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Student } from './Bai4';
import axios from 'axios';

const Bai7: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idDelete, setIdDelete] = useState<number | null>(null);

    const showModal = (id: number) => {
        setIsModalOpen(true);
        setIdDelete(id);
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await axios.delete(
                `http://localhost:8080/students/${id}`
            );
            if (res.status === 200) {
                console.log('Xóa thành công');
                loadData();
            }
        } catch (error) {
            console.error('Lỗi khi load dữ liệu:', error);
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
        if (idDelete !== null) handleDelete(idDelete);
        setIdDelete(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const loadData = async () => {
        try {
            const res = await axios.get('http://localhost:8080/students');
            setStudents(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        loadData();
    }, []);
    const columns = [
        {
            title: <Checkbox />,
            dataIndex: 'checkbox',
            render: () => <Checkbox />,
            width: 50,
        },
        {
            title: 'Tên sinh viên',
            dataIndex: 'student_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
        },
        {
            title: 'Lựa chọn',
            dataIndex: 'actions',
            render: (_: unknown, record: Student) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => console.log('Edit', record.id)}
                    />
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => showModal(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div
                style={{
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Button type="primary" icon={<PlusOutlined />}>
                    Thêm mới sinh viên
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={students}
                pagination={{ pageSize: 10, showSizeChanger: false }}
                rowKey="id"
            />
            <Modal
                title="Delete student"
                closable={true}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có muốn xóa sinh viên này không ?</p>
            </Modal>
        </div>
    );
};

export default Bai7;
