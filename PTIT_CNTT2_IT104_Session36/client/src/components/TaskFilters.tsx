import {
    Card,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { atminDispatch } from '../hooks/reduxHook';
import { searchTasks } from '../apis/api';
import { debounce } from 'lodash';

// Định nghĩa kiểu cho các filter
export interface TaskFiltersProps {
    keyword: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | null;
    completed: boolean | null;
}

export default function TaskFilters() {
    // State lưu toàn bộ filter: keyword, priority, completed
    const [filter, setFilter] = useState<TaskFiltersProps>({
        keyword: '',
        priority: null,
        completed: null,
    });

    const dispatch = atminDispatch();

    // Debounce để tránh gọi API quá nhiều lần khi gõ keyword
    const debouncedSearch = useRef(
        debounce((filterValues: TaskFiltersProps) => {
            dispatch(searchTasks(filterValues));
        }, 300)
    ).current;

    // Cleanup debounce khi component unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    // Hàm thay đổi filter và gọi debounce API
    const handleFilterChange = <K extends keyof TaskFiltersProps>(
        key: K,
        value: TaskFiltersProps[K]
    ) => {
        const newFilter = { ...filter, [key]: value };
        setFilter(newFilter);
        debouncedSearch(newFilter);
    };

    return (
        <Card sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: 2 }}>
            <Grid container spacing={2}>
                {/* Select Trạng thái */}
                <Grid item xs={4}>
                    <FormControl fullWidth size="small" variant="outlined">
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            // Controlled component: value dựa vào filter.completed
                            value={
                                filter.completed === null
                                    ? 'all'
                                    : filter.completed
                                    ? 'completed'
                                    : 'pending'
                            }
                            label="Trạng thái"
                            sx={{ borderRadius: 2, bgcolor: '#fff' }}
                            onChange={(e) => {
                                const value = e.target.value;
                                let completed: boolean | null = null;
                                if (value === 'completed') completed = true;
                                else if (value === 'pending') completed = false;
                                handleFilterChange('completed', completed);
                            }}
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="completed">Hoàn thành</MenuItem>
                            <MenuItem value="pending">Chưa xong</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Select Ưu tiên */}
                <Grid item xs={4}>
                    <FormControl fullWidth size="small" variant="outlined">
                        <InputLabel>Ưu tiên</InputLabel>
                        <Select
                            // Controlled component: value dựa vào filter.priority
                            value={filter.priority ?? 'all'}
                            label="Ưu tiên"
                            sx={{ borderRadius: 2, bgcolor: '#fff' }}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleFilterChange(
                                    'priority',
                                    value === 'all'
                                        ? null
                                        : (value as 'LOW' | 'MEDIUM' | 'HIGH')
                                );
                            }}
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="HIGH">Cao</MenuItem>
                            <MenuItem value="MEDIUM">Trung bình</MenuItem>
                            <MenuItem value="LOW">Thấp</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Input tìm kiếm keyword */}
                <Grid item xs={4}>
                    <TextField
                        label="🔍 Tìm kiếm"
                        fullWidth
                        size="small"
                        variant="outlined"
                        // Controlled input dựa vào filter.keyword
                        value={filter.keyword}
                        onChange={(e) =>
                            handleFilterChange('keyword', e.target.value)
                        }
                        InputProps={{
                            sx: {
                                borderRadius: 2,
                                backgroundColor: '#fff',
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </Card>
    );
}
