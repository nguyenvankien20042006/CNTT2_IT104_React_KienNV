import { Row, Col } from 'antd';
import { ListProduct } from './shopping-cart/ListProduct';
import { YourCart } from './shopping-cart/YourCart';

export default function App() {
    return (
        <Row gutter={16}>
            <Col span={12}>
                <ListProduct />
            </Col>
            <Col span={12}>
                <YourCart />
            </Col>
        </Row>
    );
}
