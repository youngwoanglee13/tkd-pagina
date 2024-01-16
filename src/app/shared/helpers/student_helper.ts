import { Student } from '../interfaces/student';

export function getAlias(student: Student): string {
    if(student.alias) 
        return student.alias;
    const firstName = student.firstName;
    const lastName = student.lastName;
    const alias = firstName + ' ' + lastName;
    return alias;
}