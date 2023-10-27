import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AuthComponent } from './auth/auth.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddStudentComponent } from './student/add-student/add-student.component';
import { EditStudentComponent } from './student/edit-student/edit-student.component';
import { StudentListComponent } from './student/student-list/student-list.component';
import { StudentComponent } from './student/student/student.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr'
import { NgxPaginationModule } from 'ngx-pagination';
import { TrainingSessionListComponent } from './schedule/training-session-list/training-session-list.component';
import { TrainingSessionComponent } from './schedule/training-session/training-session.component';
import { EnrollStudentComponent } from './student/enroll-student/enroll-student.component';
import { DebtorsListComponent } from './debtors-list/debtors-list.component';
import { PaymentsListComponent } from './payments-list/payments-list.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavbarComponent,
    AddStudentComponent,
    EditStudentComponent,
    StudentListComponent,
    StudentComponent,
    TrainingSessionListComponent,
    TrainingSessionComponent,
    EnrollStudentComponent,
    DebtorsListComponent,
    PaymentsListComponent,
    MakePaymentComponent
  ],
  imports: [  
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
