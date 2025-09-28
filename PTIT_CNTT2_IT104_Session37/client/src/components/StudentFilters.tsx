import { Input, Select, Button, Space } from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { debounce } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { filterStudent } from '../apis/api';

const sortOptions = [
    { value: '', label: 'Mặc định' },
    { value: 'name-asc', label: 'Name A → Z' },
    { value: 'name-desc', label: 'Name Z → A' },
    { value: 'age-asc', label: 'Age ↑' },
    { value: 'age-desc', label: 'Age ↓' },
];

export interface StudentFiltersProps {
    keyword: string;
    grade: string | null;
    sort: 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc' | null;
}

export default function StudentFilters() {
    const students = atminSelector((s) => s.student.list);
    const [filters, setFilters] = useState<StudentFiltersProps>({
        keyword: '',
        grade: 'Tất cả',
        sort: null,
    });

    const gradeOptions: string[] = useMemo(() => {
        const tmp: string[] = [];
        students.forEach((s) => {
            if (!tmp.includes(s.grade)) tmp.push(s.grade);
        });
        tmp.push('Tất cả');
        return tmp;
    }, [students]);

    const dispatch = atminDispatch();

    // Debounce để tránh gọi API quá nhiều lần khi gõ keyword
    const debouncedFilter = useRef(
        debounce((filterValues: StudentFiltersProps) => {
            dispatch(filterStudent(filterValues));
        }, 300)
    ).current;

    // Cleanup debounce khi component unmount
    useEffect(() => {
        return () => {
            debouncedFilter.cancel();
        };
    }, [debouncedFilter]);

    const handleFilterChange = <K extends keyof StudentFiltersProps>(
        key: K,
        value: StudentFiltersProps[K]
    ) => {
        const newFilter = { ...filters, [key]: value };
        setFilters(newFilter);
        debouncedFilter(newFilter);
    };

    return (
        <Space
            wrap
            style={{
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
            }}
        >
            {/* Search box */}
            <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm theo tên..."
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                allowClear
                style={{ width: 240 }}
            />

            {/* Bộ lọc & sắp xếp */}
            <Space>
                <Select
                    value={filters.grade}
                    style={{ width: 140 }}
                    onChange={(value: string) => {
                        handleFilterChange('grade', value);
                    }}
                    options={gradeOptions.map((g) => ({ value: g, label: g }))}
                    suffixIcon={<FilterOutlined />}
                />
                <Select
                    value={filters.sort ?? ''}
                    style={{ width: 160 }}
                    onChange={(value: string) =>
                        handleFilterChange(
                            'sort',
                            value === ''
                                ? null
                                : (value as
                                      | 'name-asc'
                                      | 'name-desc'
                                      | 'age-asc'
                                      | 'age-desc')
                        )
                    }
                    options={sortOptions}
                    suffixIcon={<SortAscendingOutlined />}
                />
                <Button
                    onClick={() =>
                        setFilters({
                            keyword: '',
                            grade: 'Tất cả',
                            sort: null,
                        })
                    }
                    type="default"
                    style={{
                        color: '#1890ff',
                        borderColor: '#1890ff',
                        borderRadius: 6,
                        fontWeight: 500,
                    }}
                >
                    CLEAR
                </Button>
            </Space>
        </Space>
    );
}
