import { Button } from 'antd';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { changeModeMenu } from '../slices/menuSlice';
import {
    DashboardOutlined,
    UserOutlined,
    DollarOutlined,
    LineChartOutlined,
    FileOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

export const ModeMenu = () => {
    const data = atminSelector((s) => s.modeMenu);
    const dispatch = atminDispatch();

    const menuItems = [
        { icon: <DashboardOutlined />, label: 'Bảng điều khiển' },
        { icon: <UserOutlined />, label: 'Tài khoản' },
        { icon: <DollarOutlined />, label: 'Tài sản' },
        { icon: <LineChartOutlined />, label: 'Thống kê' },
        { icon: <FileOutlined />, label: 'Tài liệu' },
        { icon: <MenuFoldOutlined />, label: 'Thu gọn' },
    ];

    const menuStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: '#0a1b3d',
        padding: '10px',
        borderRadius: '8px',
        width: data.mode === 'full' ? '150px' : '30px',
        transition: 'width 0.3s',
        color: '#fff',
    };

    return (
        <div>
            <div style={menuStyle}>
                {menuItems.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: data.mode === 'full' ? '10px' : '0px',
                            padding: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        {item.icon}
                        {data.mode === 'full' && <span>{item.label}</span>}
                    </div>
                ))}
            </div>
            <Button
                style={{ marginTop: '10px' }}
                type="primary"
                onClick={() => dispatch(changeModeMenu())}
            >
                Change mode
            </Button>
        </div>
    );
};
