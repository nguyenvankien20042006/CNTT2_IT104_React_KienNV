import { Input, Select, Button, Space } from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { debounce } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { filterBook } from '../apis/api';

const sortOptions = [
    { value: '', label: 'Mặc định' },
    { value: 'title-asc', label: 'Title A → Z' },
    { value: 'title-desc', label: 'Title Z → A' },
    { value: 'year-asc', label: 'Year ↑' },
    { value: 'year-desc', label: 'Year ↓' },
];

export interface BookFiltersProps {
    keyword: string;
    category: string | null;
    sort: 'title-asc' | 'title-desc' | 'year-asc' | 'year-desc' | null;
}

export default function BookFilters() {
    const books = atminSelector((s) => s.book.list);
    const [filters, setFilters] = useState<BookFiltersProps>({
        keyword: '',
        category: 'All',
        sort: null,
    });

    const categoryOptions: string[] = useMemo(() => {
        const tmp: string[] = [];
        books.forEach((b) => {
            if (!tmp.includes(b.category)) tmp.push(b.category);
        });
        tmp.push('All');
        return tmp;
    }, [books]);

    const dispatch = atminDispatch();

    // Debounce để tránh gọi API quá nhiều lần khi gõ keyword
    const debouncedFilter = useRef(
        debounce((filterValues: BookFiltersProps) => {
            dispatch(filterBook(filterValues));
        }, 300)
    ).current;

    // Cleanup debounce khi component unmount
    useEffect(() => {
        return () => {
            debouncedFilter.cancel();
        };
    }, [debouncedFilter]);

    const handleFilterChange = <K extends keyof BookFiltersProps>(
        key: K,
        value: BookFiltersProps[K]
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
                placeholder="Tìm theo tiêu đề..."
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                allowClear
                style={{ width: 240 }}
            />

            {/* Bộ lọc & sắp xếp */}
            <Space>
                <Select
                    value={filters.category}
                    style={{ width: 160 }}
                    onChange={(value: string) => {
                        handleFilterChange('category', value);
                    }}
                    options={categoryOptions.map((c) => ({ value: c, label: c }))}
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
                                      | 'title-asc'
                                      | 'title-desc'
                                      | 'year-asc'
                                      | 'year-desc')
                        )
                    }
                    options={sortOptions}
                    suffixIcon={<SortAscendingOutlined />}
                />
                <Button
                    onClick={() =>
                        setFilters({
                            keyword: '',
                            category: 'All',
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
