import { Row, Col } from 'antd';
import BookCard from './BookCard';
import type { Book } from '../interfaces/book.interface';
interface Props {
    data: Book[];
    onOpen: () => void;
}
export default function BookList({ data, onOpen }: Props) {
    return (
        <Row gutter={[16, 16]}>
            {data.map((s) => (
                <Col key={s.id} span={12}>
                    <BookCard book={s} onOpen={onOpen} />
                </Col>
            ))}
        </Row>
    );
}
