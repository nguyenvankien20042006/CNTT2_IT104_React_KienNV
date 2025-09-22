import type { ColumnsType } from 'antd/es/table';
import { useAppSelector, useAppDispatch } from '../hooks/hookRedux';
import type { Product, BuyItem } from '../redux/reducers/shop&cart';
import {
    Button,
    Card,
    InputNumber,
    Table,
    Typography,
    Modal,
    message,
} from 'antd';
import { useState, useEffect } from 'react';

const { Text } = Typography;

export const YourCart = () => {
    const products = useAppSelector((state) => state.shop);
    const dispatch = useAppDispatch();

    // Lọc ra những sản phẩm có sell > 0
    const cart = products.filter((p) => p.sell > 0);

    // Quản lý số lượng local (local state) để input number tăng giảm
    const [manageBuy, setManageBuy] = useState<BuyItem[]>([]);

    // Khi cart thay đổi, cập nhật manageBuy
    useEffect(() => {
        setManageBuy((prev) => {
            // Nếu số lượng sản phẩm giống nhau và id giống nhau, giữ nguyên manageBuy
            if (
                prev.length === cart.length &&
                prev.every((item, idx) => item.id === cart[idx].id)
            ) {
                return prev;
            }
            // Nếu khác, cập nhật lại manageBuy từ cart
            return cart.map((p) => ({ id: p.id, quantity: p.sell }));
        });
    }, [cart]);

    const handleChangeOnCart = (id: number, value: number | null) => {
        if (value === null) return;
        setManageBuy((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity: value } : i))
        );
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                dispatch({ type: 'removeCart', payload: id });
                message.success('Xóa sản phẩm thành công!');
            },
        });
    };

    const handleUpdate = (id: number) => {
        const item = manageBuy.find((i) => i.id === id);
        if (!item) return;

        const product = products.find((p) => p.id === id);
        if (!product) return;

        if (item.quantity < 1) {
            message.warning('Số lượng phải lớn hơn 0');
            return;
        }

        if (item.quantity > product.quantity) {
            message.warning(`Chỉ còn ${product.quantity} sản phẩm trong kho`);
            return;
        }

        dispatch({
            type: 'updateCart',
            payload: { id, quantity: item.quantity },
        });
        message.success('Cập nhật số lượng thành công!');
    };

    const columns: ColumnsType<Product> = [
        { title: 'STT', render: (_, __, index) => index + 1 },
        { title: 'Name', dataIndex: 'name' },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (price) => `${price} USD`,
        },
        {
            title: 'Quantity',
            dataIndex: 'sell',
            render: (_, record) => {
                const value =
                    manageBuy.find((i) => i.id === record.id)?.quantity || 0;
                return (
                    <InputNumber
                        min={1}
                        max={record.quantity}
                        value={value}
                        style={{ width: 60 }}
                        onChange={(val) => handleChangeOnCart(record.id, val)}
                    />
                );
            },
        },
        {
            title: 'Action',
            render: (_, record) => {
                const value =
                    manageBuy.find((i) => i.id === record.id)?.quantity || 0;
                const product = products.find((p) => p.id === record.id);
                const maxAvailable = product?.quantity || 0;

                return (
                    <>
                        <Button
                            type="primary"
                            size="small"
                            disabled={value < 1 || value > maxAvailable}
                            onClick={() => handleUpdate(record.id)}
                        >
                            Update
                        </Button>{' '}
                        <Button
                            danger
                            size="small"
                            onClick={() => handleDelete(record.id)}
                        >
                            Delete
                        </Button>
                    </>
                );
            },
        },
    ];

    const total = cart.reduce((sum, item) => sum + item.price * item.sell, 0);

    return (
        <Card
            title="Your Cart"
            styles={{
                header: { background: '#1677ff', color: 'white' },
                body: { padding: 12 },
            }}
        >
            <Table
                rowKey="id"
                dataSource={cart}
                columns={columns}
                pagination={false}
            />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: '#fafafa',
                    borderRadius: 8,
                    marginTop: 12,
                }}
            >
                <div style={{ fontSize: 14, color: '#555' }}>
                    There are <strong>{cart.length}</strong> items in your cart
                </div>
                <Text strong style={{ color: '#d4380d', fontSize: 18 }}>
                    {total} USD
                </Text>
            </div>
        </Card>
    );
};
