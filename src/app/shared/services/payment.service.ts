import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs,  query, where, doc, deleteDoc, updateDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Payment } from '../interfaces/payment';
import { today } from '../helpers/date_helper';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private firestore: Firestore) { }
  addPayment(payment: Payment) {
    payment.date = today();
    const paymentCollectionRef = collection(this.firestore, 'payments');
    return addDoc(paymentCollectionRef, payment);
  }
  // Get payments between dates
  getPayments(startDate: string = "0000-00-00", endDate: string = today()): Observable<Payment[]> {
    const q = collection(this.firestore, "payments");
    return new Observable((observer) => {
      onSnapshot(q, (querySnapshot) => {
        const payments: Payment[] = [];
        querySnapshot.forEach((doc) => {
          const payment = doc.data();
          payment.$id = doc.id;
          if (payment.date >= startDate && payment.date <= endDate) {
            payments.push(payment as Payment);
          }
        });
        payments.sort((a, b) => b.date.localeCompare(a.date));
        observer.next(payments);
      });
    });
  }
  
  async getPaymentsArray(startDate: string, endDate: string, student_id: string): Promise<Payment[]> {
    const q = collection(this.firestore, 'payments');
    const querySnapshot = await getDocs(q);
    const payments: Payment[] = [];
    await querySnapshot.forEach((doc) => {
      const payment = doc.data();
      payment.$id = doc.id;
      if (payment.date >= startDate && payment.date <= endDate && payment.student_id == student_id) {
        payments.push(payment as Payment);
      }
    });
    payments.sort((a, b) => b.date.localeCompare(a.date));
    return payments;
  }

  deletePayment(paymentId: string) {
    const paymentDocRef = doc(this.firestore, 'payments', paymentId);
    deleteDoc(paymentDocRef);
  }
}
