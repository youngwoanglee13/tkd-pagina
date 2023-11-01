import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../shared/services/student.service'
import { Student } from '../../shared/interfaces/student'; 
import { ToastrService } from 'ngx-toastr';
import { calculateAge } from 'src/app/shared/helpers/date_helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  p: number = 1;
  students: Student[];
  private myStudents: Student[];
  searchTerm: string = '';
  accessCode: string = '';
  calculateAge: (birthdate: string) => number;
  constructor(
    public studentApi: StudentService,
    public toastr: ToastrService,
    private router: Router
    ){ 
      this.calculateAge = calculateAge;
    }

  ngOnInit() {
    this.getStudents();
  }
  async getStudents() {
    await this.studentApi.getStudents().subscribe(
      (students) => {
        this.myStudents = students;
        this.students = students;
      },
      error => console.log(error)
    );
  }
  deleteStudent(student) {
    if (window.confirm('Estás seguro que quieres eliminar a ' + student.firstName + '?')) { 
      this.studentApi.deleteStudent(student.$id)
      this.toastr.success(student.firstName + ' Eliminado correctamente!');
    }
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
  accessStudentByCode() {
    const codeNumber = Number(this.accessCode);
    this.studentApi.getStudentByCode(codeNumber).subscribe(
      (student) => {
        if(student) {
          this.router.navigate(['/view-students', student.$id]);
        }
        else {
          this.toastr.error('No se encontró ningún estudiante con ese código');
        }
      },
      error => console.log(error)
    );
  }
  reset()
  {
    this.searchTerm = '';
    this.students = this.myStudents;
  }
}