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
} from '@angular/fire/firestore';
import { filter, from, map, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userList: any[] = [];
  db = getFirestore();

  constructor(private firestore: Firestore, private authenticationService: AuthenticationService) {}

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
    });

  }
}