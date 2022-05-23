import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  constructor() { }
  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }
  ngOnInit(): void {
  }

}
