import { Student } from '../interfaces/student';

export function getAlias(student: Student): string {
    if(student.alias) 
        return student.alias;
    const firstName = student.firstName;
    const middleName = student.middleName;
    const lastName = student.lastName;
    const secondLastName = student.secondLastName;
    const alias = `${firstName} ${middleName} ${lastName} ${secondLastName}`;
}