export interface Student {
  id: string;
  fullName: string;
  age: number;
  gender: "Nam" | "Nữ";
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
}

export type typeAction = 
| {type: "ADD"; payload: Student}
| {type: "DELETE"; payload: string}
| {type: "EDIT"; payload: Student}
| {type: "UPDATE", payload: Student}
| {type: "SEARCH", payload: string}

export interface StudentState {
  all: Student[]
  list: Student[]
  editingStudent: Student | null
}