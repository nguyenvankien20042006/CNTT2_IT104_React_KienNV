import {
    Card,
    Button,
    InputNumber,
    List,
    Avatar,
    Typography,
    message,
} from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks/hookRedux';
import { useState } from 'react';
import type { BuyItem, Product } from '../redux/reducers/shop&cart';

const { Text } = Typography;

export const ListProduct = () => {
    const products: Product[] = useAppSelector((state) => state.shop);
    const dispatch = useAppDispatch();
    // quản lý số lượng người dùng nhập
    const [manageBuy, setManageBuy] = useState<BuyItem[]>(
        products.map((t) => ({ id: t.id, quantity: 0 }))
    );

    const handleChangeOnShop = (id: number, value: number | null) => {
        if (value === null) return;
        setManageBuy((prev) =>
            prev.map((t) => (t.id === id ? { ...t, quantity: value } : t))
        );
    };

    const handleOnShop = (id: number) => {
        const data = manageBuy.find((tmp) => tmp.id === id);
        if (!data) return;

        if (data.quantity <= 0) {
            message.warning('Vui lòng nhập số lượng trước khi thêm vào giỏ!');
            return;
        }

        setManageBuy((pre) =>
            pre.map((i) => (i.id === id ? { ...i, quantity: 0 } : i))
        );

        dispatch({ type: 'addToCart', payload: data });
    };

    return (
        <Card
            title="List Products"
            styles={{
                header: { background: '#1677ff', color: 'white' },
                body: { padding: 12 },
            }}
        >
            <List
                itemLayout="horizontal"
                dataSource={products}
                renderItem={(item, idx) => {
                    if (!item) return null;
                    return (
                        <List.Item
                            actions={[
                                <Button type="primary" key={`price-${item.id}`}>
                                    {item.price} USD
                                </Button>,
                                <InputNumber
                                    min={0}
                                    max={item.quantity - item.sell}
                                    value={manageBuy[idx]?.quantity}
                                    style={{ width: 60 }}
                                    key={`qty-${item.id}`}
                                    onChange={(value) =>
                                        handleChangeOnShop(item.id, value)
                                    }
                                    parser={(value) => {
                                        const num = Number(value);
                                        if (isNaN(num)) return 0;

                                        if (num < 0) {
                                            message.destroy();
                                            message.warning(
                                                'Số lượng không được nhỏ hơn 0'
                                            );
                                            return 0;
                                        }

                                        if (num > item.quantity - item.sell) {
                                            message.destroy();
                                            message.warning(
                                                `Chỉ còn ${
                                                    item.quantity - item.sell
                                                } sản phẩm trong kho`
                                            );
                                            return item.quantity;
                                        }

                                        return num;
                                    }}
                                />,
                                <Button
                                    type="primary"
                                    key={`add-${item.id}`}
                                    onClick={() => handleOnShop(item.id)}
                                    disabled={item.quantity - item.sell <= 0} // hết hàng thì disable
                                    style={{
                                        backgroundColor:
                                            item.quantity - item.sell <= 0
                                                ? '#ccc'
                                                : '#1677ff',
                                        borderColor:
                                            item.quantity - item.sell <= 0
                                                ? '#ccc'
                                                : '#1677ff',
                                        color:
                                            item.quantity - item.sell <= 0
                                                ? '#666'
                                                : 'white',
                                        fontWeight: 600,
                                        borderRadius: 8,
                                    }}
                                >
                                    {item.quantity - item.sell <= 0
                                        ? 'Out of Stock'
                                        : 'Add'}
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={item.image}
                                        shape="square"
                                        size={64}
                                    />
                                }
                                title={<strong>{item.name}</strong>}
                                description={
                                    <Text type="secondary">
                                        {item.description}
                                    </Text>
                                }
                            />
                        </List.Item>
                    );
                }}
            />
        </Card>
    );
};
