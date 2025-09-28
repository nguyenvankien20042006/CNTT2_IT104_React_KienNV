export interface Student {
    id: number;
    name: string;
    age: number;
    grade: string;
}

export interface initialStateType {
    list: Student[];
    status: 'idle' | 'pending' | 'success' | 'failed';
    error: null | undefined | string;
    studentUpdate: Student | null;
}

export interface HelpFilterProps {
    data: Student[];
    sort: 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc' | null;
}
