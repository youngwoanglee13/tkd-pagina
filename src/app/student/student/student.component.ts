import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../shared/services/student.service';
import { ActivatedRoute } from '@angular/router';
import trainingSession from 'src/app/shared/interfaces/training-session.interface';
import { TrainingSessionService } from 'src/app/shared/services/training-session.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  public student: any;
  public fields = [
    { label: 'Nombre Completo', value: 'completeName' },
    { label: 'Email', value: 'email' },
    { label: 'Fecha de Nacimiento', value: 'birthdate' },
    { label: 'Sexo', value: 'gender' },
    { label: 'Grado', value: 'grade' },
    { label: 'CI', value: 'CI' }
  ];
  trainingSessions : trainingSession[] = [];

  constructor(
    public studentApi: StudentService,
    private actRoute: ActivatedRoute,
    private trainingSessionService: TrainingSessionService
  ) {}

  ngOnInit() {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.studentApi
      .getStudent(id)
      .subscribe((data) => {
        this.student = data;
        this.student.completeName = this.student.firstName;
        if(this.student.middleName){
          this.student.completeName += ' ' + this.student.middleName;
        }
        this.student.completeName += ' ' + this.student.lastName;
        if(this.student.secondLastName){
          this.student.completeName += ' ' + this.student.secondLastName;
        }
        this.getTrainingSessions();
      });
    
  }
  async getTrainingSessions(){
    await this.trainingSessionService.getTrainingSessionsByIDs(this.student.training_session_ids).then(
      (sessions) => {
        this.trainingSessions = sessions as trainingSession[];
        console.log(sessions);
      }
    );
  }
}
