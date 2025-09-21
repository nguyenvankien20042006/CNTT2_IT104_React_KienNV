import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/reducers/reducers';

export const Theme = () => {
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useDispatch();

    const handleChange = () => {
        if (theme === 'light') dispatch({ type: 'dark' });
        else dispatch({ type: 'light' });
    };

    return (
        <div
            style={{
                padding: 20,
                borderRadius: 10,
                boxShadow:
                    theme === 'light'
                        ? '0 2px 8px rgba(0,0,0,0.1)'
                        : '0 2px 8px rgba(255,255,255,0.1)',
                backgroundColor: theme === 'light' ? '#ffffff' : '#333333',
                color: theme === 'light' ? '#000' : '#fff',
                fontFamily: 'Arial, sans-serif',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                width: 300,
                height: 200,
                margin: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>
                Theme: {theme}
            </h4>
            <label
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                }}
            >
                <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={handleChange}
                    style={{
                        width: 16,
                        height: 16,
                        accentColor: theme === 'light' ? '#1890ff' : '#ffd700',
                        cursor: 'pointer',
                    }}
                />
                <span style={{ fontSize: '0.85rem' }}>Toggle</span>
            </label>
        </div>
    );
};
