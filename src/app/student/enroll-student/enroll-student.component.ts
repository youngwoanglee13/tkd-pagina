import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { currentDate } from 'src/app/shared/helpers/date_helper';
import { Student } from 'src/app/shared/interfaces/student';
import trainingSession from 'src/app/shared/interfaces/training-session.interface';
import { StudentService } from 'src/app/shared/services/student.service';
import { TrainingSessionService } from 'src/app/shared/services/training-session.service';

@Component({
  selector: 'app-enroll-student',
  templateUrl: './enroll-student.component.html',
  styleUrls: ['./enroll-student.component.scss']
})
export class EnrollStudentComponent implements OnInit  {
  studentId: string;
  student: Student;
  trainingSessions : trainingSession[][] = [[], [], [], [], []];
  selectedSessionsIds=["","",""];
  daysOfWeek=['Lunes','Martes','Miercoles','Jueves','Viernes']
  selectedDays=[0,0,0];
  weeklySessionCount=1;
  date =currentDate();
  constructor(private route: ActivatedRoute, private studentService: StudentService, private trainingSessionService: TrainingSessionService) {
    this.studentId = this.route.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    this.getStudentById();
    this.getTrainingSessionsOrderedByDays();
  }
  getStudentById() {
    this.studentService.getStudent(this.studentId).subscribe((student) => {
      this.student = student as Student;
    });
  }
  getTrainingSessionsOrderedByDays() {
    this.trainingSessions = this.trainingSessionService.getTrainingSessionsOrderedByDays();
  }
  getSessionByDay(day: number) {
    return this.trainingSessions[day];
  }
  setSessionsPerWeek(event: any){
    this.weeklySessionCount=event.target.value;
  }
  selectSession(event: any,pos: number){
    const sessionId = event.target.value;
    if(sessionId==="")return;
    this.selectedSessionsIds[pos]=sessionId;
  }
  resetDay(day: number){
    this.selectedSessionsIds[day]="";
  }
  enrollStudent(){
    let selectedSessions=this.selectedSessionsIds.filter(item => item !== "")
    selectedSessions=Array.from(new Set(selectedSessions));
    if(this.weeklySessionCount!=selectedSessions.length){alert("LLenar todos los campos correctamente");return};

    this.student.training_session_ids=selectedSessions;
    this.student.enrollment_date=this.date;
    this.student.enrollemnt_type= this.weeklySessionCount+ (this.weeklySessionCount==1 ? " sesion" : " sesiones") + " por semana";
    
    this.studentService.enrollStudent(this.student);
  }
}
