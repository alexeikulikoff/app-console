import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../app/_core/services/api/roles/roles.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Roles } from '../_core/models/dataModels';
import { Role } from '../_core/models/dataModels';
import { EditRoleComponent } from '../dialogs/edit-role/edit-role.component';
import { MatDialog } from '@angular/material/dialog';


var ELEMENT_DATA: Role[];

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {


  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'description','id'];
 
   role : Role;
  
  constructor( private roleService: RoleService, public dialog: MatDialog) { 
	var result : Observable<Roles> = this.roleService.getAllRoles();
	result.subscribe(r=>{
		console.log(r);
		ELEMENT_DATA  = r;
		this.dataSource.data =  ELEMENT_DATA;
	});
		
  }
   openDialog(): void {
    const dialogRef = this.dialog.open(EditRoleComponent, {
      width: '42vw',
      data: { id: this.role.id, name: this.role.name, description: this.role.description }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  edit( element: HTMLInputElement): boolean{
	let id = element.value;
	this.role = ELEMENT_DATA.filter(elem => {
		return elem.id === id;
	})[0];
	this.openDialog();
	console.log(this.role);
	return false;
  }
  delete( element: HTMLInputElement): boolean{
	console.log(element);
	return false;
  }
  ngOnInit(): void {
	this.dataSource.data =  ELEMENT_DATA;
	
  }

}
