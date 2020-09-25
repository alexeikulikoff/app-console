import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import {
  RoleService
} from '../../app/_core/services/api/roles/roles.service';
import {
  MatTableDataSource
} from '@angular/material/table';
import {
  Observable
} from 'rxjs';
import {
  Roles
} from '../_core/models/dataModels';
import {
  Role
} from '../_core/models/dataModels';
import {
  EditRoleComponent
} from '../dialogs/edit-role/edit-role.component';
import {
  AddRoleComponent
} from '../dialogs/add-role/add-role.component';
import {
  MatDialog
} from '@angular/material/dialog';
import {
  MatSort
} from '@angular/material/sort';


var ELEMENT_DATA: Role[];

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;


  dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['name', 'description', 'id'];

  role: Role;

  constructor(private roleService: RoleService, public dialog: MatDialog) {
    this.reload();

  }

  test_reload(): void {
    console.log('test');
  }
  reload(): void {
    const result: Observable < Roles > = this.roleService.getAllRoles();
    result.subscribe(r => {
      ELEMENT_DATA = r;
      this.dataSource.data = ELEMENT_DATA;
    });
  }
  openEditDialog(): void {
    const dialogEditRef = this.dialog.open(EditRoleComponent, {
      width: '42vw',
      data: {
        id: this.role.id,
        name: this.role.name,
        description: this.role.description
      }
    });

    dialogEditRef.afterClosed().subscribe(result => {
      this.reload();
    });
  }
  openAddRoleDialog(): void {
    const dialogAddRef = this.dialog.open(AddRoleComponent, {
      width: '42vw',
      data: {
        id: '',
        name: '',
        description: ''
      }
    });

    dialogAddRef.afterClosed().subscribe(result => {
      this.reload();
    });
  }
  edit(element: HTMLInputElement): boolean {
    const id = element.value;
    this.role = ELEMENT_DATA.filter(elem => {
      return elem.id === id;
    })[0];
    this.openEditDialog();

    return false;
  }
  delete(element: HTMLInputElement): boolean {

    const roleName: string = ELEMENT_DATA.filter(elem => {
      return elem.id === element.value;
    })[0].name;


    if (window.confirm('Удалить роль ' + roleName + ' ?')) {
      const id: string = element.value;
      const result: Observable < any > = this.roleService.delete(id);
      result.subscribe(r => {
        this.reload();
      });
    }

    return false;
  }

  ngOnInit(): void {

    this.dataSource.data = ELEMENT_DATA;
    this.dataSource.sort = this.sort;

  }

  highlight(row: any) {

  }
}
