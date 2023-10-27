import { differenceInYears, differenceInMonths, format } from 'date-fns';

// Calculate age
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

// Difference in months
export function monthsDif(date1: string, date2: string): number {
    const dateOne = new Date(date1);
    const dateTwo = new Date(date2);
    const months = differenceInMonths(dateOne, dateTwo);
    return months;
}

// Today's date in yyyy-mm-dd format
export function today(): string {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    return todayString;
}
