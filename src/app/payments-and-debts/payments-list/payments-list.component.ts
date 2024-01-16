import { Component } from '@angular/core';
import { Payment } from '../../shared/interfaces/payment';
import { PaymentService } from '../../shared/services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../shared/services/student.service';
import { Student } from '../../shared/interfaces/student';
import { getAlias } from 'src/app/shared/helpers/student_helper';

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
          this.student_names[student.$id] = getAlias(student);
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
