export interface Account {
    email: string;
    password: string;
}

export interface Accounts {
    accs: Account[];
    currentAcc?: Account;
}

interface ActionV7 {
    type: 'register' | 'login';
    payload: Account;
}

export const authReducer = (
    state: Accounts = { accs: [], currentAcc: undefined },
    action: ActionV7
): Accounts => {
    switch (action.type) {
        case 'register': {
            const tmp = {
                ...state,
                accs: [...state.accs, action.payload], // ✅ thêm account vào mảng
            };
            console.log(tmp);
            
            return tmp;
        }
        case 'login': {
            const tmp = {
                ...state,
                currentAcc: action.payload, // ✅ set account hiện tại
            };
            console.log(tmp);
            return tmp;
        }
        default:
            return state;
    }
};
