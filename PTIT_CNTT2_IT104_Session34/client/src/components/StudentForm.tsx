import { Button, MenuItem, Select, TextField, type SelectChangeEvent} from '@mui/material';

import React from 'react';
import type { Student } from '../utils/types';

interface StudentFormProps {
  onSubmit: (student: Student) => void;
  initialData?: Student | null
  students?: Student[]
}

type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type FormChangeEvent = InputChangeEvent | SelectChangeEvent;

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, initialData }) => {
  const [form, setForm] = React.useState<Student>(initialData || {id: '', fullName: '', age: 0, gender: "Nam", dateOfBirth: '', placeOfBirth: '', address: ''});
  const [error, setError] = React.useState<Record<string, string>>({})
   const students: Student[] = JSON.parse(localStorage.getItem("students") || "[]");

  React.useEffect(() => {
    if(initialData) setForm(initialData)
  }, [initialData])

  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const validate = () => {
    const temp: Record<string, string> = {}
    if(!form.id) temp.id = "Mã sinh viên không được để trống"
    else if(students.some(student => student.id === form.id && student.id !== initialData?.id)) temp.id = "Mã sinh viên đã tồn tại"

    if(!form.fullName) temp.fullName = "Tên sinh viên không được để trống"
    else if(students.some(student => student.fullName === form.fullName && student.fullName !== initialData?.fullName)) temp.fullName = "Tên sinh viên đã tồn tại"

    if(form.age === null || form.age === undefined || form.age === 0) temp.age = "Tuổi không được để trống"
    else if(form.age < 0) temp.age = "Tuổi không hợp lệ"

    if(!form.dateOfBirth) temp.dateOfBirth = "Ngày sinh không được để trống"
    else if(new Date(form.dateOfBirth) > new Date()) temp.dateOfBirth = "Ngày sinh không hợp lệ"

    if(!form.placeOfBirth) temp.placeOfBirth = "Nơi sinh không được để trống"

    if(!form.address) temp.address = "Địa chỉ không được để trống"

    setError(temp)
    return Object.keys(temp).length === 0
  }
  const handleLocalSubmit = () => {
    if(validate()) {
      onSubmit(form);
      setForm({id: '', fullName: '', age: 0, gender: "Nam", dateOfBirth: '', placeOfBirth: '', address: ''});
      setError({})
    }
  };

  return (
    <div className="w-1/3 p-4 border border-gray-400 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Thông Tin Sinh Viên</h2>
      <div className="flex flex-col gap-4">
        <TextField label="Mã sinh viên" name="id" value={form.id} onChange={handleChange} fullWidth error={!!error.id} helperText={error.id}/>
        <TextField label="Tên sinh viên" name="fullName" value={form.fullName} onChange={handleChange} fullWidth error={!!error.fullName} helperText={error.fullName}/>
        <TextField label="Tuổi" name="age" type="number" value={form.age} onChange={handleChange} fullWidth error={!!error.age} helperText={error.age}/>
        <Select name="gender" value={form.gender} onChange={handleChange} fullWidth>
          <MenuItem value="Nam">Nam</MenuItem>
          <MenuItem value="Nữ">Nữ</MenuItem>
        </Select>
        <TextField type="date" label="Ngày sinh" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!error.dateOfBirth} helperText={error.dateOfBirth}/>
        <TextField label="Nơi sinh" name="placeOfBirth" value={form.placeOfBirth} onChange={handleChange} fullWidth error={!!error.placeOfBirth} helperText={error.placeOfBirth}/>
        <TextField label="Địa chỉ" name="address" value={form.address} onChange={handleChange} fullWidth error={!!error.address} helperText={error.address}/>
        <Button variant="contained" color="primary" onClick={handleLocalSubmit}> Submit </Button>
      </div>
    </div>
  );
};

export default StudentForm;
