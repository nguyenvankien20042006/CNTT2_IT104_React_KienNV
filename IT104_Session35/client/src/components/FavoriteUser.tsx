import { Card } from 'antd';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { HeartOutlined } from '@ant-design/icons';
import { like } from '../slices/listFavoriteUser';

export const FavoriteUser = () => {
    const data = atminSelector((s) => s.favoriteUser);
    const dispatch = atminDispatch();
    return (
        <div>
            <Card
                title="List User Favorite"
                styles={{
                    header: {
                        backgroundColor: '#1677ff',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                    body: {
                        padding: '20px',
                    },
                }}
                style={{ width: 350, marginTop: 20 }}
            >
                {data.map((u) => (
                    <div key={u.id}>
                        <div>UserName: {u.username}</div>
                        <div>
                            Favorite:{' '}
                            <HeartOutlined
                                style={{ color: u.like ? 'red' : 'black' }}
                                onClick={() => dispatch(like(u.id))}
                            />
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    );
};
