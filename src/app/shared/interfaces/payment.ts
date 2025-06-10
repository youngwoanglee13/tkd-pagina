export interface Payment {
    id: string;
    student_id?: string;
    student_name: string;
    amount: number;
    date: string;
    comment: string;
    payment_method?: PaymentMethod
    is_extra_payment?: boolean;
}

export enum PaymentMethod {
    Cash = "Cash",
    BankTransfer = "BankTransfer",
}