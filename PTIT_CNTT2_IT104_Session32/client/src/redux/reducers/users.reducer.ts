export interface User {
    id: number;
    name: string;
    gender: string;
    dob: string;
    address: string;
}

const data: User[] = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        gender: 'Nam',
        dob: '20/11/2023',
        address: 'Thanh Xuân, Hà Nội',
    },
    {
        id: 2,
        name: 'Nguyễn Thị B',
        gender: 'Nữ',
        dob: '20/11/2023',
        address: 'Cầu Giấy, Hà Nội',
    },
];

export const userReducer = (state: User[] = data) => {
    return state;
};
