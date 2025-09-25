import {
    Card,
    Box,
    Checkbox,
    Typography,
    Chip,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { Task } from './TaskManagerUI';
import { useState } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { atminDispatch } from '../hooks/reduxHook';
import { deleteTask } from '../apis/api';
import { getTaskDetail } from '../redux/taskSlice';

interface Props {
    task: Task;
}

export default function TaskItem({ task }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const dispatch = atminDispatch();
    const handleDelete = () => {
        dispatch(deleteTask(task.id));
        setOpen(false);
    };
    return (
        <Card
            sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: 1,
                '&:hover': { boxShadow: 3 },
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            {/* Left: Checkbox + Title */}
            <Box display="flex" alignItems="center" gap={1}>
                <Checkbox checked={task.completed} color="primary" />
                <Typography
                    sx={{
                        textDecoration: task.completed
                            ? 'line-through'
                            : 'none',
                        color: task.completed ? 'gray' : 'inherit',
                        fontWeight: 500,
                        flexGrow: 1,
                    }}
                >
                    {task.title}
                </Typography>
                <Chip
                    size="small"
                    label={task.priority}
                    color={
                        task.priority === 'HIGH'
                            ? 'error'
                            : task.priority === 'MEDIUM'
                            ? 'warning'
                            : 'success'
                    }
                    sx={{ fontWeight: 'bold' }}
                />
            </Box>

            {/* Right: Priority + Actions */}
            <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => setOpen(true)}
                >
                    <DeleteIcon />
                </IconButton>
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => dispatch(getTaskDetail(task))}
                >
                    <EditIcon />
                </IconButton>
            </Box>
            <ConfirmDeleteModal
                title={task.title}
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleDelete}
            />
        </Card>
    );
}
