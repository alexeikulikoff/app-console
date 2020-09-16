import { Component,Output,EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { bindMenuRole } from '../actions/base-menu.action';

import * as reduser from '../reducers';

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

  constructor(private fb: FormBuilder, private store: Store<reduser.State>) {}
  
  change( event ) : void{
	  console.log('chabge');
 	  const selectedTown = event;
  	  console.log(selectedTown);
	  this.store.dispatch(bindMenuRole({ menuId: '123', roleId: '45655' }))
	 
	
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
