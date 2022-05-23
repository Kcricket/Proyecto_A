import { Component, ViewChild } from '@angular/core';
import { AuthenticationService } from './services/authentication.service'
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular_prueba3';
  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  constructor(public authService: AuthenticationService, private router: Router){

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
}
