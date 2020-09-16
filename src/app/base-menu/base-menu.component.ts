import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { MatTreeModule } from '@angular/material/tree';

import { FormBuilder, Validators } from '@angular/forms';

import { BaseMenuService } from '../_core/services/api/base-menu/service';

import { MenuNodes } from '../../app/_core/models/menuNode';
import { MenuNode }  from '../../app/_core/models/menuNode';

import { Observable } from 'rxjs';

const NULL = "00000000-0000-0000-0000-000000000000";

type menuItems = Array< { p: number, text: string, q: number } >;


type NodeType = { 
	p: string,
  	name: string;
  	image: string;
  	position: number,
  	so : number,
  	url : string,
	q: string
   	children : Array<NodeType> 
}



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

const TREE_DATA = [];

let FoodNode : NodeType = {
	p : "",
	name: "ROOT",
  	image: "",
  	position: 0,
  	so : 0,
  	url : "",
	q : "",
  	children : []
};


/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-base-menu',
  templateUrl: './base-menu.component.html',
  styleUrls: ['./base-menu.component.css']
})

export class BaseMenuComponent {
	
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
	
	
	
	
 data1 : menuItems = [
    {p: 1, text: 'Sentence 1', q: 0},
    {p: 2, text: 'Sentence 2', q: 0},
    {p: 3, text: 'Sentence 3', q: 0},
    {p: 4, text: 'Sentence 4', q: 1},
    {p: 5, text: 'Sentence 5', q: 1},
    {p: 6, text: 'Sentence 6', q: 1},
    {p: 7, text: 'Sentence 7', q: 2},
    {p: 8, text: 'Sentence 9', q: 2},
    {p: 9, text: 'Sentence 10', q: 3},
  	{p: 10, text: 'Sentence 10', q: 9},
  	{p: 11, text: 'Sentence 11', q: 9},
	];


  private _transformer = (node: NodeType, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
 	  p : node.p,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private fb: FormBuilder,  private baseMenuService : BaseMenuService) { 
  
	var nodes: Observable<MenuNodes> =  baseMenuService.getBaseMenu();
  
	nodes.subscribe(data=>{

	 	const NodeList = (menuNodes: MenuNodes, p: string): MenuNodes => {
			return menuNodes.filter(s => {
				return s.q === p;
			});
		 }
		const fill = (data: MenuNodes, p : string, node : NodeType) => {
		
		    NodeList(data, p).forEach( s => {
		      let p1 = s.p;
		      var newNode: NodeType = 
				{	p: s.p,
			  		name: s.name,
			  		image: s.image,
			  		position: s.position,
			  		so : s.so,
			  		url : s.url,
					q: s.q,
			   		children: []
				};
		
		      node.children.push(newNode);

		      fill(data,p1,newNode );
		    })
 		 }
	
	 	fill(data, NULL , FoodNode );
	 	
		TREE_DATA.push(FoodNode);

     	this.dataSource.data = TREE_DATA;
	
	 });
	
  }

   change( event ) : void{
	  console.log('chabge');
 	  this.selected = event;
  	  console.log(this.selected);
	
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  
 

  getRoot = function(arr :  menuItems) : menuItems {

	return  arr.filter(s=> {
		return s.q === 0;
	});
  }

 

  accessButton(newparam : HTMLInputElement):boolean{
    console.log(this.selected);
    console.log(newparam.value);
 	
    return false;
  }
 onSubmit() {
    console.log();
  }

}
