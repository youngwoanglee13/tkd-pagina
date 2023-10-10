import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private firestore: Firestore) { }
  // Create student
  async addStudent(student: Student) {
    try {
      const studentCollectionRef = collection(this.firestore, 'students');
      const studentDocRef = await addDoc(studentCollectionRef, student);
      console.log('Student created with ID: ', studentDocRef.id);
    } catch (error) {
      console.error('Error creating student: ', error);
    }
  }
  // Fetch all students
  getStudents() {
    const studentsCollectionRef = collection(this.firestore, 'students');
    return collectionData(studentsCollectionRef);
  }
  // Fetch single student
  getStudent(studentId: string) {
    const studentDocRef = doc(this.firestore, 'students', studentId);
    return studentDocRef;
  }
  // Update student
  updateStudent(student: Student) {
    const studentDocRef = doc(this.firestore, 'students', student.$key);
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
        CI: student.CI,
        phoneContactNumbers: student.phoneContactNumbers,
        profilePicture: student.profilePicture
      });
  }
  // Delete student
  deleteStudent(studentId: string) {
    const studentDocRef = doc(this.firestore, 'students', studentId);
    deleteDoc(studentDocRef);
  }
}
