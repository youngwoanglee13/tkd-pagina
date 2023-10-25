export interface Student {
    $id: string;
    code: string;
    firstName: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    email: string;
    contactNumbers: {number: string, type: string}[];
    birthdate: string;
    gender: string;
    grade: string;
    CI: string;
    is_enrolled: boolean;
    is_deleted: boolean;
    enrollment_date: string;
    enrollemnt_type: string;
    training_session_ids: string[];
}
