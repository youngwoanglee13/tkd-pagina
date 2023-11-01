import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/student';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../shared/services/student.service';
import { calculateAge } from 'src/app/shared/helpers/date_helper';

@Component({
  selector: 'app-debtors-list',
  templateUrl: './debtors-list.component.html',
  styleUrls: ['./debtors-list.component.scss']
})
export class DebtorsListComponent  implements OnInit {
  p: number = 1;
  students: Student[];
  myStudents: Student[];
  searchTerm: string = '';
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
        this.myStudents = students;
      },
      error => console.log(error)
    );
  }

  searchStudents() {
    // Filter the students based on the search term
    if (this.searchTerm.trim() === '') {
      // If the search term is empty, show all students
      this.reset();
    } else {
      this.students = this.myStudents.filter(student => {
        // You can adjust the condition based on your search criteria
        const fullName = student.firstName + ' ' + student.lastName;
        return fullName.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
  }

  reset()
  {
    this.searchTerm = '';
    this.students = this.myStudents;
  }
}
