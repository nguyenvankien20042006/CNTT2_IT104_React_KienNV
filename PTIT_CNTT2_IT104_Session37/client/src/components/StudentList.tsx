import { Row, Col } from 'antd';
import StudentCard from './StudentCard';
import type { Student } from '../interfaces/student.interface';
interface Props {
    data: Student[];
    onOpen: () => void;
}
export default function StudentList({ data,onOpen }: Props) {
    return (
        <Row gutter={[16, 16]}>
            {data.map((s) => (
                <Col key={s.id} span={12}>
                    <StudentCard student={s} onOpen={onOpen} />
                </Col>
            ))}
        </Row>
    );
}
