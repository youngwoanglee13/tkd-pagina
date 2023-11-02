import { Component } from '@angular/core';
import { Payment } from '../../shared/interfaces/payment';
import { PaymentService } from '../../shared/services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { Student } from '../../shared/interfaces/student';
import { StudentService } from '../../shared/services/student.service';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss']
})
export class PaymentsListComponent {
  p: number = 1;
  payments: Payment[];
  myPayments: Payment[];
  searchTerm: string = '';
  student_names: {};
  calculateAge: (birthdate: string) => number;
  constructor(
    public paymentApi: PaymentService,
    public studentApi: StudentService,
    public toastr: ToastrService
    ){}
  ngOnInit() {
    this.getPayments();
  }
  async getPayments() {
    await this.paymentApi.getPayments().subscribe(
      (payments) => {
        this.myPayments = payments;
        this.getStudents();
      },
      error => console.log(error)
    );
  }
  async getStudents() {
    await this.studentApi.getStudents().subscribe(
      (students) => {
        this.student_names = {};
        for (let student of students) {
          this.student_names[student.$id] = student.firstName + ' ' + student.lastName;
        }
        for (let payment of this.myPayments) {
          payment.student_name = this.student_names[payment.student_id];
        }
        this.payments = this.myPayments;
      },
      error => console.log(error)
    );
  }
  deletePayment(payment) {
    if (window.confirm('Estás seguro que quieres eliminar el pago de ' + this.student_names[payment.student_id] + ' de ' + 
                        payment.amount + 'Bs ' + 'del ' + payment.date + '?')) { 
      console.log(payment)
      this.paymentApi.deletePayment(payment.$id)
      this.toastr.success('Pago Eliminado correctamente!');
    }
  }
  searchStudents() {
    // Filter the students based on the search term
    if (this.searchTerm.trim() === '') {
      // If the search term is empty, show all students
      this.reset();
    } else {
      this.payments = this.myPayments.filter(payment => {
        // You can adjust the condition based on your search criteria
        return payment.student_name.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
  }

  reset()
  {
    this.searchTerm = '';
    this.payments = this.myPayments;
  }
}
