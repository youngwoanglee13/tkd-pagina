import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, onSnapshot, collectionData, doc, deleteDoc, updateDoc, writeBatch,where,query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Attendance } from '../interfaces/attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private firestore: Firestore) { }

  getAttendanceBySessionIdAndDate(sessionId: string, date: string): Observable<Attendance[]> {
    const attendanceCollectionRef = collection(this.firestore, 'attendance');
    const q = query(attendanceCollectionRef, where('training_session_id', '==', sessionId), where('date', '==', date));
    return new Observable(observer => {
      onSnapshot(q, (querySnapshot) => {
        const attendance: Attendance[] = [];
        querySnapshot.forEach((doc) => {
          const attendanceDoc = doc.data();
          attendanceDoc.id = doc.id;
          attendance.push(attendanceDoc as Attendance);
        });
        observer.next(attendance);
      });
    });
  }

  async saveAttendance(attendanceList: Attendance[]): Promise<void> {
    const attendanceCollectionRef = collection(this.firestore, 'attendance');
    const batch = writeBatch(this.firestore);
    attendanceList.forEach((attendance) => {
      const newDocRef = doc(attendanceCollectionRef);
      batch.set(newDocRef, attendance);
    });
    return await batch.commit().then(() => {
      console.log('Asistencias guardadas con éxito.');
    }).catch((error) => {
      console.error('Error al guardar las asistencias:', error);
      throw error; // Lanzar el error para que pueda ser manejado por el código que llama a esta función.
    });
  }
}
