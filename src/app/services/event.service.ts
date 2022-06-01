import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  getDocs,
  setDoc,
  updateDoc,
  query, 
  where
} from '@angular/fire/firestore';
import { filter, from, map, Observable, of, switchMap } from 'rxjs';
import { Reserva } from '../models/reserva';
import { AuthenticationService } from './authentication.service';
import { getFirestore } from "firebase/firestore";
import { Auth, authState} from '@angular/fire/auth'
import * as firebase from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  db = getFirestore();
  user$= this.authenticationService.currentUser$;
  constructor(private firestore: Firestore, private authenticationService: AuthenticationService, private auth: Auth) { }
  get currentUserProfile$(): Observable<Reserva | null> {
    return this.authenticationService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'reservas', user?.uid);
        return docData(ref) as Observable<Reserva>;
      })
    );
  }
  //La informacion de la reserva se guarda en reservas u en usuarios/uid/reservas
  async sendReserva(currentid:string, user:string, clase:string, email:any, hora:string){
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    console.log(currentid);
    //currentid.toString();
    (await setDoc(doc(this.db, "reserva", dateTime), {
      nombreE: clase,
      horaE: hora,
      nombreA: user,
      emailA: email ,
      fechaReserva: dateTime,
      diaReserva: utc

    })),
    (await setDoc(doc(this.db, "usuarios", currentid, "reservasUsuario", dateTime), {
      uidA: currentid,
      nombreE: clase,
      horaE: hora,
      nombreA: user,
      emailA: email ,
      fechaReserva: dateTime,
      diaReserva: utc
    }));
  }

  // async getHorario(){
  //   //let uid = this.user$.uid;
  //   var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
  //   var reservasUserList: object[] = []

  //   const docRef = collection(this.db, "usuarios", uid, "reservasUsuario");
  //   //DEVUELVE LAS RESERVAS DE HOY
  //   const q = query(docRef, where("diaReserva", "==", utc));

  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     // doc.data() is never undefined for query doc snapshots
  //     console.log(doc.id, " => ", doc.data());
  //     reservasUserList.push(doc.data())
  //   });
  //   return reservasUserList;
  //  }
}
