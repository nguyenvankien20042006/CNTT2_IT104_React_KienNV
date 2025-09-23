import type { StudentState, typeAction } from "../../utils/types"

const studentInit: StudentState = {
    list: JSON.parse(localStorage.getItem("students") || "[]"),
    all: JSON.parse(localStorage.getItem("students") || "[]"),
    editingStudent: null
}

const studentReducer = (state = studentInit, action: typeAction): StudentState => {
    switch(action.type) {
        case 'ADD': {
            const studentClone = [...state.all, action.payload]
            localStorage.setItem("students", JSON.stringify(studentClone))
            return {...state, list: studentClone}
        }
        case "DELETE": {
            if(confirm("Bạn có chắc chắn muốn xoá không?")) {
                const studentClone = state.all.filter(student => student.id !== action.payload)
                localStorage.setItem("students", JSON.stringify(studentClone))
                return {...state, list: studentClone}
            }
            return state
        }
        case "EDIT": {
            return {...state, editingStudent: action.payload}
        }
        case "UPDATE": {
            const updateList = state.all.map(student => student.id === action.payload.id ? action.payload : student)
            localStorage.setItem("students", JSON.stringify(updateList))
            return {...state, list: updateList, editingStudent: null}
        }
        case "SEARCH": {
            const filterList = action.payload ? state.all.filter(student => student.fullName.toLowerCase().includes(action.payload.toLowerCase())) : state.all
            return {...state, list: filterList, editingStudent: null}
        }
        default: return state
    }
}
export default studentReducer