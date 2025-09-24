import { Form, Input, Button, Card, Typography, message } from 'antd';
import { login, type LoginState } from '../slices/loginSlice';
import { atminDispatch } from '../hooks/reduxHook';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export const Login = () => {
    const [form] = Form.useForm();
    const dispatch = atminDispatch();
    const nvg = useNavigate();

    const handleSubmit = (values: LoginState) => {
        dispatch(login(values));
        message.success(`Welcome, ${values.username}!`);
        nvg('/home');
        form.resetFields();
    };

    return (
        <div
            style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}
        >
            <Card style={{ width: 400, padding: 20 }}>
                <Title
                    level={3}
                    style={{ textAlign: 'center', marginBottom: 20 }}
                >
                    Login
                </Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your username!',
                            },
                        ]}
                    >
                        <Input placeholder="Enter username" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your email!',
                            },
                            {
                                type: 'email',
                                message: 'Please enter a valid email!',
                            },
                        ]}
                    >
                        <Input placeholder="Enter email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your password!',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
