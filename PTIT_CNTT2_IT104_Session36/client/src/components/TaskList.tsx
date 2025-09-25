import { useEffect } from 'react';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import TaskItem from './TaskItem';
import { getAllTask } from '../apis/api';

export default function TaskList() {
    const tasks = atminSelector((state) => state.task.data);
    const dispatch = atminDispatch();
    useEffect(() => {
        dispatch(getAllTask());
    }, [dispatch]);
    return (
        <>
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </>
    );
}
