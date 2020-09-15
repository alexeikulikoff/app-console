import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { MatTreeModule } from '@angular/material/tree';




type menuItems = Array< { p: number, text: string, q:number } >;

type NodeType = { name : string, p: string, children : Array<NodeType> }



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
  name : "root",
  p : "",
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
 data : menuItems = [
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

  constructor() { 
	
	 this.fill(0, FoodNode );

     TREE_DATA.push(FoodNode);

    this.dataSource.data = TREE_DATA;

     console.log(TREE_DATA);
	this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  
  fill = function(p : number, node : NodeType){
    let items = this.getList(p);
    items.forEach( s => {
      let p1 = s.p;
      let newNode = { name : s.text , p : s.p, children: []};
      node.children.push(newNode);
      this.fill(p1,newNode );
    })
  }

  getRoot = function(arr :  menuItems) : menuItems {

	return  arr.filter(s=> {
		return s.q === 0;
	});
  }

  getList = function( p : number) : menuItems {

	return  this.data.filter(s => {
		return s.q === p;
	});
  }

  accessButton(newparam : HTMLInputElement):boolean{
    console.log(newparam);
    return false;
  }


}
