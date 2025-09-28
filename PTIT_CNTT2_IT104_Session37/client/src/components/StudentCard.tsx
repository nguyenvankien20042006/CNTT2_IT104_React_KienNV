import { Card, Typography, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Student } from '../interfaces/student.interface';
import { atminDispatch } from '../hooks/reduxHook';
import { getStudentUpdate } from '../redux/reducers/studentSlice';
import { useState } from 'react';
import { deleteStudent } from '../apis/api';

const { Text } = Typography;

interface Props {
    student: Student;
    onOpen: () => void;
}

export default function StudentCard({ student, onOpen }: Props) {
    const dispatch = atminDispatch();
    const [open, setOpen] = useState<boolean>(false);
    const handleUpdate = (student: Student) => {
        dispatch(getStudentUpdate(student));
        onOpen();
    };

    const handleOk = () => {
        dispatch(deleteStudent(student.id));
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
                border: '1px solid #d9d9d9', // viền đậm hơn
            }}
            styles={{ body: { padding: '12px 16px', width: '100%' } }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center', // icon và text căn giữa dọc
                    width: '100%',
                }}
            >
                {/* Bên trái: thông tin */}
                <Space direction="vertical" size={2}>
                    <Text strong style={{ fontSize: 16 }}>
                        {student.name}
                    </Text>
                    <Text type="secondary">
                        Age: {student.age} • Grade: {student.grade}
                    </Text>
                </Space>

                {/* Bên phải: icon */}
                <Space size="middle" align="center">
                    <EditOutlined
                        style={{ cursor: 'pointer', fontSize: 18 }}
                        onClick={() => handleUpdate(student)}
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
                    Bạn có chắc chắn muốn xóa <b>{student.name}</b> không?
                </p>
            </Modal>
        </Card>
    );
}
