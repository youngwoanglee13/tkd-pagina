import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from 'src/app/shared/interfaces/student';
import trainingSession from 'src/app/shared/interfaces/training-session.interface';
import { TrainingSessionService } from 'src/app/shared/services/training-session.service';

@Component({
  selector: 'app-training-session',
  templateUrl: './training-session.component.html',
  styleUrls: ['./training-session.component.scss']
})
export class TrainingSessionComponent implements OnInit {
  session : trainingSession;
  students : Student[];
  sessionId ="";
    constructor(private route: ActivatedRoute, private trainingSessionService: TrainingSessionService) {
      this.route.params.subscribe(params => { this.sessionId = params['id'] });
    }
    ngOnInit(): void {
      this.getTrainingSession();
      this.getSessionStudents();
    }
    getTrainingSession(){
      this.trainingSessionService.getTrainingSession(this.sessionId).subscribe(session => {
        this.session = session;
      });
    }
    getSessionStudents(){
      // this.trainingSessionService.getTrainingSessionStudents(this.sessionId).subscribe(students => {
      //   this.students = students;
      // });
      this.students = [
        {
            $id: '1',
            code: '123',
            firstName: 'John',
            middleName: 'Doe',
            lastName: 'Doe',
            secondLastName: 'Doe',
            email: '@gmail.com',
            birthdate: '01/01/2000',
            gender: 'Male',
            grade: 1,
            CI: '123456789'
        },{
          $id: '2',
          code: '123',
          firstName: 'Pacha',
          middleName: 'Cuy',
          lastName: 'Doe',
          secondLastName: 'Doe',
          email: '@gmail.com',
          birthdate: '01/01/2000',
          gender: 'Male',
          grade: 1,
          CI: '123456789'
      },
      {
        $id: '3',
        code: '123',
        firstName: 'Lee',
        middleName: 'Doe',
        lastName: 'Doe',
        secondLastName: 'Doe',
        email: '@gmail.com',
        birthdate: '01/01/2000',
        gender: 'Male',
        grade: 1,
        CI: '123456789'
    }
      ]
    }
}
