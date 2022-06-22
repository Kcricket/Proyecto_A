import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service'
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { getFirestore } from "firebase/firestore";
import { ProfileUser } from '../../models/user';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  user$ = this.authService.currentUser$;
  db = getFirestore();
  userList: any[] = [];
  searchInput=""



  //querySnapshot = await getDocs(collection(db, "cities"));
  constructor(private authService: AuthenticationService) { }
  clog(x:any){
    //console.log(x)
  }


  filterNotes(){
    let key= this.searchInput
    var result=[]
    this.userList.forEach(element => {
        element.visible = true
        if(element.x.displayName.includes(key)){
            result.push(element)
        }else{
            element.visible = false
        }
    });
}


  async loadMembers(){
    const querySnapshot = await getDocs(collection(this.db, "usuarios"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      let x = doc.data()
      this.userList.push({name: "doc", x, visible: true})
    });

  }


  ngOnInit(): void {
    this.loadMembers()
  }

}
