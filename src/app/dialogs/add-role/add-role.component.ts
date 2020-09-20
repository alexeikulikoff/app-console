import { Component, OnInit , Inject, Output, EventEmitter} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddRole, Role } from '../../_core/models/dataModels';
import { RoleService } from '../../_core/services/api/roles/roles.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {

  role: AddRole = { name: '', description: ''};
 
  @Output() myEvent = new EventEmitter();

  constructor(public roleService: RoleService, 
	public dialogRef: MatDialogRef<AddRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role ) { }

  ngOnInit(): void {
  }

  onNoClick(): void{
	this.dialogRef.close();
  }
  save(elemName: HTMLInputElement, elemDecription: HTMLInputElement):void{
	
	const role: AddRole = { name: elemName.value, description: elemDecription.value};
	if (role.name.length > 0){
		var res: Observable<any> = this.roleService.save(role);
		res.subscribe(r=>{
			 this.myEvent.emit(null);	
			 this.dialogRef.close();	
		});
		
	}

	
  }
}
