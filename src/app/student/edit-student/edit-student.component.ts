import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../shared/services/student.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent implements OnInit {
  public editForm: FormGroup;
  private data_fields: String[] = ['firstName', 'middleName', 'lastName', 'secondLastName', 'alias', 'email', 'birthdate', 'gender', 'grade', 'CI'];
  private  id: string;
  constructor(
    public studentApi: StudentService,
    public fb: FormBuilder,
    private location: Location,
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
          else {
            data_for_form[key as PropertyKey] = '';
          }
        }
        this.editForm.setValue(data_for_form);
        this.setContacts(data.contacts);
      });
  }
  updateStudentData() {
    this.editForm = this.fb.group({
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
    });
    
  }
  goBack() {
    this.location.back();
  }
  updateForm() {
    if (this.editForm.invalid) {
      alert('* Llenar todos los campos obligatorios');
      return;
    }
    this.studentApi.updateStudent(this.editForm.value, this.id);
    this.toastr.success(
      this.editForm.controls['firstName'].value + ' updated successfully'
    );
    this.goBack();
  }
  setContacts(contacts){
    this.editForm.setControl('contacts',this.fb.array([]));
    const control = <FormArray>this.editForm.controls['contacts'];
    for(let contact of contacts){
      control.push(this.fb.group({
        name: [contact.name, [Validators.required]],
        phone: [contact.phone, [Validators.required]]
      }));
    }
  }
  addNewContactField() {
    const control = <FormArray>this.editForm.controls['contacts'];
    control.push(this.fb.group({
      name: ["", [Validators.required]],
      phone: ["", [Validators.required]]
    }));
  }
  get contacts() {
    return this.editForm.get('contacts') as FormArray;
  }
  removeContact(index: number) {
    this.contacts.removeAt(index);
  }
}
