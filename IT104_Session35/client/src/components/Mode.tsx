import { Button } from 'antd';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { changeMode } from '../slices/modeSlice';

export const Mode = () => {
    const data = atminSelector((s) => s.mode);
    const dispatch = atminDispatch();

    const modeStyle: React.CSSProperties = data.mode === 'list'
        ? {
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '200px',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '8px',
          }
        : {
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              width: '200px',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '8px',
          };

    // Hàm tạo gradient ngẫu nhiên
    const randomGradient = () => {
        const color1 = `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
        const color2 = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
        return `linear-gradient(135deg, ${color1}, ${color2})`;
    };

    return (
        <div>
            <div style={modeStyle}>
                {data.data.map((i) => (
                    <div
                        key={i}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            background: randomGradient(),
                        }}
                    >
                        {i}
                    </div>
                ))}
            </div>
            <Button
                style={{ marginTop: '20px' }}
                type="primary"
                onClick={() => dispatch(changeMode())}
            >
                Change mode
            </Button>
        </div>
    );
};
