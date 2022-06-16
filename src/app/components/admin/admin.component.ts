import { Component, OnInit, HostListener } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { ChartType } from './chart-types';
declare var google: any;
declare var window: any;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
@HostListener('window:resize', ['$event'])


export class AdminComponent implements OnInit {
  userListx: any[] = [];
  panelOpenState = false;


  constructor(public usersService: UsersService) { }


  ngOnInit(): void {
    this.usersService.loadMembers(this.userListx)
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(this.drawChart);
    //window.onresize = this.setDimensions()


  }
  drawChart(){
    var data = google.visualization.arrayToDataTable([
      ['Element', 'Density', { role: 'style' }],
      ['Copper', 8.94, '#b87333'],            // RGB value
      ['Silver', 10.49, 'silver'],            // English color name
      ['Gold', 19.30, 'gold'],
      ['Platinum', 21.45, 'color: #e5e4e2' ], // CSS-style declaration
   ]);
   var chart = new google.visualization.BarChart(document.getElementById("divBarChart"));
   chart.draw(data, null)
  
  }
  setDimensions(event:any){
    event.target.innerWidth= "100%";
  }

}
