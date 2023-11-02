import { Component } from '@angular/core';
import Docxtemplater from 'docxtemplater';
import * as PizZip from 'pizzip';
import { ActivatedRoute} from '@angular/router';
import { Student } from '../shared/interfaces/student';
import { StudentService } from '../shared/services/student.service';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { spanishFormat } from '../shared/helpers/date_helper';

@Component({
  selector: 'app-document-generator',
  templateUrl: './document-generator.component.html',
  styleUrls: ['./document-generator.component.scss']
})
export class DocumentGeneratorComponent {
  downloadLink: string;
  private id: string;
  student: Student;
  minorAuthorization: boolean = false;
  form: FormGroup;
  constructor(
    public studentApi: StudentService,
    private location: Location,
    private actRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  
  ngOnInit() {
    this.getStudent();
    this.form = this.fb.group({
      completeName: [''],
      CI: [''],
      birthdate: [''],
      birthplace: [''],
      guardianName: [''],
      guardianCI: [''],
      relationship: [''],
    });
  }

  getStudent() {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.studentApi
      .getStudent(this.id)
      .subscribe((data) => {
        this.student = data;
        this.student.completeName = this.studentApi.getCompleteName(this.student);
        this.form.patchValue({
          completeName: this.student.completeName,
          CI: this.student.CI,
          birthdate: this.student.birthdate,
          birthplace: '',  // Necesitarás obtener el lugar de nacimiento de alguna manera
          contactNumbers: '',
          // ... otros campos
        });
        this.setContacts(data.contacts);
      });
  }

  toggleMinorAuthorization() {
    this.minorAuthorization = !this.minorAuthorization;
    this.form.patchValue({
        guardianName: '',
        guardianCI: '',
        relationship: '',
    });
  }
  
  generateDoc(): void {
    // Cargar la plantilla DOCX desde la ubicación especificada
    fetch('../../assets/doc-templates/plantilla-deslinde.docx').then(response => {
      return response.arrayBuffer();
    }).then((content) => {
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip);

      // Obtener los valores del formulario
      const formData = this.form.value;
      const contacts_str = formData.contacts.map((contact) => `${contact.name}: ${contact.phone}`).join('; ');
      const data = {
        nombre_completo: formData.completeName,
        CI: formData.CI,
        fecha_nacimiento: spanishFormat(formData.birthdate),
        lugar_nacimiento: formData.birthplace,
        telefonos_de_contacto: contacts_str,
        nombre_guardian: formData.guardianName,
        CI_guardian: formData.guardianCI,
        relacion: formData.relationship,
      };

      doc.setData(data);
      doc.render();

      const uint8array = doc.getZip().generate({ type: 'uint8array' });
      const blob = new Blob([uint8array], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      this.downloadLink = URL.createObjectURL(blob);

      // Iniciar la descarga inmediatamente
      const a = document.createElement('a');
      a.href = this.downloadLink;
      a.download = `DESLINDE DE RESPONSABILIDADES ${this.form.value.completeName}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
  setContacts(contacts){
    this.form.setControl('contacts',this.fb.array([]));
    const control = <FormArray>this.form.controls['contacts'];
    if(contacts)
      for(let contact of contacts){
        control.push(this.fb.group({
          name: [contact.name],
          phone: [contact.phone]
        }));
      }
  }
  addNewContactField() {
    const control = <FormArray>this.form.controls['contacts'];
    control.push(this.fb.group({
      name: ["", [Validators.required]],
      phone: ["", [Validators.required]]
    }));
  }
  get contacts() {
    return this.form.get('contacts') as FormArray;
  }
  removeContact(index: number) {
    this.contacts.removeAt(index);
  }
  goBack() {
    this.location.back();
  }
}
