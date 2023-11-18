import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ro } from 'date-fns/locale';
import { currentDate } from 'src/app/shared/helpers/date_helper';
import { Student } from 'src/app/shared/interfaces/student';
import trainingSession from 'src/app/shared/interfaces/training-session.interface';
import { StudentService } from 'src/app/shared/services/student.service';
import { TrainingSessionService } from 'src/app/shared/services/training-session.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-enrollment',
  templateUrl: './edit-enrollment.component.html',
  styleUrls: ['./edit-enrollment.component.scss']
})
export class EditEnrollmentComponent {
  selectedDay: number=0;
  trainingSessions : trainingSession[][] = [];
  sessionsOptions: trainingSession[]=[];
  selectedOption: string="";
  selectedSessionsIds=[]
  selectedSessions: trainingSession[]=[];
  monthlyPayment=0;
  daysOfWeek=['Lunes','Martes','Miercoles','Jueves','Viernes']
  date =currentDate();
  weeklySessionCount=2;
  studentId: string;
  student: Student;
  constructor(private route: ActivatedRoute, private studentService: StudentService, private trainingSessionService: TrainingSessionService, private router: Router) {
    this.studentId = this.route.snapshot.paramMap.get('id');
  }
   ngOnInit(): void { 
    this.getStudentById(),
    this.getTrainingSessionsOrderedByDays()
  }
  getStudentById() {
    this.studentService.getStudent(this.studentId).subscribe((student) => {
      this.student = student as Student;
      this.getPreviousSessions();
    });
  }
  getTrainingSessionsOrderedByDays() {
    this.trainingSessionService.getTrainingSessionsOrderedByDays().then(
      (sessions) => {
        this.trainingSessions = sessions;
        this.sessionsOptions=this.trainingSessions[0];
      }
    );
  }
  setSessionsPerWeek(event: any){
    this.weeklySessionCount=event.target.value;
  }
  selectDay(event: any){
    this.selectedDay=event.target.value;
    this.sessionsOptions=this.trainingSessions[this.selectedDay];
  }
  selectOption(event: any){
    const sessionId = event.target.value;
    this.selectedOption=sessionId
  }
  addSession(){
    if(this.selectedOption===""){alert("Elige un horario");return};
    if(this.selectedSessionsIds.length>=this.weeklySessionCount){alert("Ya se han agregado todas las sesiones");return}
    if(this.selectedSessionsIds.includes(this.selectedOption)){alert("Ya se ha agregado esta sesion");return};
    this.selectedSessionsIds.push(this.selectedOption);
    this.selectedSessions.push(this.sessionsOptions.find(session=>session.id==this.selectedOption));
  }
  deleteSession(sessionId: string){
    this.selectedSessionsIds=this.selectedSessionsIds.filter(item => item !== sessionId);
    this.selectedSessions=this.selectedSessions.filter(session=>session.id!=sessionId);
  }
  enrollStudent(){
    if(this.weeklySessionCount!=this.selectedSessionsIds.length){alert("El horario debe contener "+this.weeklySessionCount + " sesiones");return};
    if(this.monthlyPayment<=0){alert("El pago mensual debe ser mayor a 0");return};
    this.student.training_session_ids=this.selectedSessionsIds;
    this.student.enrollment_date=this.date;
    this.student.enrollemnt_type= this.weeklySessionCount + " sesiones por semana";
    this.student.monthly_payment=this.monthlyPayment;
    
    this.studentService.enrollStudent(this.student);
   // alert("Estudiante inscrito correctamente");
    this.router.navigate(['view-students/'+this.studentId]);

  }
  getPreviousSessions(){
    this.trainingSessionService.getTrainingSessionsByIDs(this.student.training_session_ids).then(
      (sessions) => {
        this.selectedSessions=sessions;
        this.selectedSessionsIds=this.student.training_session_ids;
        this.monthlyPayment=this.student.monthly_payment;
        this.weeklySessionCount=this.student.training_session_ids.length;
        this.date=this.student.enrollment_date; 
      }
    );
  }
}
