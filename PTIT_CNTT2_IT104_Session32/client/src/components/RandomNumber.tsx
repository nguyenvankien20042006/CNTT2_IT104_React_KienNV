import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/reducers/reducers';
import { Button } from 'antd';

export const RandomNumber = () => {
    const listNumber = useAppSelector((state) => state.randomNumber);
    const dispatch = useDispatch();
    const handleRandom = () => {
        dispatch({ type: 'Random', payload: Math.floor(Math.random() * 100) });
    };
    return (
        <div style={{padding:20}}>
            <div>{JSON.stringify(listNumber)}</div><br />
            <Button type="primary" onClick={handleRandom}>
                Random
            </Button>
        </div>
    );
};
