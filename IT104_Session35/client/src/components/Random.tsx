import { Button, Card, Space, Typography } from 'antd';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { random } from '../slices/randomSlice';

const { Text } = Typography;

export const Random = () => {
    const list = atminSelector((s) => s.random.list);
    const dispatch = atminDispatch();
    return (
        <Card
            title="Random Number Generator"
            style={{ maxWidth: 400, margin: '20px auto' }}
            styles={{
                header: {
                    background: '#1677ff', // nền xanh
                    color: 'white', // chữ trắng
                    fontWeight: 'bold', // chữ đậm
                    textAlign: 'center', // căn giữa
                },
            }}
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Text strong>List: {JSON.stringify(list)}</Text>
                <Button
                    type="primary"
                    block
                    onClick={() =>
                        dispatch(random(Math.floor(Math.random() * 100)))
                    }
                >
                    Random number
                </Button>
            </Space>
        </Card>
    );
};
