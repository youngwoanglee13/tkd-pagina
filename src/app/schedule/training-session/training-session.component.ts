import { Component, OnInit } from '@angular/core';
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
  checkedStudents : string[]= [];
  previousStudentIds: string[] = [];
  previousAttendance: Attendance[] = [];
  studentsList : Student[] = [];
  date ="";
  daysOfWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
  constructor(private route: ActivatedRoute, private trainingSessionService: TrainingSessionService, private studentService: StudentService, private attendanceService: AttendanceService,private router: Router) {
    this.route.params.subscribe(params => { this.sessionId = params['id'] });
  }
  ngOnInit(): void {
    this.getTrainingSession();
    this.getSessionStudents();
    this.getPreviousAttendanceList();
  }
  getTrainingSession(){
    this.trainingSessionService.getTrainingSession(this.sessionId).subscribe(session => {
      this.session = session;
      this.getNextDayOfWeek();
    });
  }
  getSessionStudents(){
    this.studentService.getStudentsWithTrainingSession(this.sessionId).subscribe(students => {
      this.studentsList = students;
      for (let student of students){
        this.studentService.getDebt(student).subscribe((debt) => {
          student.debt_str = debt['str'];
        });
      }
    });
  }
  getPreviousAttendanceList(){
    this.previousStudentIds = [];
    this.attendanceService.getAttendanceBySessionIdAndDate(this.sessionId,this.date).subscribe(attendanceList => {
      this.previousAttendance = attendanceList;
      for (let attendance of attendanceList){
        this.previousStudentIds.push(attendance.student_id);
      }
      this.checkStudents();   
    });
  }
  checkStudents(){
    this.checkedStudents = [];
    for (let student_id of this.previousStudentIds){
      this.checkedStudents.push(student_id);
    }
  }
  studentIsChecked(id: string){
    return this.checkedStudents.includes(id);
  }
  checkStudent(id: string){
    if(this.studentIsChecked(id)){
      this.checkedStudents = this.checkedStudents.filter(studentId => studentId != id);
    }else{
      this.checkedStudents.push(id);
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
    if(this.previousStudentIds.length > 0){
      this.updateAttendanceList();
      return;
    }
    for (let studentId of this.checkedStudents){
      let attendance  = {
        student_id: studentId,
        training_session_id: this.sessionId,
        date: this.date,
      };
      attendanceList.push(attendance);
    }
    this.attendanceService.saveAttendances(attendanceList);
  }
  selectDate(){
    this.checkedStudents = [];
    this.getPreviousAttendanceList();
  }
  updateAttendanceList(){
    let newAttendancesList = [];
    let deleteAttendancesList = [];
    for (let student of this.studentsList){
      if(this.previousStudentIds.includes(student.$id) && !this.checkedStudents.includes(student.$id)){
        deleteAttendancesList.push(this.previousAttendance.find(attendance => attendance.student_id == student.$id).id);  
      }
      if(!this.previousStudentIds.includes(student.$id) && this.checkedStudents.includes(student.$id)){
        let attendance  = {
          student_id: student.$id,
          training_session_id: this.sessionId,
          date: this.date,
        };
        newAttendancesList.push(attendance);    
      }
    }
    this.attendanceService.updateAttendances(newAttendancesList,deleteAttendancesList);
    this.getPreviousAttendanceList();
  }
  validateDate(input: any) {
    const selectedDate = new Date(input.target.value);
    const dayOfWeek = selectedDate.getDay();
    if (this.daysOfWeek[dayOfWeek] !== this.session.dayOfWeek) {
      alert("Selecciona un " + this.session.dayOfWeek);
      this.getNextDayOfWeek();
    }
    this.selectDate();
  }
  getNextDayOfWeek() {
    const today = new Date();
    const dayOfWeek = this.daysOfWeek.indexOf(this.session.dayOfWeek);
    const todayDayOfWeek = today.getDay()-1;
    if (dayOfWeek == todayDayOfWeek) {
      this.date = today.toISOString().slice(0, 10);
      return;
    }
    let distance = dayOfWeek - todayDayOfWeek;
    if (distance < 0) {
      distance += 7;
    }
    const nextDay = new Date(today.setDate(today.getDate() + distance));
    this.date = nextDay.toISOString().slice(0, 10);
  }
  
}
