import { useEffect, useState } from 'react';
import { Alert, Button, Typography } from 'antd';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { PacmanLoader } from 'react-spinners';

import BookForm from './BookForm';
import BookList from './BookList';
import { getBooks } from '../apis/api';
import { resetBookUpdate } from '../redux/reducers/bookSlice';
import BookFilters from './BookFilters';
import { ReadOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function BookManager() {
    const [open, setOpen] = useState(false);
    const dispatch = atminDispatch();
    const { list: books, status, error } = atminSelector((s) => s.book);

    useEffect(() => {
        dispatch(getBooks());
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
            <Title level={2}>
                <ReadOutlined style={{ color: '#1677ff', fontSize: 28 }} /> Book
                Library Manager
            </Title>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={() => {
                    setOpen(true);
                    dispatch(resetBookUpdate());
                }}
            >
                ADD BOOK
            </Button>
            <BookForm open={open} onCancel={() => setOpen(false)} />
            <BookFilters />
            <BookList data={books} onOpen={() => setOpen(true)} />
        </div>
    );
}
