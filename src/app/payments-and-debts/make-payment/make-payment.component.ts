import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { StudentService } from 'src/app/shared/services/student.service';
import { Student } from 'src/app/shared/interfaces/student';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent {
  public paymentForm: FormGroup;
  public student: Student;
  constructor(
    public studentApi: StudentService,
    public paymentApi: PaymentService,
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private location: Location,
    public toastr: ToastrService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.getStudent();
  }
  getStudent() {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.studentApi
      .getStudent(id)
      .subscribe((data) => {
        this.student = data;
        this.studenForm();
        this.studentApi.getDebt(this.student).subscribe((debt) => {
          this.student.debt_str = debt['str'];
          this.student.debt = debt['val'];
        });
      });
  }
  studenForm() {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required]],
      comment: [''],
    });
  }
  ResetForm() {
    this.paymentForm.reset();
  }
  submitPaymentData() {
    if (this.paymentForm.invalid) {
      alert('* Llenar todos los campos obligatorios');
      return;
    }
    
    let payment = this.paymentForm.value;
    if (window.confirm('Estás seguro de realizar el pago de ' + payment.amount + 'Bs en favor de ' + 
                        this.student.firstName + ' ' + this.student.lastName + '?')) { 
      let payment = this.paymentForm.value;
      payment.student_id = this.student.$id;
      this.paymentApi.addPayment(this.paymentForm.value).then((res) => {
        this.toastr.success(
          'Pago Realizado!'
        );
        this.ResetForm();
        this.router.navigate(['/view-payments']);
      });
    }
  }

  goBack() {
    this.location.back();
  }

}
