import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from "./components/landing/landing.component"
import {LoginComponent} from "./components/login/login.component"
import {HomeComponent} from "./components/home/home.component"
import {SingUpComponent} from "./components/sing-up/sing-up.component"

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: LandingComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "singup",
    component: SingUpComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
