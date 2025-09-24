import { Button, Card } from 'antd';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { change } from '../slices/themeSlice';

export const Theme = () => {
    const theme = atminSelector((s) => s.theme.type);
    const dispatch = atminDispatch();

    const isLight = theme === 'light';

    const cardStyle: React.CSSProperties = {
        width: 250,
        height: 250,
        borderRadius: 16,
        textAlign: 'center',
        transition: 'all 0.4s ease',
        boxShadow: isLight
            ? '0 4px 20px rgba(0,0,0,0.15)'
            : '0 4px 20px rgba(255,255,255,0.2)',
        background: isLight
            ? 'linear-gradient(135deg, #ffffff, #f5f5f5)'
            : 'linear-gradient(135deg, #1a1a1a, #000000)',
        borderColor: isLight ? '#ddd' : '#444',
        color: isLight ? '#000' : '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 16,
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background 0.4s ease',
            }}
        >
            <Card
                style={{
                    ...cardStyle,
                    border: 'none', // tắt viền
                }}
                styles={{
                    body: { padding: 24 }, // chỉnh padding body
                }}
            >
                <h3 style={{ marginBottom: 12 }}>
                    {isLight ? '🌞 Light Mode' : '🌙 Dark Mode'}
                </h3>
                <Button
                    type={isLight ? 'primary' : 'default'}
                    block
                    onClick={() => dispatch(change())}
                    style={{
                        borderRadius: 8,
                        fontWeight: 'bold',
                        height: 40,
                    }}
                >
                    {isLight ? 'Switch to Dark 🌙' : 'Switch to Light 🌞'}
                </Button>
            </Card>
        </div>
    );
};
