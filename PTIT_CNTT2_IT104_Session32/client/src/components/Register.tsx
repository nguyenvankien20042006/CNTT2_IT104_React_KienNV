import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { Account } from '../redux/reducers/Auth.reducer';
import { Login } from './Login';
import { Form, Input, Button, Card, Typography, message } from 'antd';

const { Title } = Typography;

export const Register = () => {
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [form] = Form.useForm(); // ✅ quản lý form AntD
    const dispatch = useDispatch();

    const handleRegister = (values: Account) => {
        if (!values.email || !values.password) {
            message.warning('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        dispatch({ type: 'register', payload: values });
        message.success('Đăng ký thành công!');
        form.resetFields();
        setIsRegister(true);
    };

    return (
        <div>
            {!isRegister ? (
                <Card
                    style={{
                        width: 350,
                        margin: '20px auto',
                        padding: '20px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                    }}
                >
                    <Title
                        level={3}
                        style={{ textAlign: 'center', marginBottom: 20 }}
                    >
                        Đăng ký
                    </Title>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleRegister}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập email..." />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                                {
                                    min: 6,
                                    message: 'Mật khẩu phải ít nhất 6 ký tự!',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu..." />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    <Login />
                </div>
            )}
        </div>
    );
};
