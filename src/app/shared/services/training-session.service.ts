import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc, getDocs } from '@angular/fire/firestore';
import trainingSession from '../interfaces/training-session.interface';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TrainingSessionService {

  constructor(private firestore: Firestore) { }
  getTrainingSessions(): Observable<trainingSession[]> {
    const querySnapshot = getDocs(collection(this.firestore, "training_sessions"));
    return new Observable(observer => {
      querySnapshot.then((querySnapshot) => {
        const trainingSession: trainingSession[] = [];
        querySnapshot.forEach((doc) => {
          const session = doc.data();
          session.$id = doc.id;
          trainingSession.push(session as trainingSession);
        });
        observer.next(trainingSession);
      });
    });
  }
  putSessions(){
    let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    for (let day of daysOfWeek){
      let trainingSessions = [
        {
          dayOfWeek: day,
          endTime: "1600",
          startTime: "1700"
        },
        {
          dayOfWeek: day,
          endTime: "1700",
          startTime: "1800"
        },
        {
          dayOfWeek: day,
          endTime: "1800",
          startTime: "1900"
        },
        {
          dayOfWeek: day,
          endTime: "1900",
          startTime: "2000"
        },
        {
          dayOfWeek: day,
          endTime: "2000",
          startTime: "2100"
        },{
          dayOfWeek: day,
          endTime: "1500",
          startTime: "1600"
        }
      ];
      for (let session of trainingSessions){
        addDoc(collection(this.firestore, "training_sessions"), session);
      } 
    }
    
    
  }
}
