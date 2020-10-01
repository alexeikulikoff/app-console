import { Component } from '@angular/core';
import { FlatTreeControl} from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseMenuService } from '../_core/services/api/base-menu/service';
import { RoleService } from '../_core/services/api/roles/roles.service';
import { Roles, MenuNode } from '../../app/_core/models/dataModels';
import { Observable } from 'rxjs';
import { RoleMenuService } from '../../app/_core/services/api/role-menu/role-menu.service';
import { ElementRef } from '@angular/core';


const NULL = '00000000-0000-0000-0000-000000000000';

type NodeType = {
  p: string,
  name: string;
  image: string;
  position: number,
  so: number,
  url: string,
  q: string,
  isOpen: boolean,
  children: Array<NodeType>
};


/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */

/*
interface FoodNode {
  name: string;
  children?: FoodNode[];
}
*/


//const TREE_DATA = [];
const TREE_DATA_MAP = [];

const FoodNode: NodeType = {
  p: '',
  name: '/',
  image: '',
  position: 0,
  so: 0,
  url: '',
  q: '',
  isOpen: false,
  children : []
};

const FoodNodeMap: NodeType = {
  p: '',
  name: '/',
  image: '',
  position: 0,
  so: 0,
  url: '',
  q: '',
  isOpen: false,
  children : []
};


/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
 
}


const NodeList = (menuNodes: MenuNode[], p: string): MenuNode[] => {

    let arr =  menuNodes.filter(s => {
      return s.q === p;
    });
	return arr;
};
const fill = (data: MenuNode[], p: string, node: NodeType) => {
   NodeList(data, p).forEach( s => {
       const p1 = s.p;
       const newNode: NodeType = {	p: s.p,
       name: s.name,
       image: s.image,
       position: s.position,
       so : s.so,
       url : s.url,
       q: s.q,
 	   isOpen: true,
       children: []
    };
       node.children.push(newNode);
       fill(data, p1, newNode );
    });
};


@Component({
  selector: 'app-base-menu',
  templateUrl: './base-menu.component.html',
  styleUrls: ['./base-menu.component.css']
})



export class BaseMenuComponent {

  roleId: string;
  menuId: string;
  menuMapId: string;
  menuRoles : MenuNode[];
  flag: boolean;
  TREE_DATA = [];
  data: MenuNode[];

  constructor(private el:ElementRef, private fb: FormBuilder,  private baseMenuService: BaseMenuService, private roleService: RoleService, private roleMenuService: RoleMenuService ) {

 	const nodes: Observable<MenuNode[]> =  baseMenuService.getBaseMenu();
    const roleList: Observable<Roles> = roleService.getAllRoles();
 
	roleList.subscribe(role => {
		this.roles = role;
		this.roleId = this.roles[0].id;
		this.loadRoleMenuMap(this.roleId);
    });

    nodes.subscribe(res => {
	  this.data= res; 
	  this.refreshData();
    });
  
    

	this.flag = true;
 }
 private refreshData(){
	
	  this.TREE_DATA.length = 0;
	  fill(this.data, NULL , FoodNode );
	  this.TREE_DATA.push(FoodNode);
      this.dataSource.data = this.TREE_DATA;
      

}
 roleName: string = '';
 panelOpenState = false;

 rolMenuMapForm = this.fb.group({

    role: [null, Validators.required],

 });

    hasUnitNumber = false;

    roles = [];
  private _transformer = (node: NodeType, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      p : node.p,
      isOpen: node.isOpen,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);



  private _transformerMap = (node: NodeType, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      p : node.p,
      isOpen: node.isOpen,
      level: level,
    };
  }

  treeControlMap = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattenerMap = new MatTreeFlattener(
    this._transformerMap, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  dataSourceMap = new MatTreeFlatDataSource(this.treeControlMap, this.treeFlattenerMap);
 
  toggeItem(p){
	  console.log('toggle box1');
	  console.log(p); 
  }
  checkedCheckBox() : void{
	

   }
  checkClick( p ): void{

	console.log('checked box2');
	console.log(p);
	
  }

   loadRoleMenuMap( roleid: string ){
	  TREE_DATA_MAP.splice(0,TREE_DATA_MAP.length);
	  FoodNodeMap.children = [];

	  const obsRoleMenus : Observable<MenuNode[]> =  this.roleMenuService.getRoleMenus(roleid);
			obsRoleMenus.subscribe(rm => {

				if (rm != null){
					this.menuRoles = rm;
					fill(this.menuRoles, NULL , FoodNodeMap );
		    		TREE_DATA_MAP.push(FoodNodeMap);

				}
				this.dataSourceMap.data = TREE_DATA_MAP;
				this.treeControlMap.expandAll();
		})

  }
  change( event ): void{

	  this.roleId = event.id;
	  this.roleName = event.name;

	  this.loadRoleMenuMap(this.roleId);
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  assignMenu(newparam: HTMLInputElement): boolean{
	this.menuId = newparam.value;

	const result: Observable<any> =  this.baseMenuService.assignMenu(this.menuId,this.roleId);
	result.subscribe(r=>{
		if (r.code == 200){
		   this.loadRoleMenuMap(this.roleId);
		}
	});

    return false;
  }
  deAssignMenu(newparam: HTMLInputElement): boolean{

	this.menuId = newparam.value;
	const result: Observable<any> = this.baseMenuService.deAssignMenu(this.menuId,this.roleId);
	result.subscribe(r=>{
		if (r.code == 200){
		   this.loadRoleMenuMap(this.roleId);
		}
	});
    return false;
  }

  onSubmit() {
      console.log();
  }
 }
