import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../shared/services/student.service';
import { ActivatedRoute } from '@angular/router';
import trainingSession from 'src/app/shared/interfaces/training-session.interface';
import { TrainingSessionService } from 'src/app/shared/services/training-session.service';
import { Student } from 'src/app/shared/interfaces/student';
import { Attendance } from 'src/app/shared/interfaces/attendance';
import { AttendanceService } from 'src/app/shared/services/attendance.service';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  public student: Student;
  public fields = [
    { label: 'Nombre Completo', value: 'completeName' },
    { label: 'Código de Estudiante', value: 'code' },
    { label: 'Email', value: 'email' },
    { label: 'Fecha de Nacimiento', value: 'birthdate' },
    { label: 'Sexo', value: 'gender' },
    { label: 'Grado', value: 'grade' },
    { label: 'CI', value: 'CI' }
  ];
  public fieldEnrolled = [
    { label: 'Fecha de Inscripción', value: 'enrollment_date' },
    { label: 'Tipo de Inscripción', value: 'enrollemnt_type' },
    { label: 'Mensualidad', value: 'monthly_payment' },
    { label: 'Deuda', value: 'debt_str'}
  ];
  trainingSessions : trainingSession[] = [];
  attendances: Attendance[] = [];

  constructor(
    public studentApi: StudentService,
    private attendanceApi: AttendanceService,
    private actRoute: ActivatedRoute,
    private trainingSessionService: TrainingSessionService
  ) {}

  ngOnInit() {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.studentApi
      .getStudent(id)
      .subscribe((data) => {
        this.student = data;
        this.student.completeName = this.studentApi.getCompleteName(this.student);
        this.studentApi.getDebt(this.student).subscribe((debt) => {
          this.student.debt_str = debt['str'];
          this.student.debt = debt['val'];
          if(debt['val'] < 0) {
            this.student.debt = -debt['val'];
            if(!this.fieldEnrolled.includes({ label: 'Saldo a favor', value: 'debt'}))
              this.fieldEnrolled.push({ label: 'Saldo a favor', value: 'debt'});
          }
          else { 
            if(this.fieldEnrolled.includes({ label: 'Saldo a favor', value: 'debt'}))
              this.fieldEnrolled.pop();
          }
        });        
        this.getTrainingSessions();
      });
    
      
  }
  async getTrainingSessions(){
    await this.trainingSessionService.getTrainingSessionsByIDs(this.student.training_session_ids).then(
      (sessions) => {
        this.trainingSessions = sessions as trainingSession[];
        console.log(this.trainingSessions);
        this.getAttendances();
      }
    );
  }
  getAttendances() {
    this.attendanceApi.getAttendancesByStudentId(this.student.$id)
      .pipe(
        switchMap((attendances) => {
          return this.trainingSessionService.getTrainingSessions().pipe(
            map((trainingSessions) => {
              return attendances.map(attendance => {
                const session = trainingSessions.find(s => s.id === attendance.training_session_id);
                if (session) {
                  return {
                    ...attendance,
                    dayOfWeek: session.dayOfWeek,
                    startTime: session.startTime,
                    endTime: session.endTime
                  };
                }
                return attendance;
              });
            })
          );
        })
      )
      .subscribe((enrichedAttendances) => {
        this.attendances = enrichedAttendances;
      });
    }
  withdrawStudent(){
    if (window.confirm('Estás seguro que quieres anular la suscripcion de ' + this.student.firstName + '?')) { 
    this.studentApi.withdrawStudent(this.student);
    }
  }


}
