import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service'
import {Evento} from './evento'
import { EventService } from '../../services/event.service'
import { doc, setDoc } from "firebase/firestore";
import {Directive, Input, Output, EventEmitter} from '@angular/core';
import {
  collection,
  docData,
  Firestore,
  getDocs,
  updateDoc,
  query, 
  where
} from '@angular/fire/firestore';
import { getFirestore } from "firebase/firestore";
import { filter, from, map, Observable, of, switchMap } from 'rxjs';


//import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  user$ = this.authService.currentUser$;
  date = new Date();
  days: string[] = [];
  today:string= "Hola";
  isButtonDisabled:boolean =false;

  db = getFirestore();
  userReservas: any=[];

  claseswc1: any[] = [];
  claseswc2: any[] = [];

  clasesbjj: any[] = [];
  clasesbjj2: any[] = [];

  clasesesk: any[] = [];

  clasesx: string[] = [];
  //this.date.setDate(1);


  //monthDays = document.querySelector(".days");

  lastDay = new Date(
    this.date.getFullYear(),
    this.date.getMonth() + 1,
    0
  ).getDate();
  
  lastDayIndex = new Date(
    this.date.getFullYear(),
    this.date.getMonth() + 1,
    0
  ).getDay();

    // horario: object = {
    //  d: {dia: "DOMINGO", clases:{}},
    //   l: {dia: "LUNES", clases:{wc: {a: {hora: "17:30", nombre:"Wing Chun"}}, bjj: {a: {hora: "19:30", nombre:"Brazilian Jiu-Jitsu"}, b: {hora: "20:30", nombre:"Brazilian Jiu-Jitsu"}}}},
    //   ma: {dia: "MARTES", clases: {esk: {a: {hora: "19:30", nombre:"Eskrima Concepts"}}, wc: {a:{hora: "21:00", nombre:"Wing Chun"}}}},
    //   mi: {dia: "MIERCOLES", clases: {wc: {a:{hora: "11:00", nombre:"Wing Chun"}, b:{hora: "18:00", nombre:"Wing Chun"}}, bjj: {a: {hora: "19:30", nombre:"Brazilian Jiu-Jitsu"}, b:{hora: "20:30", nombre:"Brazilian Jiu-Jitsu"}}}},
    //   j: {dia: "JUEVES", clases: {esk: {a: {hora: "19:30", nombre:"Eskrima Concepts"}}, wc:{a:{hora: "21:00", nombre:"Wing Chun"}}}},
    //   v: {dia: "VIERNES", clases:{ bjj: {a:{hora: "11:00", nombre:"Brazilian Jiu-Jitsu"}, b: {hora: "20:30", nombre:"Brazilian Jiu-Jitsu"}}, wc: {a: {hora: "12:00", nombre:"Wing Chun"}, b:{hora: "18:00", nombre:"Wing Chun"}}}},
    //   s: {dia: "SABADO", clases:{wc: {a:{hora: "12:00", nombre:"Wing Chun"}}}}
    // }
  nextDays = 7 - this.lastDayIndex - 1;



  constructor(private authService: AuthenticationService, public eventService: EventService) { }
 
    

  nameDay(day:any) {
    switch (day) {
        case 0: 
            return {dia: "Domingo"}
        break;
        case 1:
            return {dia: "LUNES", clases:{wc: {hora: "17:30", nombre:"Wing Chun"}, bjj: {hora: "19:30", nombre:"Brazilian Jiu-Jitsu"}, bjj2: {hora: "20:30", nombre:"Brazilian Jiu-Jitsu"}}}
        break;
        case 2: 
            return {dia: "MARTES", clases: {esk: {hora: "19:30", nombre:"Eskrima Concepts"}, wc:{hora: "21:00", nombre:"Wing Chun"}}}
        break;
        case 3:
            return {dia: "MIERCOLES", clases: {wc: {hora: "11:00", nombre:"Wing Chun"}, wc2:{hora: "18:00", nombre:"Wing Chun"}, bjj:{hora: "19:30", nombre:"Brazilian Jiu-Jitsu"}, bjj2:{hora: "20:30", nombre:"Brazilian Jiu-Jitsu"}}}
        break;
        case 4: 
            return {dia: "jUEVES", clases: {esk: {hora: "19:30", nombre:"Eskrima Concepts"}, wc: {hora: "21:00", nombre:"Wing Chun"}}}
        break;
        case 5: 
            return  {dia: "VIERNES", clases:{ bjj: {hora: "11:00", nombre:"Brazilian Jiu-Jitsu"}, bjj2: {hora: "20:30", nombre:"Brazilian Jiu-Jitsu"}, wc: {hora: "12:00", nombre:"Wing Chun"}, wc2:{hora: "18:00", nombre:"Wing Chun"}}}
        break;
        case 6:
            return {dia: "SABADO", clases:{wc: {hora: "12:00", nombre:"Wing Chun"}}}
        break;
    }
  }
  getDayByDate(day:any){
    //console.log(day)
    var datex = new Date();
    datex.setDate(day);
    console.log(datex.getDate())
    //this.horario[2].clases.wc[1].nombre
    return datex.getDay();
  }

  getClassByIndex(i: number, clase: any){
    if(!clase[i].includes("undefined")){
      return clase[i]
    }else if(clase[i].includes("undefined")){
      return "Nothin";
    }
  }

 async checkHorario(day:string, uid:string, nombre:string, horario:string ){
  var dateNow= new Date()
  var currentDay = "Dia "+dateNow.getDate()+" "+this.nameDay(dateNow.getDay())?.dia
  if(day===currentDay){
    let data:any[] = await this.eventService.getHorario(uid)
    console.log(data)
    data.forEach((element: any) => {
      console.log(day)
        if(element.horaE==horario){
          this.isButtonDisabled = true
        }else{
          this.isButtonDisabled = false
        }
      
    });
  }else{
    this.isButtonDisabled = false
  }
 }

  ngOnInit(): void {

    for (let i = new Date().getDate(); i <= this.lastDay; i++) {
      if (
        i === new Date().getDate() &&
        this.date.getMonth() === new Date().getMonth()
      ) {
        this.days.push("Dia "+i+" "+this.nameDay(this.date.getDay())?.dia);
        this.today = "Dia "+i+" "+this.nameDay(this.date.getDay())?.dia
        this.claseswc1.push({reserva: {nombre: this.nameDay(this.getDayByDate(i))?.clases?.wc?.nombre, hora: this.nameDay(this.getDayByDate(i))?.clases?.wc.hora}});
        this.claseswc2.push({reserva: {nombre: this.nameDay(this.getDayByDate(i))?.clases?.wc2?.nombre, hora: this.nameDay(this.getDayByDate(i))?.clases?.wc2?.hora}});
        this.clasesbjj.push({reserva: {nombre: this.nameDay(this.getDayByDate(i))?.clases?.bjj?.nombre, hora: this.nameDay(this.getDayByDate(i))?.clases?.bjj?.hora}});
        this.clasesbjj2.push({reserva: {nombre: this.nameDay(this.getDayByDate(i))?.clases?.bjj2?.nombre, hora: this.nameDay(this.getDayByDate(i))?.clases?.bjj2?.hora}});
        this.clasesesk.push({reserva: {nombre: this.nameDay(this.getDayByDate(i))?.clases?.esk?.nombre, hora: this.nameDay(this.getDayByDate(i))?.clases?.esk?.hora}});

      } else {
      this.days.push("Dia "+i+" "+this.nameDay(this.getDayByDate(i))?.dia);
      this.claseswc1.push({reserva: {nombre: this.nameDay(this.getDayByDate(i))?.clases?.wc?.nombre, hora: this.nameDay(this.getDayByDate(i))?.clases?.wc.hora}});
      this.claseswc2.push({reserva: {nombre: this.nameDay(this.getDayByDate(i))?.clases?.wc2?.nombre, hora: this.nameDay(this.getDayByDate(i))?.clases?.wc2?.hora}});
      this.clasesbjj.push({reserva: {nombre: this.nameDay(this.getDayByDate(i))?.clases?.bjj?.nombre, hora: this.nameDay(this.getDayByDate(i))?.clases?.bjj?.hora}});
      this.clasesbjj2.push({reserva: {nombre: this.nameDay(this.getDayByDate(i))?.clases?.bjj2?.nombre, hora: this.nameDay(this.getDayByDate(i))?.clases?.bjj2?.hora}});
      this.clasesesk.push({reserva: {nombre: this.nameDay(this.getDayByDate(i))?.clases?.esk?.nombre, hora: this.nameDay(this.getDayByDate(i))?.clases?.esk?.hora}});
      

        //nameDay(getDayByDate(i)).dia
      }
    }
  }

  

}

