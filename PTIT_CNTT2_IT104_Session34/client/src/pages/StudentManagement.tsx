import type { Student } from '../utils/types';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';
import Toolbar from '../components/Toolbar';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/reducers';

const StudentManagement = () => {
  const { list, editingStudent} = useSelector((state: RootState) => state.students)
  const dispatch = useDispatch()

  const handleSubmit = (student: Student) => {
    if(editingStudent) dispatch({type: "UPDATE", payload: student})
    else dispatch({type: "ADD", payload: student})
  }


  const handleSearch = (keyword: string) => dispatch({type: "SEARCH", payload: keyword})

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1">
        <Toolbar onSearch={handleSearch} />
        <StudentList students={list} />
      </div>
      <StudentForm onSubmit={handleSubmit} initialData={editingStudent}/>
    </div>
  );
};

export default StudentManagement;
