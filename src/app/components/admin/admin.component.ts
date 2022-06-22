import { Component, OnInit, HostListener } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { ChartType } from './chart-types';
import { AuthenticationService } from '../../services/authentication.service'
import { EventService } from 'src/app/services/event.service';
import { addDoc, collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore";
import { Auth} from '@angular/fire/auth'
import { of, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
export interface PagoMes {
  nombre: string,
  datos:[
    pagadoElDia: string,
    mesPagado: string,
    codigoMes:string,
    hora:string,
    nombre2: string,
  ],
}

declare var google: any;
declare var window: any;
@UntilDestroy()
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
@HostListener('window:resize', ['$event'])

export class AdminComponent implements OnInit {
  db= getFirestore()
  userListx: any[] = [];
  userListAndPagos:any[]= [];
  userListAndPagos2:any[]= [];
  searchInput= ""

  panelOpenState = false;
  usuariosPagados:any[]=[]
  //event$ = this.eventService.currentEvents$;

  profileForm = new FormGroup({
    nombre: new FormControl(''),
    hora: new FormControl(''),
    fecha: new FormControl(''),
    descripcion: new FormControl(''),
  });

  displayedColumns = [
    'nombre',
    'mesPagado',
    'pagadoElDia',

  ];
  ELEMENT_DATA: PagoMes[] = [];
  dataSource = this.ELEMENT_DATA;

  constructor(private eventService: EventService, private toast: HotToastService, private auth:Auth ,public usersService: UsersService, public authService: AuthenticationService) { }

  //result: any;
  ngOnInit(): void {
    //this.loadThisUserPagosService()
    this.loadMembers(this.userListx)
    this.loadMembersPagados(this.usuariosPagados)

    //console.log(this.userListx)
    //console.log(this.userListAndPagos)
    google.charts.load('current', {packages: ['corechart']});
    //google.charts.setOnLoadCallback(this.drawChart);
    //window.onresize = this.setDimensions()
    // this.eventService.currentEvents$
    //   .pipe(untilDestroyed(this), tap(console.log))
    //   .subscribe((event) => {
    //     this.profileForm.patchValue({ ...event });
    //   });

  }

  filterNotes(){
    let key= this.searchInput
    var result=[]
    this.userListx.forEach(element => {
        element.visible = true
        if(element.x.displayName.includes(key)){
            result.push(element)
        }else{
            element.visible = false
        }
    });
}
loadAlumnos(){
  let key= ""
  var result=[]
  this.userListx.forEach(element => {
      element.visible = true
      if(element.x.displayName.includes(key)){
          result.push(element)
      }else{
          element.visible = false
      }
  });
}

  async submit(){
    const {nombre, fecha, hora, descripcion} = this.profileForm.value
    const docRef = await addDoc(collection(this.db, "evento"), {
      name: nombre,
      hora: hora,
      fecha:fecha.toJSON().slice(0,10).replace(/-/g,'/'),
      descripcion:descripcion
    });
  }
  // saveEvent() {
  //   const profileData = this.profileForm.value;
  //   this.eventService
  //     .updateEvent(profileData)
  //     .pipe(
  //       this.toast.observe({
  //         loading: 'Saving profile data...',
  //         success: 'Profile updated successfully',
  //         error: 'There was an error in updating the profile',
  //       })
  //     )
  //     .subscribe();
  // }

    
  async reloadMembers(){
    const querySnapshot = await query(collection(this.db, "usuarios"));

    onSnapshot(querySnapshot, (querySnapshot) => {
      this.userListAndPagos=[];

    querySnapshot.forEach((doc) => {
      this.userListAndPagos.push(
        {
          nombre: doc.data()["displayName"],
          pagos: []
        }
      )

      const q = query(collection(this.db, `usuarios/${doc.id}/mesesPagados`));

      // doc.data() is never undefined for query doc snapshots
      onSnapshot(q, (querySnapshot) => {
        var pagos:any[] = [];
        querySnapshot.forEach((doc2) => {
          for (let index = 0; index < this.userListAndPagos.length; index++) {
            const element = this.userListAndPagos[index];
            // console.log(element.nombre)
            // console.log(doc2.data()["nombre"])

            if(element.nombre == doc2.data()["nombre"]){
              element.pagos.push(
                {
                  nombre2: doc.data()["displayName"],
                  pagadoElDia: doc2.data()["pagadoElDia"],
                  mesPagado: doc2.data()["mesPagado"],
                  codigoMes: doc2.data()["codigoMes"],
                  hora: doc2.data()["hora"],
                }
              ); 
            }
          }
        });
        //console.log(this.userListAndPagos)
        //console.log("Current cities in CA: ", pagos.join(", "));
        let x = doc.data()
        //console.log(list)
        return pagos
    });
  });
  
    });
  }
  
  async loadMembers(list:any[]){
    const querySnapshot = await getDocs(collection(this.db, "usuarios"));

    querySnapshot.forEach((doc) => {
      this.userListAndPagos.push(
        {
          nombre: doc.data()["displayName"],
          pagos: [],
          visible: false
        }
      )

      const q = query(collection(this.db, `usuarios/${doc.id}/mesesPagados`));

      // doc.data() is never undefined for query doc snapshots
        onSnapshot(q, (querySnapshot) => {
        var pagos:any[] = [];
        querySnapshot.forEach((doc2) => {
          for (let index = 0; index < this.userListAndPagos.length; index++) {
            const element = this.userListAndPagos[index];
            // console.log(element.nombre)
            // console.log(doc2.data()["nombre"])

            if(element.nombre == doc2.data()["nombre"]){
              element.pagos.push(
                {
                  nombre2: doc.data()["displayName"],
                  pagadoElDia: doc2.data()["pagadoElDia"],
                  mesPagado: doc2.data()["mesPagado"],
                  codigoMes: doc2.data()["codigoMes"],
                  hora: doc2.data()["hora"],
                }
              ); 
            }
          }
        });
        //console.log(this.userListAndPagos)
        //console.log("Current cities in CA: ", pagos.join(", "));
        let x = doc.data()
        list.push({uid: doc.id, x})
        //console.log(list)
        this.loadMembersPagados(this.userListAndPagos)
        return pagos
        
    });
  });
  

  }


  loadMembersPagados(list:any[]){
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      for (let index2 = 0; index2 < element.pagos.length; index2++) {
        const element2 = element.pagos[index2];
        if(element2.codigoMes == new Date().getMonth()){
          this.userListAndPagos2.push({nombre: element.nombre})
        }
        break;
      }
      
    }

  }
  findMe(name:string){
    for (let index = 0; index < this.userListAndPagos.length; index++) {
      if(this.userListAndPagos[index].nombre == name){
        return this.userListAndPagos[index].pagos
      }
      
    }
  }


  async loadThisUserPagosService(uid:string){
    var pagos:any[]=[]
      if (uid) {
        console.log(uid)
        const q = query(collection(this.db, `usuarios/${uid}/mesesPagados`));
        onSnapshot(q, (querySnapshot) => {
          var cities:any[] = [];
          querySnapshot.forEach((doc) => {
            cities.push(doc.data());
            this.ELEMENT_DATA=pagos
            console.log(this.ELEMENT_DATA)
          });
          console.log("Current cities in CA: ", pagos.join(", "));
          return pagos
        });
        //alert(user.uid);
      } else {
        // User not logged in or has just logged out.
        return "no id has been found"
      }

    return pagos
    
  }
  drawChart(){
    var data = google.visualization.arrayToDataTable([
      ['Element', 'Density', { role: 'style' }],
      ['Copper', 8.94, '#b87333'],            // RGB value
      ['Silver', 10.49, 'silver'],            // English color name
      ['Gold', 19.30, 'gold'],
      ['Platinum', 21.45, 'color: #e5e4e2' ], // CSS-style declaration
   ]);
  //  var chart = new google.visualization.BarChart(document.getElementById("divBarChart"));
  //  chart.draw(data, null)
  
  }
  setDimensions(event:any){
    event.target.innerWidth= "100%";
  }
  


}
