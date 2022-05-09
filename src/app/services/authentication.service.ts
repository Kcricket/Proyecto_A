import { Injectable } from '@angular/core';
import {   Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
  updateProfile,
  UserInfo,
  UserCredential, 
} from '@angular/fire/auth'
import { concatMap, from, Observable, of, switchMap} from 'rxjs'



@Injectable({
  providedIn: 'root',
})


export class AuthenticationService {
  
  //Observable de current user 
  // En auth está todo lo que necesito para saber el estado del usuario
  currentUser$ = authState(this.auth)
  constructor(private auth: Auth) {
    
   }

  //methods
  signUp(email:string, password:string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(email:string, password:string){
    return from(signInWithEmailAndPassword(this.auth, email, password));
  } 

  logout(){
    return from(this.auth.signOut())
  }
}
