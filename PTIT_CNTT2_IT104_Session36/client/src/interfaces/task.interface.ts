export interface Task {
    id: number;
    title: string;
    completed: boolean;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
export interface InitialStateType {
  status: "idle" | "pending" | "success" | "failed";
  data: Task[];
  error: null | undefined | string;
  task: Task | null;
}