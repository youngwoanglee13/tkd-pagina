import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from 'src/app/shared/interfaces/student';
import trainingSession from 'src/app/shared/interfaces/training-session.interface';
import { TrainingSessionService } from 'src/app/shared/services/training-session.service';
import { calculateAge } from 'src/app/shared/helpers/date_helper';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-training-session',
  templateUrl: './training-session.component.html',
  styleUrls: ['./training-session.component.scss']
})
export class TrainingSessionComponent implements OnInit {
  session : trainingSession;
  attendanceList : string[]= [];
  students : Student[] = [];
  calculateAge: (birthdate: string) => number;
  sessionId ="";
    constructor(private route: ActivatedRoute, private trainingSessionService: TrainingSessionService, private studentService: StudentService) {
      this.route.params.subscribe(params => { this.sessionId = params['id'] });
      this.calculateAge = calculateAge;
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
      this.studentService.getStudents().subscribe(students => {
        this.students = students;
      });
    }
  studentIsPresent(id: string){
    return this.attendanceList.includes(id);
  }
  checkStudent(id){
    if(this.studentIsPresent(id)){
      this.attendanceList = this.attendanceList.filter(studentId => studentId != id);
    }else{
      this.attendanceList.push(id);
    }
  }
}
