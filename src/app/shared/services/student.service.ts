import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc, getDocs,  query, where, doc, deleteDoc, updateDoc, onSnapshot } from '@angular/fire/firestore';
import { monthsDif, today } from '../helpers/date_helper';
import { PaymentService } from './payment.service';
import { Payment } from '../interfaces/payment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private firestore: Firestore,
    public paymentApi: PaymentService
    ) { }
  // Create student
  async addStudent(student: Student) {
    try {
      const studentCollectionRef = collection(this.firestore, 'students');
      student.is_enrolled = false;
      student.code = await this.getNextId();
      const studentDocRef = await addDoc(studentCollectionRef, student);
      this.updateNextId(Number(student.code));
      return studentDocRef;
    } catch (error) {
      console.error('Error creating student: ', error);
      return null;
    }
  }
  async getNextId() {
    let counterRef = collection(this.firestore, 'counter');
    const q = query(counterRef, where('name', '==', 'studentId'))
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const counterCollectionRef = collection(this.firestore, 'counter');
      await addDoc(counterCollectionRef, { name: 'studentId', nextId: 0 });
      return 0;
    }
    return querySnapshot.docs[0].data().nextId + 1;
  }
  async updateNextId(nextId: number) {
    let counterRef = collection(this.firestore, 'counter');
    const q = query(counterRef, where('name', '==', 'studentId'))
    const querySnapshot = await getDocs(q);
    const counterDocRef = doc(this.firestore, 'counter', querySnapshot.docs[0].id);
    updateDoc(counterDocRef, { nextId: nextId });
  }
  // Fetch all students
  getStudents(): Observable<Student[]> {
    const q = collection(this.firestore, "students");
    return new Observable((observer) => {
      onSnapshot(q, (querySnapshot) => {
        const students: Student[] = [];
        querySnapshot.forEach((doc) => {
          const student = doc.data();
          student.$id = doc.id;
          if (!student.is_deleted) {
            students.push(student as Student);
          }
        });
        observer.next(students);
      });
    });
  }
  // Fetch all debtors
  getDebtors(): Observable<Student[]> {
    return new Observable((observer) => {
      this.getStudents().subscribe((students) => {
        const debtors: Student[] = [];
        let processedCount = 0; // Keep track of processed students

        students.forEach((student) => {
          if (student.is_enrolled && !student.is_deleted) {
            this.paymentApi.getPaymentsArray(student.enrollment_date, student.$id).then((payments) => {
              student.debt = this.calculateDebt(student, payments);
              student.debt_str = this.getDebtString(student);
              if (student.debt > 0) {
                debtors.push(student);
              }

              processedCount++; // Increment processed count

              // Check if all students have been processed
              if (processedCount === students.length) {
                // Sort the debtors array by debt in decreasing order
                debtors.sort((a, b) => b.debt - a.debt);
                observer.next(debtors);
              }
            });
          } else {
            processedCount++; // Increment processed count for non-debtors

            // Check if all students have been processed
            if (processedCount === students.length) {
              // Sort the debtors array by debt in decreasing order
              debtors.sort((a, b) => b.debt - a.debt);
              observer.next(debtors);
            }
          }
        });
      });
    });
  }

  // Calculate debt
  calculateDebt(student: Student, payments?: Payment[]) {
    let todayDate = today();
    let months = monthsDif(todayDate, student.enrollment_date, );
    let debt = (months + 1) * student.monthly_payment;
    if (payments) {
      payments.forEach((payment) => {
        debt -= payment.amount;
      });
    }
    return debt;
  }
  getDebt(student: Student): Observable<any> {
    return new Observable((observer) => {
      this.paymentApi.getPaymentsArray(student.enrollment_date, student.$id).then((payments) => {
        let debt = this.calculateDebt(student, payments);
        student.debt = debt;
        observer.next({'val': debt, 'str': this.getDebtString(student)});
      });
    });
  }
  // Get debt string
  getDebtString(student: Student): string {
    if(isNaN(student.debt)) return 'Error';
    if(student.debt <= 0) return 'Al día';
    let months = Math.ceil(student.debt/student.monthly_payment);
    return student.debt + 'Bs / ' + months + ' mes' + (months > 1 ? 'es' : '');
  }
  // Fetch single student
  getStudent(studentId: string): Observable<Student> {
    // return observable with snapshot of student data object Student
    return new Observable((observer) => {
      const studentDocRef = doc(this.firestore, 'students', studentId);
      onSnapshot(studentDocRef, (doc) => {
        const student = doc.data();
        student.$id = doc.id;
        observer.next(student as Student);
      });
    });
  }
  // Fetch single student by code
  getStudentByCode(code: number): Observable<Student> {
    // return observable with snapshot of student data object Student
    return new Observable((observer) => {
      const q = query(collection(this.firestore, "students"), where("code", "==", code));
      onSnapshot(q, (querySnapshot) => {
        const students: Student[] = [];
        querySnapshot.forEach((doc) => {
          const student = doc.data();
          student.$id = doc.id;
          students.push(student as Student);
        });
        if(students.length > 0)
          observer.next(students[0]);
        else
          observer.next(null);
      });
    });
  }
  
  // Update student
  updateStudent(student: Student, studentId: string) {
    const studentDocRef = doc(this.firestore, 'students', studentId);
    updateDoc(studentDocRef, 
      {
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        secondLastName: student.secondLastName,
        alias: student.alias,
        email: student.email,
        birthdate: student.birthdate,
        gender: student.gender,
        grade: student.grade,
        CI: student.CI,
        contacts: student.contacts
      });
  }
  // Delete student
  deleteStudent(studentId: string) {
    const studentDocRef = doc(this.firestore, 'students', studentId);
    deleteDoc(studentDocRef);
  }
  // Enroll student
  enrollStudent(student: Student) {
    const studentDocRef = doc(this.firestore, 'students', student.$id);
    updateDoc(studentDocRef, 
      {
        is_enrolled: true,
        training_session_ids: student.training_session_ids,
        enrollment_date: student.enrollment_date,
        enrollemnt_type: student.enrollemnt_type,
        monthly_payment: student.monthly_payment
      });
  }
  //fetch all students enrolled in a session
  getStudentsWithTrainingSession(id:string): Observable<Student[]> {////////////////ASISTENCIA
    const q = query(collection(this.firestore, "students"), where("training_session_ids", "array-contains", id));
    return new Observable((observer) => {
      onSnapshot(q, (querySnapshot) => {
        const students: Student[] = [];
        querySnapshot.forEach((doc) => {
          const student = doc.data();
          student.$id = doc.id;
          students.push(student as Student);
        });
        observer.next(students);
      });
    });
  }
  // Withdraw student
  withdrawStudent(student: Student) {
    const studentDocRef = doc(this.firestore, 'students', student.$id);
    updateDoc(studentDocRef, 
      {
        is_enrolled: false,
      });
  }

  getCompleteName(student: Student): string {
    let completeName = student.firstName;
    if(student.middleName){
      completeName += ' ' + student.middleName;
    }
    completeName += ' ' + student.lastName;
    if(student.secondLastName){
      completeName += ' ' + student.secondLastName;
    }
    return completeName;
  }
}

