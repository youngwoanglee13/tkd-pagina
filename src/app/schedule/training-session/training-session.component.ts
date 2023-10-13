import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from 'src/app/shared/interfaces/student';
import trainingSession from 'src/app/shared/interfaces/training-session.interface';
import { TrainingSessionService } from 'src/app/shared/services/training-session.service';
import { differenceInYears } from 'date-fns';
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
  sessionId ="";
    constructor(private route: ActivatedRoute, private trainingSessionService: TrainingSessionService, private studentService: StudentService) {
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
      this.studentService.getStudents().subscribe(students => {
        this.students = students;
      });
      // this.trainingSessionService.getTrainingSessionStudents(this.sessionId).subscribe(students => {
      //   this.students = students;
      // });
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
  calculateAge(birthdate: string): number {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();
    const age = differenceInYears(currentDate, birthDate);
    return age;
  }
}
