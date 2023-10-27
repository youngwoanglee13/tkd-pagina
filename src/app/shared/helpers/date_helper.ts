import { differenceInYears,format  } from 'date-fns';

export function calculateAge(birthdate: string): number {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();
    const age = differenceInYears(currentDate, birthDate);
    return age;
}
export function currentDate(): string {
    const currentDate = new Date();
    const date = format(currentDate, 'yyyy-MM-dd');
    return date;
} 

