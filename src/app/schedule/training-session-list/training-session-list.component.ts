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
    this.getTrainingSessionsOrderedByDays();
  }
  getTrainingSessionsOrderedByDays() {
    this.trainingSessions = this.trainingSessionService.getTrainingSessionsOrderedByDays();
  }
  selectSession(id){
    this.router.navigate(['session/'+id]);
  }
}
