import './App.css';
import { ChangeState } from './components/ChangeState';
import { Counter } from './components/Counter';
import { Profile } from './components/Profile';
import { RandomNumber } from './components/RandomNumber';
import { Register } from './components/Register';
import { Theme } from './components/Theme';
import { TodoList } from './components/ToDoList';
import { UserTable } from './components/UserTable';

function App() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
            }}
        >
            <Profile />
            <UserTable />
            <Counter />
            <RandomNumber />
            <ChangeState />
            <Theme />
            <Register />
            <TodoList />
        </div>
    );
}

export default App;
