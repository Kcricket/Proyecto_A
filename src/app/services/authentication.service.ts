import { Injectable } from '@angular/core';
import {   Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
  updateProfile,
  UserInfo,
  UserCredential,
  user, 
  getAuth,
  onAuthStateChanged
} from '@angular/fire/auth'
import { concatMap, filter, first, from, Observable, of, switchMap} from 'rxjs'
import { doc, docData } from "@angular/fire/firestore";
import { getFirestore } from "firebase/firestore";
import { ProfileUser } from '../models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root',
})


export class AuthenticationService {
  
  //Observable de current user 
  // En auth está todo lo que necesito para saber el estado del usuario
  admin:boolean= false;
  db = getFirestore();
  currentUser$ = authState(this.auth);
  private authx = getAuth()
  private user = this.authx.currentUser;
  public trap:string = ""

  //private userIdent: any;

  constructor(private auth: Auth, private authfirebase: AngularFireAuth) {
    
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

  getUid(){
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // User logged in already or has just logged in.
        //console.log(user.uid)
        return user.uid.toString
        //alert(user.uid);
      } else {
        // User not logged in or has just logged out.
        return "no id has been found"
      }
    });
  }
  stateUser(){
    return this.authfirebase.authState
  }
}
