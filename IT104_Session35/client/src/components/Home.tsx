import { Button, Card, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { LoginState } from '../slices/loginSlice';
import { atminSelector } from '../hooks/reduxHook';
import { LoginOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const Home = () => {
    const navigate = useNavigate();
    const data: LoginState = atminSelector((s) => s.login);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#fffbe6', // màu vàng phô mai
            }}
        >
            <Card
                style={{
                    width: 350,
                    borderRadius: 20,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    backgroundColor: '#fff8dc', // vàng nhẹ cute
                    textAlign: 'center',
                }}
            >
                <Title level={3} style={{ color: '#fa8c16' }}>
                    🧀 Welcome !
                </Title>
                <Space
                    direction="vertical"
                    size="middle"
                    style={{ marginBottom: 20 }}
                >
                    <Text strong style={{ fontSize: 16 }}>
                        Username: {data.username || 'Chưa đăng nhập'}
                    </Text>
                    <Text strong style={{ fontSize: 16 }}>
                        Email: {data.email || 'Chưa có email'}
                    </Text>
                </Space>
                <Button
                    type="primary"
                    style={{
                        backgroundColor: '#ffd666',
                        borderColor: '#ffd666',
                        color: '#873800',
                        borderRadius: 10,
                        fontWeight: 'bold',
                    }}
                    onClick={() => navigate('/')}
                    icon={<LoginOutlined />}
                >
                    Đăng xuất
                </Button>
            </Card>
        </div>
    );
};
