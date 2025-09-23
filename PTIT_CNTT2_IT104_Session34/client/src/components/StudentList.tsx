import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import React from 'react';
import type { Student } from '../utils/types';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/reducers';
import { useDispatch } from 'react-redux';

interface StudentListProps {
  students: Student[];
}

const StudentList: React.FC<StudentListProps> = () => {
  const {list, editingStudent} = useSelector((state: RootState) => state.students)
  const dispatch = useDispatch()
  const handleDelete = (id: string) => dispatch({ type: "DELETE", payload: id })
  const handleEdit = (student: Student) => dispatch({type: "EDIT", payload: student})
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Mã sinh viên</TableCell>
            <TableCell>Tên sinh viên</TableCell>
            <TableCell>Tuổi</TableCell>
            <TableCell>Giới tính</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((s, i) => (
            <TableRow key={s.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{s.id}</TableCell>
              <TableCell>{s.fullName}</TableCell>
              <TableCell>{s.age}</TableCell>
              <TableCell>{s.gender}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="contained" color="error">Xem</Button>
                  <Button onClick={() => handleEdit(s)} variant="contained" color="warning">Sửa</Button>
                  <Button onClick={() => handleDelete(s.id)} variant="contained" color="success">Xóa</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentList;
