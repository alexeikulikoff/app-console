import { Component, OnInit , Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Role } from '../../_core/models/dataModels';
import { RoleService } from '../../_core/services/api/roles/roles.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {

  constructor(public roleService: RoleService, 
	public dialogRef: MatDialogRef<EditRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role ) { }

  ngOnInit(): void {
  }
  onNoClick(): void{
	this.dialogRef.close();
  }
  save(elemId: HTMLInputElement,elemName: HTMLInputElement, elemDecription: HTMLInputElement):void{
	
	const role: Role = { id: elemId.value, name: elemName.value, description: elemDecription.value};
	
	var res: Observable<any> = this.roleService.update(role);
	res.subscribe(r=>{
		console.log(r);
		
	});
	
	this.dialogRef.close();
  }

}
