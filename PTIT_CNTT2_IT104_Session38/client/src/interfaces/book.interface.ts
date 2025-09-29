export interface Book {
    id: number;
    title:string,
    author:string,
    year:number,
    category:string
}

export interface initialStateType {
    list: Book[];
    status: 'idle' | 'pending' | 'success' | 'failed';
    error: null | undefined | string;
    bookUpdate: Book | null;
}

export interface HelpFilterProps {
    data: Book[];
    sort: 'title-asc' | 'title-desc' | 'year-asc' | 'year-desc' | null;
}
