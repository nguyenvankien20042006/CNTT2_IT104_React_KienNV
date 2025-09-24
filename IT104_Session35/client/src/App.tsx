import Counter from './components/Counter';
import { FavoriteUser } from './components/FavoriteUser';
import { Language } from './components/Language';
import { Login } from './components/Login';
import { Mode } from './components/Mode';
import { ModeMenu } from './components/ModeMenu';
import { Random } from './components/Random';
import { Theme } from './components/Theme';

function App() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Counter />
            <Random />
            <Theme />
            <Mode />
            <ModeMenu />
            <Language />
            <FavoriteUser />
            <Login />
        </div>
    );
}

export default App;
