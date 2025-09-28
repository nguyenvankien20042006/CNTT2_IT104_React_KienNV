import { Modal, Form, Input, Button, message } from 'antd';
import type { Student } from '../interfaces/student.interface';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { addStudent, updateStudent } from '../apis/api';
import { useEffect } from 'react';
import { resetStudentUpdate } from '../redux/reducers/studentSlice';

interface Props {
    open: boolean;
    onCancel: () => void;
}

export default function StudentForm({ open, onCancel }: Props) {
    const [form] = Form.useForm();
    const dispatch = atminDispatch();
    const studentUpdate = atminSelector((s) => s.student.studentUpdate);

    useEffect(() => {
        if (studentUpdate) form.setFieldsValue(studentUpdate);
    }, [studentUpdate, form]);

    const handleSubmit = () => {
        form.validateFields().then((values: Omit<Student, 'id'>) => {
            let newStudent = {
                ...values,
                id: Math.floor(Math.random() * 100),
            };
            if (studentUpdate) {
                newStudent = { ...newStudent, id: studentUpdate.id };
                dispatch(updateStudent(newStudent));
                message.success('Cập nhật thành công !');
                dispatch(resetStudentUpdate());
            } else {
                dispatch(addStudent(newStudent));
                message.success('Thêm mới thành công !');
            }
            onCancel();
            form.resetFields();
        });
    };

    return (
        <Modal
            title={studentUpdate ? 'Update Student' : 'Add Student'}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="add" type="primary" onClick={handleSubmit}>
                    {studentUpdate ? 'Update' : 'Add'}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" requiredMark={false}>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter student name',
                        },
                    ]}
                >
                    <Input placeholder="Enter name" />
                </Form.Item>

                <Form.Item
                    label="Age"
                    name="age"
                    rules={[{ required: true, message: 'Please enter age' }]}
                >
                    <Input type="number" placeholder="Enter age" />
                </Form.Item>

                <Form.Item
                    label="Grade"
                    name="grade"
                    rules={[{ required: true, message: 'Please enter grade' }]}
                >
                    <Input placeholder="Enter grade" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
