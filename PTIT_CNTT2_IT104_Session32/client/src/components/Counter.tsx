import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/reducers/reducers';

export const Counter = () => {
    const dispatch = useDispatch();
    const counter = useAppSelector((state) => state.counter);

    const handleIncrease = () => dispatch({ type: 'INCREASE' });
    const handleDecrease = () => dispatch({ type: 'DECREASE' });
    const handleReset = () => dispatch({ type: 'RESET' });

    return (
        <div
            style={{
                width: 300,
                padding: 20,
                border: '1px solid #e8e8e8',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                textAlign: 'center',
                backgroundColor: '#ffffff',
            }}
        >
            <div
                style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: 20,
                    color: '#1890ff',
                }}
            >
                Counter: {counter}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <Button type="primary" onClick={handleIncrease}>
                    Increase
                </Button>
                <Button type="primary" onClick={handleDecrease}>
                    Decrease
                </Button>
                <Button type="primary" onClick={handleReset}>
                    Reset
                </Button>
            </div>
        </div>
    );
};
