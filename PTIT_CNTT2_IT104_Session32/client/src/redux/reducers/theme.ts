type ActionV6 = {
    type: 'light' | 'dark';
};

export const themeReducer = (
    state: 'light' | 'dark' = 'light',
    action: ActionV6
): 'light' | 'dark' => {
    switch (action.type) {
        case 'light':
            return 'light';
        case 'dark':
            return 'dark';
        default:
            return state;
    }
};
