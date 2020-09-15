import { Component, OnInit, NgModule } from '@angular/core';

@Component({
  selector: 'app-btn-assign',
  templateUrl: './btn-assign.component.html',
  styleUrls: ['./btn-assign.component.css']
})

export class BtnAssignComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  accessButton1(newparam : HTMLInputElement):boolean{
    console.log(newparam);
    return false;
  }
}
