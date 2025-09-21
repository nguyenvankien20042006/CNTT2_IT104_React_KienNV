import { Table, Button, Space } from 'antd';
import { useAppSelector } from '../redux/reducers/reducers';
import type { User } from '../redux/reducers/users.reducer';

export const UserTable = () => {
    const users = useAppSelector((state) => state.users);
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Chức năng',
            key: 'action',
            render: (_: unknown, record: User) => (
                <Space size="middle">
                    <Button
                        type="default"
                        onClick={() => console.log('Edit', record.id)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="default"
                        danger
                        onClick={() => console.log('Delete', record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return <Table columns={columns} dataSource={users} rowKey="id" bordered style={{width:700}}/>;
};
