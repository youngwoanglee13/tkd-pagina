import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { TrainingSessionListComponent } from './schedule/training-session-list/training-session-list.component';

const routes: Routes = [
  { path : '', redirectTo: '/singin', pathMatch: 'full' },
  { path : 'singin', component: AuthComponent},
  { path : 'schedule', component: TrainingSessionListComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
