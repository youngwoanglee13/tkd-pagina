import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/shared/interfaces/student';
import trainingSession from 'src/app/shared/interfaces/training-session.interface';
import { TrainingSessionService } from 'src/app/shared/services/training-session.service';
import { differenceInYears } from 'date-fns';
import { StudentService } from 'src/app/shared/services/student.service';
import { AttendanceService } from 'src/app/shared/services/attendance.service';
import { Attendance } from 'src/app/shared/interfaces/attendance';
@Component({
  selector: 'app-training-session',
  templateUrl: './training-session.component.html',
  styleUrls: ['./training-session.component.scss']
})
export class TrainingSessionComponent implements OnInit {
  sessionId ="";
  session : trainingSession;
  attendanceListIds : string[]= [];
  students : Student[] = [];
  date ="";
  constructor(private route: ActivatedRoute, private trainingSessionService: TrainingSessionService, private studentService: StudentService, private attendanceService: AttendanceService,private router: Router) {
    this.route.params.subscribe(params => { this.sessionId = params['id']; this.date = params['date'] });
  }
  ngOnInit(): void {
    this.getTrainingSession();
    this.getSessionStudents();
    this.getCheckedStudentsList();
  }
  getTrainingSession(){
    this.trainingSessionService.getTrainingSession(this.sessionId).subscribe(session => {
      this.session = session;
    });
  }
  getSessionStudents(){
    this.studentService.getStudentsWithTrainingSession(this.sessionId).subscribe(students => {
      this.students = students;
    });
  }
  getCheckedStudentsList(){
    this.attendanceService.getAttendanceBySessionIdAndDate(this.sessionId,this.date).subscribe(attendanceList => {
      this.checkStudents(attendanceList);   
    });
  }
  checkStudents(attendanceList: Attendance[]){
    this.attendanceListIds = [];
    for (let attendance of attendanceList){
      this.attendanceListIds.push(attendance.student_id);
    }
  }
  studentIsPresent(id: string){
    return this.attendanceListIds.includes(id);
  }
  checkStudent(id: string){
    if(this.studentIsPresent(id)){
      this.attendanceListIds = this.attendanceListIds.filter(studentId => studentId != id);
    }else{
      this.attendanceListIds.push(id);
    }
  }
  calculateAge(birthdate: string): number {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();
    const age = differenceInYears(currentDate, birthDate);
    return age;
  }
  saveAttendance(){
    let attendanceList = [];
    for (let studentId of this.attendanceListIds){
      let attendance  = {
        student_id: studentId,
        training_session_id: this.sessionId,
        date: this.date,
      };
      attendanceList.push(attendance);
    }
    this.attendanceService.saveAttendance(attendanceList);
  }
  selectDate(){
    this.attendanceListIds = [];
    this.router.navigate(['session/'+this.sessionId+'/'+this.date]);
    this.getCheckedStudentsList();
  }
  
}
