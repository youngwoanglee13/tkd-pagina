import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs,  query, where, doc, deleteDoc, updateDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Payment } from '../interfaces/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private firestore: Firestore) { }
  // Get payments between dates
  getPayments(startDate: string, endDate: string): Observable<Payment[]> {
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
    return payments;
  }
}
