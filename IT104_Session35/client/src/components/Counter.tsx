import React from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { decrease, increase, reset } from '../slices/counterSlice';

const { Title} = Typography;

const Counter: React.FC = () => {
    const value = atminSelector((state) => state.counter.value);
    const dispatch = atminDispatch();

    return (
        <Card
            style={{
                width: 420,
                margin: '60px auto',
                textAlign: 'center',
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            title={
                <Title level={3} style={{ margin: 0 }}>
                    🚀 Counter App
                </Title>
            }
        >
            <Title level={1} style={{ marginBottom: 24 }}>
                {value}
            </Title>

            <Space size="large">
                <Button type="primary" onClick={() => dispatch(increase())}>
                    Increase
                </Button>

                <Button
                    type="primary"
                    danger
                    onClick={() => dispatch(decrease())}
                >
                    Decrease
                </Button>

                <Button
                    icon={<ReloadOutlined />}
                    onClick={() => dispatch(reset())}
                >
                    Reset
                </Button>
            </Space>
        </Card>
    );
};

export default Counter;
