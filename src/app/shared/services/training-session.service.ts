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
  getTrainingSessionsOrderedByDays(): trainingSession[][] {
    let orderedTrainingSessions : trainingSession[][] = [[], [], [], [], []];
    this.getTrainingSessions().subscribe(
      (sessions) => {
        for (let session of sessions){
          if(session.dayOfWeek=="Lunes") orderedTrainingSessions[0].push(session);
          if(session.dayOfWeek=="Martes") orderedTrainingSessions[1].push(session);
          if(session.dayOfWeek=="Miercoles") orderedTrainingSessions[2].push(session);
          if(session.dayOfWeek=="Jueves") orderedTrainingSessions[3].push(session);
          if(session.dayOfWeek=="Viernes") orderedTrainingSessions[4].push(session);
        }
        for (let day of orderedTrainingSessions){
          day.sort((a, b) => (parseInt(a.startTime) > parseInt(b.startTime)) ? 1 : -1);
        }
      }
    );
    return orderedTrainingSessions;
  }
}
