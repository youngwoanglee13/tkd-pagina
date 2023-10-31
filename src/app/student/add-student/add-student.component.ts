import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../shared/services/student.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentComponent implements OnInit {
  public studentForm: FormGroup;
  constructor(
    public studentApi: StudentService,
    public fb: FormBuilder,
    private location: Location,
    public toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit() {
    this.studenForm();
  }
  studenForm() {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: ['', [Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      secondLastName: ['', [Validators.minLength(2)]],
      email: [
        '',
        [
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      birthdate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      grade: ['', [Validators.required]],
      CI: ['',],
      // mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }
  ResetForm() {
    this.studentForm.reset();
  }
  submitStudentData() {
    if (this.studentForm.invalid) {
      alert('* Llenar todos los campos obligatorios');
      return;
    }
    this.studentApi.addStudent(this.studentForm.value).then((res) => {
      this.toastr.success(
        this.studentForm.controls['firstName'].value + ' successfully added!'
      );
      this.ResetForm();
      this.router.navigate(['/view-students', res.id]);
    });
  }
  goBack() {
    this.location.back();
  }
}