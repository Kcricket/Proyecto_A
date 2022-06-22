import { Component, ViewChild } from '@angular/core';
import { AuthenticationService } from './services/authentication.service'
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {MatSidenav} from '@angular/material/sidenav';
import { UsersService } from './services/users.service';
import { EventService } from './services/event.service';
import { Auth, authState} from '@angular/fire/auth'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loged= false;
  admin= false;
  title = 'angular_prueba3';
  user$ = this.usersService.currentUserProfile$;

  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  constructor(
    private auth: Auth,
    public authService: AuthenticationService, 
    private router: Router,
    private usersService: UsersService,
    public evServ: EventService
    ){
      this.authService.stateUser().subscribe(res => {
        if(res){
          //console.log("Logged")
          this.loged= true
          if(res.uid=="PwN5ifx8kNVMqzg9jt9RrSejHWW2"){
            this.admin= true
            this.authService.admin=true
            //console.log("Admin Entró a la sala")
          }else{
            this.admin=false
            this.authService.admin=false

          }
        }else{
          //console.log("Not Logged")
          this.loged= false
        }
      })
  }
  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  logout(){
    this.authService.logout().subscribe(() => {
      this.router.navigate([''])
    })
  }
  navigate(route:string){
    this.router.navigate([route])
  }
  ifAdmin(){
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        if(user.uid == "PwN5ifx8kNVMqzg9jt9RrSejHWW2"){
          this.authService.admin = true;
        //alert(user.uid);
        return true
        }else{
          return false
        }
      }

    });
  }
}
