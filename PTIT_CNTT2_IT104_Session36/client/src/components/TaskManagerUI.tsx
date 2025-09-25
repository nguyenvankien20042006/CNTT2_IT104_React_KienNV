import { Box, Typography, Divider } from '@mui/material';
import TaskFilters from './TaskFilters';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

export interface Task {
    id: number;
    title: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    completed: boolean;
}

export default function TaskManagerUI() {
    return (
        <Box
            sx={{
                maxWidth: 700,
                mx: 'auto',
                mt: 5,
                backgroundColor: '#F9FAFB', // nền chính nhẹ nhàng
                padding: 3,
                borderRadius: 3,
                boxShadow: 3,
            }}
        >
            <Typography
                variant="h4"
                align="center"
                fontWeight="bold"
                gutterBottom
                sx={{ color: '#1F2937' }}
            >
                📝 Task Manager
            </Typography>

            <TaskForm />

            <TaskFilters />

            <Divider sx={{ mb: 2, color: '#6B7280' }}>
                Danh sách công việc
            </Divider>

            <TaskList />
        </Box>
    );
}
