import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../shared/services/student.service'
import { Student } from '../../shared/interfaces/student'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  p: number = 1;
  students: Student[];
  hideWhenNoStudent: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;
  
  constructor(
    public studentApi: StudentService,
    public toastr: ToastrService
    ){ }

  ngOnInit() {
    this.getStudents();
  }
  async getStudents() {
    await this.studentApi.getStudents().subscribe(
      (students) => {
        console.log("7894iuj");
        this.students = students;
        console.log(students);
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
}