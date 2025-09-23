import { CircularProgress } from '@mui/material';

function LoadingProcess() {
  return (
    <div className="fixed bg-black opacity-70 inset-0 flex justify-center items-center">
      <CircularProgress size={70} />
    </div>
  );
}

export default LoadingProcess;
