import axios from 'axios';
import { useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    created_at: string;
}

export const Bai2 = () => {
    const getAllProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/product`);

            const products: Product[] = response.data || [];

            console.log('Products:', products);
        } catch (error) {
            console.error('Lỗi khi load dữ liệu:', error);
        }
    };

    useEffect(() => {
        getAllProduct();
    }, []);

    return <></>;
};
