import { Component } from '@angular/core';

@Component({
  selector: 'app-training-session-list',
  templateUrl: './training-session-list.component.html',
  styleUrls: ['./training-session-list.component.scss']
})
export class TrainingSessionListComponent {
  trainingSessions = [];
  constructor() {
    this.trainingSessions = [
      {
        id: '1',
        dayOfWeek: 'Monday',
        endTimeMinutes: 743,
        startTimeMinutes: 613
      },
      {
        id: '2',
        dayOfWeek: 'Tuesday',
        endTimeMinutes: 743,
        startTimeMinutes: 613
      },
      {
        id: '3',
        dayOfWeek: 'Wednesday',
        endTimeMinutes: 743,
        startTimeMinutes: 613
      },
      {
        id: '4',
        dayOfWeek: 'Thursday',
        endTimeMinutes: 743,
        startTimeMinutes: 613
      },
      {
        id: '5',
        dayOfWeek: 'Friday',
        endTimeMinutes: 743,
        startTimeMinutes: 613
      },{
        id: '6',
        dayOfWeek: 'Friday',
        endTimeMinutes: 743,
        startTimeMinutes: 613
      }
    ];
  }
  selectSession(id) {
    console.log('id', id);
  }
}
