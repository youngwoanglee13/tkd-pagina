import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../shared/services/student.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent {
  public editForm: FormGroup;
  private data_fields: String[] = ['firstName', 'middleName', 'lastName', 'secondLastName', 'email', 'birthdate', 'gender', 'grade', 'CI'];
  private  id: string;
  constructor(
    public studentApi: StudentService,
    public fb: FormBuilder,
    private location: Location,
    private router: Router,
    private actRoute: ActivatedRoute,
    public toastr: ToastrService
  ) {}
  ngOnInit() {
    this.updateStudentData();
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.studentApi
      .getStudent(this.id)
      .subscribe((data) => {
        let data_for_form = {}
        for (let key of this.data_fields) {
          if (data.hasOwnProperty(key as PropertyKey)) {
            data_for_form[key as PropertyKey] = data[key as PropertyKey];
          }
        }
        this.editForm.setValue(data_for_form);
      });
  }
  updateStudentData() {
    this.editForm = this.fb.group({
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
  goBack() {
    this.location.back();
  }
  updateForm() {
    this.studentApi.updateStudent(this.editForm.value, this.id);
    this.toastr.success(
      this.editForm.controls['firstName'].value + ' updated successfully'
    );
    this.goBack();
  }
}
