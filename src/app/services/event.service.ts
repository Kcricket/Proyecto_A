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
  where,
  onSnapshot
} from '@angular/fire/firestore';
import { filter, from, Observable, of, switchMap } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

//import { Subject } from 'rxjs/Subject';
import { Reserva } from '../models/reserva';
import { Evento } from '../models/event';
import { AuthenticationService } from './authentication.service';
import { getFirestore } from "firebase/firestore";
import { Auth, authState} from '@angular/fire/auth'
import * as firebase from '../../environments/environment';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  db = getFirestore();
  user$= this.authenticationService.currentUser$;
  public thisUserReservas :Reserva[]= [];
  availableExercises: Reserva[] = [];


  constructor(private toast: HotToastService, private firestore: Firestore, private authenticationService: AuthenticationService, private auth: Auth, private dbx: AngularFirestore) { 
    //this.itemDoc = dbx.doc<Reserva>('usuarios/6OXD9KvkjReEsrWeIhIvGlTdnWv1');
  }
  fetchAvailableExercises() {
    this.dbx
      .collection('usuarios/6OXD9KvkjReEsrWeIhIvGlTdnWv1/reservasUsuario')
      .snapshotChanges()
      .pipe(map((docArray: any[]) => {
        return docArray.map(doc => {
          return {
            nombreE: doc.payload.doc.id,
            nombreA: doc.payload.doc.data()['nombreA'],

          };
        });
      }))
      .subscribe((exercises: Reserva[]) => {
        this.availableExercises = exercises;
        //this.exercisesChanged.next([...this.availableExercises]);
      });
  }
  

  // get currentUserProfile$(): Observable<Reserva | null> {
  //   return this.authenticationService.currentUser$.pipe(
  //     switchMap((user) => {
  //       if (!user?.uid) {
  //         return of(null);
  //       }

  //       const ref = doc(this.firestore, 'reservas', user?.uid);
  //       return docData(ref) as Observable<Reserva>;
  //     })
  //   );
  // }

  // async loadThisUserReservations(){
  //   var list:any[] = []
  //   const querySnapshot = await getDocs(collection(this.db, "usuarios/6OXD9KvkjReEsrWeIhIvGlTdnWv1/reservasUsuario"));
  //   querySnapshot.forEach((doc) => {
  //     // doc.data() is never undefined for query doc snapshots
  //     console.log(doc.id, " => ", doc.data());
  //     let x = doc.data()
  //     list.push({uid: doc.id, x})
  //   });
  //   return list
  // }


//ESTE METODO COMPRUEBA SI LA RESERVA EXISTE (PARA QUE NO HAYA DUPLICADOS EN LA BD)
  async sendReserva(currentid:string, user:string, clase:string, email:any, hora:string, day:string){
    //currentid.toString();
    //ESTA VARIABLE BOOL HA SIDO CLAVE PÀRA RESOLVER EL EJERCICIO
    var bool= false 
    const q = query(collection(this.db, `usuarios/${currentid}/reservasUsuario`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(day+clase+hora)
      console.log(doc.data()['diaEvento']+doc.data()['nombreE']+doc.data()['horaE'])
      if(doc.data()['diaEvento']==day && doc.data()['nombreE']==clase && doc.data()['horaE']==hora){
        bool = true
      }
      else {
      }
      console.log(doc.id, " => ", doc.data());
    });
    if(bool==false){
        this.send(currentid, user, clase, email, hora, day)
        this.toast.success(`Has reservado la clase de ${clase} el día ${day} a las ${hora}`)
    }else{
      this.toast.warning("Ya reservaste esta clase!")

    }
    
  }
  //SI EL ANTERIOR METODO LO PERMITE, GUARDA LA RESERVA
  async send(currentid:string, user:string, clase:string, email:any, hora:string, day:string){
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var mesConc = today.getMonth()
    console.log(currentid);
    (await setDoc(doc(this.db, "reserva", dateTime), {
      nombreE: clase,
      horaE: hora,
      nombreA: user,
      emailA: email ,
      fechaReserva: dateTime,
      diaReserva: utc,
      diaEvento: day,
      diaConc: today.getDate(),
      mesConc: mesConc


    })),
    (await setDoc(doc(this.db, "usuarios", currentid, "reservasUsuario", dateTime), {
      uidA: currentid,
      nombreE: clase,
      horaE: hora,
      nombreA: user,
      emailA: email ,
      fechaReserva: dateTime,
      diaReserva: utc,
      diaEvento: day,
      diaConc: today.getDate(),
      mesConc: mesConc
    }));
  }

  // get currentEvents$(): Observable<Evento | null> {
  //   return this.authenticationService.currentUser$.pipe(
  //     switchMap((user) => {
  //       if (!user?.uid) {
  //         return of(null);
  //       }
  //       const q = query(collection(this.firestore, "evento"));
  //       const ref = doc(this.firestore, 'evento', user?.uid);
  //       return docData(q) as Observable<Evento>;
  //     })
  //   );
  // }

  // updateEvent(event: Evento): Observable<void> {
  //   const ref = doc(this.firestore, 'eventos', event.uidE);
  //   return from(updateDoc(ref, { ...event }));
  // }


  getHorario(){
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // User logged in already or has just logged in.
        console.log(user.uid)

        // this.dbx
        //   .collection("usuarios")
        //   .valueChanges()
        //   .subscribe((reservasx: Reserva[])=>{
        //     this.thisUserReservas= reservasx
        //   })



      } else {
        // User not logged in or has just logged out.
      }
    });

   }
}
