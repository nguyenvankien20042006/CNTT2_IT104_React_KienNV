export type Todo = {
  id: number;
  title: string;
  priority: number;
  isCompleted: boolean;
};

const initTodos: Todo[] = [
  {
    id: 1,
    title: "Xây dựng thành Header",
    priority: 0,
    isCompleted: false,
  },
  {
    id: 2,
    title: "Xây dựng thành Menu",
    priority: 1,
    isCompleted: false,
  },
  {
    id: 3,
    title: "Fix lỗi đăng nhập",
    priority: 2,
    isCompleted: false,
  },
  {
    id: 4,
    title: "Đi chơi",
    priority: 3,
    isCompleted: false,
  },
  {
    id: 5,
    title: "Đọc sách",
    priority: 2,
    isCompleted: true,
  },
];
type TodoAction =
  | { type: "ADD_TASK"; payload: Todo }
  | {
      type: "FIX_TASK";
      payload: { title: string; priority: string; id: number };
    }
  | { type: "DELETE_TASK"; payload: number }
  | { type: "TOGGLE_TASK"; payload: number }
  | { type: "COMPLETE_ALL" }
  | { type: "SORT_TASKS" }
  | { type: "DELETE_ALL" };

const todoReducer = (state: Todo[] = initTodos, action: TodoAction) => {
  switch (action.type) {
    case "TOGGLE_TASK":
      return state.map((t) =>
        t.id === action.payload ? { ...t, isCompleted: !t.isCompleted } : t
      );
    case "DELETE_TASK":
      return state.filter((t) => t.id !== action.payload);
    case "ADD_TASK":
      return [...state, action.payload];
    case "FIX_TASK":
      if (action.payload.id === 1) {
        return state;
      }
      return state.map((t) =>
        t.id === action.payload.id
          ? {
              ...t,
              title: action.payload.title,
              priority: action.payload.priority,
            }
          : t
      );
    case "COMPLETE_ALL":
      return state.map((t) => ({ ...t, isCompleted: true }));
    case "SORT_TASKS":
      return state.sort((a, b) => a.priority - b.priority);
    case "DELETE_ALL":
      return [];
    default:
      return state;
  }
};
export default todoReducer;