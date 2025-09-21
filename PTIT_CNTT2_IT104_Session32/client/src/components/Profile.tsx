import { useAppSelector } from '../redux/reducers/reducers';

export const Profile = () => {
    const infor = useAppSelector((state) => state.profile);

    return (
        <div
            style={{
                maxWidth: '200px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                fontFamily: 'Arial, sans-serif',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <h2 style={{ textAlign: 'center', marginBottom: '15px' }}>
                Profile
            </h2>
            <div style={{ marginBottom: '8px' }}>Id: {infor.id}</div>
            <div style={{ marginBottom: '8px' }}>
                Fullname: {infor.fullname}
            </div>
            <div style={{ marginBottom: '8px' }}>Gender: {infor.gender}</div>
            <div style={{ marginBottom: '8px' }}>DOB: {infor.dob}</div>
            <div style={{ marginBottom: '8px' }}>Address: {infor.address}</div>
        </div>
    );
};
