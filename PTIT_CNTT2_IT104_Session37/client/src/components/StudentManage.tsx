import { useEffect, useState } from 'react';
import { Alert, Button, Typography } from 'antd';
import StudentFilters from './StudentFilters';
import StudentList from './StudentList';
import StudentForm from './StudentForm';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { getStudents } from '../apis/api';
import { PacmanLoader } from 'react-spinners';
import { resetStudentUpdate } from '../redux/reducers/studentSlice';

const { Title } = Typography;

export default function StudentManager() {
    const [open, setOpen] = useState(false);
    const dispatch = atminDispatch();
    const { list: students, status, error } = atminSelector((s) => s.student);

    useEffect(() => {
        dispatch(getStudents());
    }, [dispatch]);

    if (status === 'pending') {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}
            >
                <PacmanLoader
                    color="#27c043"
                    margin={0}
                    size={30}
                    speedMultiplier={2}
                />
            </div>
        );
    }

    if (status === 'failed') {
        return <Alert type="error" message="Error" description={error} />;
    }

    return (
        <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
            <Title level={2}>🎓 Student Manager</Title>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={() => {
                    setOpen(true);
                    dispatch(resetStudentUpdate());
                }}
            >
                ADD STUDENT
            </Button>
            <StudentForm open={open} onCancel={() => setOpen(false)} />
            <StudentFilters />
            <StudentList data={students} onOpen={() => setOpen(true)} />
        </div>
    );
}
