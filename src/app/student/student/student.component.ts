import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../shared/services/student.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    public studentApi: StudentService,
    private actRoute: ActivatedRoute
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
      });
  }
}
