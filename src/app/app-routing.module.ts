import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { StartscreenComponent } from './startscreen/startscreen.component';
import { TemplateComponent } from './template/template.component';
import { SummaryComponent } from './summary/summary.component';
import { AddtaskComponent } from './addtask/addtask.component';
import { LegalsComponent } from './legals/legals.component';
import { ContactsComponent } from './contacts/contacts.component';


const routes: Routes = [
  { path: 'summary', component: SummaryComponent },
  { path: 'addtask', component: AddtaskComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'legals', component: LegalsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
