import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc, getDocs,  query, where, doc, deleteDoc, updateDoc, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private firestore: Firestore) { }
  // Create student
  async addStudent(student: Student) {
    try {
      const studentCollectionRef = collection(this.firestore, 'students');
      student.code = await this.getNextId();
      const studentDocRef = await addDoc(studentCollectionRef, student);
      this.updateNextId(Number(student.code));
      console.log('Student created with ID: ', studentDocRef.id);
    } catch (error) {
      console.error('Error creating student: ', error);
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
          students.push(student as Student);
        });
        observer.next(students);
      });
    });
  }
  // Fetch single student
  getStudent(studentId: string) {
    const studentDocRef = doc(this.firestore, 'students', studentId);
    return studentDocRef;
  }
  // Update student
  updateStudent(student: Student) {
    const studentDocRef = doc(this.firestore, 'students', student.$id);
    updateDoc(studentDocRef, 
      {
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        secondLastName: student.secondLastName,
        email: student.email,
        birthdate: student.birthdate,
        gender: student.gender,
        grade: student.grade,
        CI: student.CI
      });
  }
  // Delete student
  deleteStudent(studentId: string) {
    const studentDocRef = doc(this.firestore, 'students', studentId);
    deleteDoc(studentDocRef);
  }
}
