type ActionV5 = {
    type: 'changeState';
};

export const changeStateReducer = (
    state: string = 'Rikkei Academy',
    action: ActionV5
) => {
    switch (action.type) {
        case 'changeState':
            return 'RikkeiSoft';
        default:
            return state;
    }
};
