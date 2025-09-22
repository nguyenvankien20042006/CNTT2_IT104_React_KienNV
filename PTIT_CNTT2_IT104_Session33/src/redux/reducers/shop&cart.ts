export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    quantity: number;
    sell: number;
}

const products: Product[] = [
    {
        id: 1,
        name: 'Pizza',
        price: 30,
        description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        image: 'https://picsum.photos/80/80?pizza',
        quantity: 10,
        sell: 0,
    },
    {
        id: 2,
        name: 'Hamburger',
        price: 15,
        description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        image: 'https://picsum.photos/80/80?burger',
        sell: 0,
        quantity: 10,
    },
    {
        id: 3,
        name: 'Bread',
        price: 20,
        description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        image: 'https://picsum.photos/80/80?bread',
        sell: 0,
        quantity: 10,
    },
    {
        id: 4,
        name: 'Cake',
        price: 10,
        description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        image: 'https://picsum.photos/80/80?cake',
        sell: 0,
        quantity: 10,
    },
];

export interface BuyItem {
    id: number;
    quantity: number;
}

type Action =
    | { type: 'addToCart'; payload: BuyItem }
    | { type: 'removeCart'; payload: number }
    | { type: 'updateCart'; payload: BuyItem };

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export const shoppingCartReducer = (
    state: Product[] = products,
    action: Action
) => {
    switch (action.type) {
        case 'addToCart':
            return state.map((p) =>
                p.id === action.payload.id
                    ? {
                          ...p,
                          sell: p.sell + action.payload.quantity,
                      }
                    : p
            );

        case 'removeCart':
            return state.map((p) =>
                p.id === action.payload ? { ...p, sell: 0 } : p
            );

        case 'updateCart':
            return state.map((p) =>
                p.id === action.payload.id
                    ? { ...p, sell: action.payload.quantity }
                    : p
            );

        default:
            return state;
    }
};
