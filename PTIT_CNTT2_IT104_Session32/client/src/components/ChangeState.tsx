import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/reducers/reducers';
import { Button } from 'antd';

export const ChangeState = () => {
    const state = useAppSelector((state) => state.changeState);
    const dispatch = useDispatch();
    const handleChange = () => {
        dispatch({ type: 'changeState' });
    };
    return (
        <div>
            <div>{state}</div>
            <div>
                <Button type="primary" onClick={handleChange}>
                    Change State
                </Button>
            </div>
        </div>
    );
};
