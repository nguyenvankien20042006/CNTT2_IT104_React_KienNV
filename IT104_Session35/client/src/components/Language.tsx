import { Select } from 'antd';
import { atminDispatch, atminSelector } from '../hooks/reduxHook';
import { changeLanguage } from '../slices/languageSlice';

const { Option } = Select;

export const Language = () => {
    const data = atminSelector((s) => s.language);
    const dispatch = atminDispatch();

    const handleChange = (value: 'vnese' | 'eng') => {
        dispatch(changeLanguage(value));
    };

    return (
        <div>
            <Select
                onChange={handleChange}
                placeholder="Choose language"
                style={{ width: 150 }}
            >
                <Option value="vnese">Tiếng Việt</Option>
                <Option value="eng">English</Option>
            </Select>
            <div style={{ marginTop: 10 }}>
                {data.language === 'vnese'
                    ? 'Học viện Rikkei'
                    : 'Rikkei Academy'}
            </div>
        </div>
    );
};
