import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../shared/services/payment.service';
import { Payment } from '../../shared/interfaces/payment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-make-extra-payment',
  templateUrl: './make-extra-payment.component.html',
  styleUrls: ['./make-extra-payment.component.scss']
})
export class MakeExtraPaymentComponent {
  extraPaymentForm: FormGroup;

  constructor(private fb: FormBuilder, private paymentService: PaymentService, public toastr: ToastrService,) {
    this.extraPaymentForm = this.fb.group({
      student_name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      payment_method: ['', Validators.required],
      date: ['', Validators.required],
      comment: ['',Validators.required]
    });
  }

  saveExtraPayment(): void {
    if (this.extraPaymentForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const extraPayment: Payment = {
      ...this.extraPaymentForm.value,
      is_extra_payment: true,
    };

    this.toastr.info(
      'Guardando'
    );

    if(window.confirm('¿Guardar Pago Extra de ' + extraPayment.student_name + ' de ' + extraPayment.amount + 'Bs. por ' + extraPayment.comment + '?')) {
      this.paymentService.addPayment(extraPayment).then(() => {
        this.toastr.success(
          'Pago Extra Guardado!'
        );
        this.extraPaymentForm.reset();
      }).catch((error) => {
        this.toastr.error(
          'Error, inténtalo de nuevo.'
        );
      }); 
    }
  }
}
