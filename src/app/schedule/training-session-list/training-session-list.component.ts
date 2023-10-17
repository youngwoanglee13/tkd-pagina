import { Component, OnInit } from '@angular/core';
import { TrainingSessionService } from 'src/app/shared/services/training-session.service';
import trainingSession from 'src/app/shared/interfaces/training-session.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-session-list',
  templateUrl: './training-session-list.component.html',
  styleUrls: ['./training-session-list.component.scss']
})
export class TrainingSessionListComponent implements OnInit {
  trainingSessions : trainingSession[][] = [[], [], [], [], []];
  daysOfWeek = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];
  session : trainingSession;
  constructor(private trainingSessionService: TrainingSessionService, private router: Router) { }
  ngOnInit(): void {
    this.getTrainingSessions();
  }
  async getTrainingSessions() {
    await this.trainingSessionService.getTrainingSessions().subscribe(
      (sessions) => {
          this.orderByDay(sessions);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  orderByDay(trainingSessions) {
    for (let session of trainingSessions){
      if(session.dayOfWeek=="Monday") this.trainingSessions[0].push(session);
      if(session.dayOfWeek=="Tuesday") this.trainingSessions[1].push(session);
      if(session.dayOfWeek=="Wednesday") this.trainingSessions[2].push(session);
      if(session.dayOfWeek=="Thursday") this.trainingSessions[3].push(session);
      if(session.dayOfWeek=="Friday") this.trainingSessions[4].push(session);
    }
    for (let day of this.trainingSessions){
      day.sort((a, b) => (parseInt(a.startTime) > parseInt(b.startTime)) ? 1 : -1);
    }
  }
  selectSession(id){
    this.router.navigate(['session/'+id]);
  }
}
