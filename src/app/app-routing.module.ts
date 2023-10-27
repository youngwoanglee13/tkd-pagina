import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AddStudentComponent } from './student/add-student/add-student.component';
import { StudentListComponent } from './student/student-list/student-list.component';
import { EditStudentComponent } from './student/edit-student/edit-student.component';
import { StudentComponent } from './student/student/student.component';
import { TrainingSessionListComponent } from './schedule/training-session-list/training-session-list.component';
import { TrainingSessionComponent } from './schedule/training-session/training-session.component';
import { guardGuard } from './guard/guard.guard';
import { EnrollStudentComponent } from './student/enroll-student/enroll-student.component';
import { DebtorsListComponent } from './debtors-list/debtors-list.component';
import { PaymentsListComponent } from './payments-list/payments-list.component';

const routes: Routes = [
  { path : '', redirectTo: '/signin', pathMatch: 'full' },
  { path : 'signin', component: AuthComponent},
  { path: 'register-student', component: AddStudentComponent, canActivate: [guardGuard] },
  { path: 'view-students', component: StudentListComponent, canActivate: [guardGuard] },
  { path: 'view-students/:id', component: StudentComponent, canActivate: [guardGuard] },
  { path: 'edit-student/:id', component: EditStudentComponent,canActivate: [guardGuard] },
  { path : 'schedule', component: TrainingSessionListComponent, canActivate: [guardGuard]},
  { path : 'session/:id', component: TrainingSessionComponent, canActivate: [guardGuard]},
  { path: 'enroll-student/:id', component: EnrollStudentComponent,canActivate: [guardGuard] },
  { path: 'view-debtors', component: DebtorsListComponent,canActivate: [guardGuard] },
  { path: 'view-payments', component: PaymentsListComponent,canActivate: [guardGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
