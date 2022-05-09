import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { forkJoin, from, Observable} from 'rxjs';
import { switchMap } from 'rxjs/operators';
//import { ProfileUser } from 'src/app/models/user';
import { AuthenticationService } from '../../services/authentication.service';
//import { UsersService } from 'src/app/services/users.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { collection, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {environment} from "../../../environments/environment"

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}
//export interface Usuario { nombre:string, email:string, dni:string, grado:string }


@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})
export class SingUpComponent implements OnInit {
  // private usersCollection: AngularFirestoreCollection<Usuario>;
  items: Observable<any[]>;

  db = getFirestore();

  signUpForm = new FormGroup(
    {
      nombre: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      dni: new FormControl('', Validators.required),
      grado: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: passwordsMatchValidator() }
  );
  constructor(private authService: AuthenticationService, private router: Router, private toast: HotToastService, afs: AngularFirestore) {  
    this.items = afs.collection('usuarios').valueChanges();
      // this.usersCollection = afs.collection<Usuario>('usuarios');
      // this.items = this.usersCollection.valueChanges();
   }

  ngOnInit(): void {
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  get nombre() {
    return this.signUpForm.get('nombre');
  }
  get grado() {
    return this.signUpForm.get('grado');
  }
  get dni() {
    return this.signUpForm.get('dni');
  }
  // addNewUserData(nombre:string, email:string, dni:string, grado:string){
  //   let usuario :Usuario
  //   usuario = {nombre:nombre, email:email, dni:dni, grado:grado,};
  //   this.usersCollection.add(usuario);
  // }
///Cambiar la variable nombre
  submit() {
    if (!this.signUpForm.valid) {
      return;
    }
    const { nombre, email, password, dni, grado } = this.signUpForm.value;
    this.authService
      .signUp(email, password)
      .pipe(
        // switchMap(({ user: { uid } }) =>
        //   this.usersService.addUser({ uid, email, displaynombre: nombre })
        // ),
        this.toast.observe({
          success: 'Congrats! You are all signed up',
          loading: 'Signing up...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/home']);
      })
      try {
        const docRef = addDoc(collection(this.db, "usuarios"), {
          nombre: nombre,
          email: email,
          dni: dni, 
          grado:grado
        });
        console.log("Document written with ID: ");
      } catch (e) {
        console.error("Error adding document: ", e);
      };

      ;
      //this.addNewUserData(nombre, email, dni, grado);

  }

}
