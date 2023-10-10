export interface Student {
    $key: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
    email?: string;
    birthdate: string;
    gender: string;
    grade: number;
    CI?: string;
    phoneContactNumbers?: { context: string; number: string }[];
    profilePicture?: string;
}
