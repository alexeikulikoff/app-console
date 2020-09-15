import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-role-selector',
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.css']
})
export class RoleSelectorComponent {
 
 addressForm = this.fb.group({
   
    state: [null, Validators.required],
  });

  selected: number = 1;

  hasUnitNumber = false;

  states = [
    {id : 1, name: 'Alabama', abbreviation: 'AL'},
    {id : 2, name: 'Alaska', abbreviation: 'AK'},
    {id : 3, name: 'American Samoa', abbreviation: 'AS'},
    {id : 4, name: 'Arizona', abbreviation: 'AZ'},
    {id : 5, name: 'Arkansas', abbreviation: 'AR'},
    
  ];

  constructor(private fb: FormBuilder) {}
  
  change( event ) : void{
	  console.log('chabge');
 	  const selectedTown = event;
  	  console.log(selectedTown);
  }
  selectOption(id: number) {
    //getted from event
    console.log(id);
    //getted from binding
    console.log(this.selected)
  }

  onSubmit() {
    console.log();
  }
}
