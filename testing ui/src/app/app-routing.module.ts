import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';


const routes: Routes = [    
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'customer/dashboard',
    
    component: DashboardComponent
  },
  {
    path: '',  pathMatch:'full',
    redirectTo: 'login'   
  },
  // not found page route
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
