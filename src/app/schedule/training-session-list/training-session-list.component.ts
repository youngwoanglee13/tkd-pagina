import { Component, OnInit } from '@angular/core';
import { TrainingSessionService } from 'src/app/shared/services/training-session.service';
import trainingSession from 'src/app/shared/interfaces/training-session.interface';
import { Router } from '@angular/router';
import { currentDate } from 'src/app/shared/helpers/date_helper';

@Component({
  selector: 'app-training-session-list',
  templateUrl: './training-session-list.component.html',
  styleUrls: ['./training-session-list.component.scss']
})
export class TrainingSessionListComponent implements OnInit {
  trainingSessions:trainingSession[][] = [];
  daysOfWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
  session : trainingSession;
  constructor(private trainingSessionService: TrainingSessionService, private router: Router) { }
  ngOnInit(): void {
    this.getTrainingSessionsOrderedByDays();
  }
  getTrainingSessionsOrderedByDays() {
    this.trainingSessionService.getTrainingSessionsOrderedByDays().then(
      (sessions) => {
        this.trainingSessions = sessions;
      }
    );
  }
  selectSession(id: string){
    this.router.navigate(['session/'+id+'/'+currentDate()]);
  } 
}
