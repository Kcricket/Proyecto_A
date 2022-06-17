import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  getFirestore,
  getDocs,
  setDoc,
  updateDoc,
  query,
  onSnapshot,
} from '@angular/fire/firestore';
import { filter, from, map, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthenticationService } from './authentication.service';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userList: any[] = [];
  db = getFirestore();
  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  constructor(private toast: HotToastService, private firestore: Firestore, private authenticationService: AuthenticationService) {}

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authenticationService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'usuarios', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  addUser(user: ProfileUser): Observable<void> {
      const ref = doc(this.firestore, 'usuarios', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'usuarios', user.uid);
    return from(updateDoc(ref, { ...user }));
  }
//Buena forma de iterar users con objetos
  async loadMembers(list:any[]){
    const querySnapshot = await getDocs(collection(this.db, "usuarios"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      let x = doc.data()
      list.push({uid: doc.id, x})
      console.log(list)
    });

  }


  async sendPago(user:string, currentid:string){
    //currentid.toString();
    //ESTA VARIABLE BOOL HA SIDO CLAVE PÀRA RESOLVER EL EJERCICIO
    var bool= false 
    const q = query(collection(this.db, `usuarios/${currentid}/mesesPagados`));
    const querySnapshot = await getDocs(q);
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {

        if(doc.data()['codigoMes']== new Date().getMonth()){
          bool = true
        }
        else {
        }
        console.log(doc.id, " => ", doc.data());
      });
      if(bool==false){
          this.pagarMesAlumno(user, currentid)
          this.toast.success(`El pago de ${user} re realizó con éxito`)
      }else{
        this.toast.warning(`${user} ya ha pagado este mes`)

      }
    });
    
  }
  async pagarMesAlumno(nombre:string, currentid:string){
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var mesConc = today.getMonth()
    console.log(currentid);
    (await setDoc(doc(this.db, "usuarios", currentid, "mesesPagados", dateTime), {
      nombre: nombre,
      pagadoElDia: utc,
      mesPagado: this.monthNames[today.getMonth()],
      codigoMes:today.getMonth(),
      hora: time
    }));
    
}

}