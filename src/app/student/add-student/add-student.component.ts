import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../shared/services/student.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      alias: ['', [Validators.minLength(2)]],
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
      contacts: this.fb.array([])
    });
  }
  ResetForm() {
    this.studentForm.reset();
    this.contacts.clear();
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
  addNewContactField() {
    const contact = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });
    this.contacts.push(contact);
  }
  get contacts() {
    return this.studentForm.get('contacts') as FormArray;
  }
  removeContact(index: number) {
    this.contacts.removeAt(index);
  }
}