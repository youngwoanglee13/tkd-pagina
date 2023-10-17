import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AddStudentComponent } from './student/add-student/add-student.component';
import { StudentListComponent } from './student/student-list/student-list.component';
import { EditStudentComponent } from './student/edit-student/edit-student.component';
import { StudentComponent } from './student/student/student.component';
import { TrainingSessionListComponent } from './schedule/training-session-list/training-session-list.component';
import { TrainingSessionComponent } from './schedule/training-session/training-session.component';

const routes: Routes = [
  { path : '', redirectTo: '/signin', pathMatch: 'full' },
  { path : 'signin', component: AuthComponent},
  { path: 'register-student', component: AddStudentComponent },
  { path: 'view-students', component: StudentListComponent },
  { path: 'view-students/:id', component: StudentComponent },
  { path: 'edit-student/:id', component: EditStudentComponent },
  { path : 'schedule', component: TrainingSessionListComponent},
  { path : 'session/:id', component: TrainingSessionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
