import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, onSnapshot, collectionData, doc, deleteDoc, updateDoc, getDocs } from '@angular/fire/firestore';
import trainingSession from '../interfaces/training-session.interface';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TrainingSessionService {

  constructor(private firestore: Firestore) { }
  getTrainingSessions(): Observable<trainingSession[]> {
    const q = collection(this.firestore, "training_sessions");
    return new Observable(observer => {
      onSnapshot(q, (querySnapshot) => {
        const trainingSession: trainingSession[] = [];
        querySnapshot.forEach((doc) => {
          const session = doc.data();
          session.id = doc.id;
          trainingSession.push(session as trainingSession);
        });
        observer.next(trainingSession);
      });
    });
  }
  getTrainingSession(id): Observable<trainingSession> {
    const q = doc(this.firestore, "training_sessions", id);
    return new Observable(observer => {
      onSnapshot(q, (doc) => {
        const session = doc.data();
        session.id = doc.id;
        observer.next(session as trainingSession);
      });
    });
  }
}
