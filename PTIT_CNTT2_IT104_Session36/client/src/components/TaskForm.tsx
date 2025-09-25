import { useEffect, useState } from 'react';
import {
    Card,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import type { Task } from '../interfaces/task.interface';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { createTask, updateTask } from '../apis/api';
import { resetTask } from '../redux/taskSlice';

export default function TaskForm() {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('HIGH');
    const dispatch = atminDispatch();
    const task = atminSelector((state) => state.task.task);

    const handleAdd = () => {
        if (!title.trim()) return;

        let newTask: Task = {
            id: Math.floor(Math.random() * 100),
            title,
            priority,
            completed: false,
        };

        if (task) {
            newTask = { ...newTask, id: task.id, completed: task.completed };
            console.log(newTask);

            dispatch(updateTask(newTask));
            dispatch(resetTask());
        } else {
            dispatch(createTask(newTask));
        }

        setTitle('');
        setPriority('HIGH');
    };

    useEffect(() => {
        if (!task) return;
        setTitle(task.title);
        setPriority(task.priority);
    }, [task]);

    return (
        <Card sx={{ mb: 3, p: 2, borderRadius: 3, bgcolor: '#f9f9f9' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={7}>
                    <TextField
                        label={
                            title === ''
                                ? 'Công việc không được trống'
                                : 'Công việc mới'
                        }
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        size="small"
                        error={title === ''}
                        InputProps={{
                            sx: {
                                borderRadius: 2,
                                backgroundColor: '#fff',
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControl fullWidth size="small" variant="outlined">
                        <InputLabel>Ưu tiên</InputLabel>
                        <Select
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value as Task['priority'])
                            }
                            sx={{ borderRadius: 2, bgcolor: '#fff' }}
                            label="Ưu tiên"
                        >
                            {' '}
                            <MenuItem value="HIGH">Cao</MenuItem>{' '}
                            <MenuItem value="MEDIUM">Trung bình</MenuItem>{' '}
                            <MenuItem value="LOW">Thấp</MenuItem>{' '}
                        </Select>{' '}
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleAdd}
                        sx={{
                            borderRadius: 1.8,
                        }}
                    >
                        {task ? 'Update' : 'Thêm'}
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
}
