import { Component, OnInit } from '@angular/core';
import { Student } from '../shared/interfaces/student';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../shared/services/student.service';
import { calculateAge } from 'src/app/shared/helpers/date_helper';

@Component({
  selector: 'app-debtors-list',
  templateUrl: './debtors-list.component.html',
  styleUrls: ['./debtors-list.component.scss']
})
export class DebtorsListComponent  implements OnInit {
  p: number = 1;
  students: Student[];
  calculateAge: (birthdate: string) => number;
  constructor(
    public studentApi: StudentService,
    public toastr: ToastrService
    ){ 
      this.calculateAge = calculateAge;
    }

  ngOnInit() {
    this.getStudents();
  }
  async getStudents() {
    await this.studentApi.getDebtors().subscribe(
      (students) => {
        this.students = students;
      },
      error => console.log(error)
    );
  }
}
