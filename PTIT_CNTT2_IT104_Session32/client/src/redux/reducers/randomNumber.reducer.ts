type ActionV4 = {
    type: 'Random';
    payload: number;
};
export const randomNumberReducer = (state: number[] = [], action: ActionV4) => {
    switch (action.type) {
        case 'Random':
            return [...state, action.payload];

        default:
            return state;
    }
};
