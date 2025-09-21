import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { useAppSelector } from '../redux/reducers/reducers';
import {
    Button,
    Input,
    Modal,
    Radio,
    Select,
    Tag,
    Space,
    Typography,
    Flex,
} from 'antd';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title,Text } = Typography;

// Kiểu dữ liệu Todo
export type Todo = {
    id: number;
    title: string;
    priority: number;
    isCompleted: boolean;
};

export const TodoList = () => {
    const dispatch = useDispatch();
    const todos = useAppSelector((state) => state.todos as Todo[]);
    const completed = todos.filter((t) => t.isCompleted).length;

    // Modal state
    const [isOpen, setOpen] = useState(false);
    const [modalFunction, setModalFunction] = useState<'Add' | 'Fix' | ''>('');

    // Task state
    const [task, setTask] = useState<Todo>({
        id: Math.ceil(Math.random() * 1000),
        title: '',
        priority: -1,
        isCompleted: false,
    });
    const [fixTask, setFixTask] = useState<Todo>({
        id: -1,
        title: '',
        priority: -1,
        isCompleted: false,
    });

    // Priority tag
    const renderPriorityTag = (priority: number) => {
        switch (priority) {
            case 0:
                return <Tag color="red">Khẩn cấp</Tag>;
            case 1:
                return <Tag color="orange">Quan trọng</Tag>;
            case 2:
                return <Tag color="blue">Bình thường</Tag>;
            case 3:
                return <Tag color="green">Không quan trọng</Tag>;
            default:
                return null;
        }
    };

    // Delete task
    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa nhiệm vụ này?',
            showDenyButton: true,
            confirmButtonText: 'Xác nhận',
            denyButtonText: `Hủy`,
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch({ type: 'DELETE_TASK', payload: id });
                Swal.fire('Xóa thành công!', '', 'success');
            }
        });
    };

    // Open modal
    const handleModalFunction = (
        type: 'Add' | 'Fix',
        title?: string,
        priority?: number,
        id?: number,
        isCompleted?: boolean
    ) => {
        if (type === 'Fix' && id !== undefined) {
            setFixTask({
                id,
                title: title ?? '',
                priority: priority ?? -1,
                isCompleted: isCompleted ?? false,
            });
        }
        setModalFunction(type);
        setOpen(true);
    };

    // Submit modal
    const handleSubmit = () => {
        if (modalFunction === 'Add') {
            const isDuplicate = todos.some(
                (t) =>
                    t.title.trim().toLowerCase() ===
                    task.title.trim().toLowerCase()
            );
            if (!task.title.trim() || task.priority === -1 || isDuplicate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Dữ liệu không được để trống hoặc trùng!',
                });
                return;
            }
            dispatch({ type: 'ADD_TASK', payload: task });
            Swal.fire({ icon: 'success', title: 'Thêm thành công' });
        } else if (modalFunction === 'Fix') {
            const isDuplicate = todos.some(
                (t) =>
                    t.title.trim().toLowerCase() ===
                        fixTask.title.trim().toLowerCase() &&
                    t.id !== fixTask.id
            );
            if (
                !fixTask.title.trim() ||
                fixTask.priority === -1 ||
                isDuplicate
            ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Dữ liệu không được để trống hoặc trùng!',
                });
                return;
            }
            dispatch({ type: 'FIX_TASK', payload: fixTask });
            Swal.fire({ icon: 'success', title: 'Sửa thành công' });
        }
        setOpen(false);
    };

    // Filter + sort
    const getFilteredSortedTodos = (todos: Todo[], filter: number | 'all') => {
        return [...todos]
            .filter((t) => (filter === 'all' ? true : t.priority === filter))
            .sort((a, b) => a.priority - b.priority);
    };
    const [filter, setFilter] = useState<number | 'all'>('all');

    const filterPriority = (priority: string | number) => {
        setFilter(priority === 'all' ? 'all' : Number(priority));
    };

    // Delete all
    const deleteAll = () => {
        if (completed !== todos.length) {
            Swal.fire({
                icon: 'warning',
                title: 'Chưa hoàn thành tất cả công việc!',
            });
        } else {
            dispatch({ type: 'DELETE_ALL' });
            Swal.fire('Đã xóa tất cả!', '', 'success');
        }
    };

    // Reset form
    useEffect(() => {
        setTask({
            id: Math.ceil(Math.random() * 1000),
            title: '',
            priority: -1,
            isCompleted: false,
        });
        setFixTask({ id: -1, title: '', priority: -1, isCompleted: false });
    }, [todos]);

    const filteredTodos = getFilteredSortedTodos(todos, filter);

    return (
        <div style={{ width: 500, margin: '0 auto' }}>
            <Title level={3}>Danh sách công việc</Title>

            {/* Header */}
            <Space style={{ marginBottom: 16 }}>
                <Select
                    style={{ width: 200 }}
                    defaultValue="all"
                    onChange={filterPriority}
                >
                    <Option value="all">Tất cả</Option>
                    <Option value="0">Khẩn cấp</Option>
                    <Option value="1">Quan trọng</Option>
                    <Option value="2">Bình thường</Option>
                    <Option value="3">Không quan trọng</Option>
                </Select>
                <Button
                    type="primary"
                    onClick={() => handleModalFunction('Add')}
                >
                    Thêm
                </Button>
            </Space>

            {/* List */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {filteredTodos.map((t) => (
                    <li
                        key={t.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            borderBottom: '1px solid #eee',
                        }}
                    >
                        <span
                            style={{
                                textDecoration: t.isCompleted
                                    ? 'line-through'
                                    : 'none',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={t.isCompleted}
                                onChange={() =>
                                    dispatch({
                                        type: 'TOGGLE_TASK',
                                        payload: t.id,
                                    })
                                }
                                style={{ marginRight: 8 }}
                            />
                            {t.title}
                        </span>
                        {renderPriorityTag(t.priority)}
                        <Space>
                            <Button
                                onClick={() =>
                                    handleModalFunction(
                                        'Fix',
                                        t.title,
                                        t.priority,
                                        t.id,
                                        t.isCompleted
                                    )
                                }
                            >
                                Sửa
                            </Button>
                            <Button danger onClick={() => handleDelete(t.id)}>
                                Xóa
                            </Button>
                        </Space>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div style={{ marginTop: 16 }}>
                <Flex justify="space-between" align="center">
                    <Text
                        strong
                        type={
                            completed === todos.length ? 'success' : undefined
                        }
                    >
                        {completed === todos.length
                            ? '✅ Hoàn thành tất cả'
                            : `Số công việc hoàn thành: ${completed}`}
                    </Text>

                    <Space>
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={() => dispatch({ type: 'COMPLETE_ALL' })}
                        >
                            Hoàn thành tất cả
                        </Button>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={deleteAll}
                        >
                            Xóa tất cả
                        </Button>
                    </Space>
                </Flex>
            </div>

            {/* Modal */}
            <Modal
                open={isOpen}
                onCancel={() => setOpen(false)}
                onOk={handleSubmit}
                title={
                    modalFunction === 'Add'
                        ? 'Thêm mới công việc'
                        : 'Sửa công việc'
                }
                okText={modalFunction === 'Add' ? 'Thêm mới' : 'Sửa'}
            >
                <Input
                    name="title"
                    placeholder="Nhập tên công việc"
                    value={modalFunction === 'Add' ? task.title : fixTask.title}
                    onChange={(e) =>
                        modalFunction === 'Add'
                            ? setTask((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                              }))
                            : setFixTask((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                              }))
                    }
                    style={{ marginBottom: 12 }}
                />

                <Radio.Group
                    onChange={(e) =>
                        modalFunction === 'Add'
                            ? setTask((prev) => ({
                                  ...prev,
                                  priority: Number(e.target.value),
                              }))
                            : setFixTask((prev) => ({
                                  ...prev,
                                  priority: Number(e.target.value),
                              }))
                    }
                    value={
                        modalFunction === 'Add'
                            ? task.priority
                            : fixTask.priority
                    }
                >
                    <Radio value={0}>Khẩn cấp</Radio>
                    <Radio value={1}>Quan trọng</Radio>
                    <Radio value={2}>Bình thường</Radio>
                    <Radio value={3}>Không quan trọng</Radio>
                </Radio.Group>
            </Modal>
        </div>
    );
};
