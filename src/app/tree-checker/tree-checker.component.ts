import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, throwError, of} from 'rxjs';
import { MenuNodes, MenuTree, MenuTree2, MenuNode } from '../_core/models/dataModels';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';



const NULL = '00000000-0000-0000-0000-000000000000';
const BASE_URL = environment.serverUrl;
const urlBaseMenu = '/api/guicontroller-auth/base/list';
/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  p: string;
  item: string;
  selected: boolean;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  p: string;
  expandable: boolean;
  selected: boolean;
}



/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
const  NodeList = (menuNodes: MenuNodes, p: string): MenuNodes => {
    let arr =  menuNodes.filter(s => {
      return s.q === p;
    });
	return arr;
  };
const  hasChild = (nodes: MenuNodes , p: string): boolean => {
    
	return nodes.filter(s=> s.q === p).length > 0;
  };

const  fill = (data: MenuNodes, p: string, node: TodoItemNode) => {
    
	 NodeList(data, p).forEach( s => {
        const p1 = s.p;
        const n = new TodoItemNode();
	       n.item = s.name,
		   n.children = [],
           n.p = s.p
		   n.selected = true;
 		node.children.push(n);
        fill(data, p1, n );
    });

  };



/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'tree-checker',
  templateUrl: 'tree-checker.component.html',
  styleUrls: ['tree-checker.component.css'],
  providers: []
})
export class TreeChecklistExample {
	
 
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  node1: TodoItemNode ;

  dbData: MenuNodes;

  dataChange = new BehaviorSubject<TodoItemNode[]>([]);


  get data(): TodoItemNode[] { return this.dataChange.value; }


  constructor( private httpClient: HttpClient ) {
	this.node1 = new TodoItemNode();
	this.node1.item="root",
	this.node1.children = [];
	
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
    this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

     this.dataChange.subscribe(data => {
      	this.dataSource.data = data;
	});

 	
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();

  	flatNode.selected = node.selected;
  	flatNode.p = node.p;
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
	
    return flatNode;
  }

  refreshTree():void{

	this.loadDataNode(this.node1);
	
  }
  loadDataNode( node: TodoItemNode):void{
	
	const http$ = this.httpClient.get<MenuNodes>(`${BASE_URL}${urlBaseMenu}`);
    http$
      .pipe(
        map(res => res),
        catchError(err => {
          console.log('caught mapping error and rethrowing', err.status);
          return throwError(err);
        }),
        catchError(err => {
          console.log('caught rethrown error, providing fallback value', err);
          return of([]);
        })
      )
      .subscribe(
		res => {
			this.dbData = res;
			
			this.updateNode(res,node);
			this.setSelected();
			},
		
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
      )
    ;
	
   }
  setSelected(){
	const tmp = this.dbData.map(d=>{
		return {...d, selected: true}
	});
	this.dbData = tmp;
  }
  updateNode( data: MenuNodes, node: TodoItemNode ){
		fill( data, NULL , node );
		let arr = [];
	 	arr.push(this.node1);
		this.dataChange.next(arr);
				
  }
  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child) ;
    });
	 return descAllSelected || node.selected;
   
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);

  }
  getSelectedNode(p: string){
	const objIndex = this.dbData.findIndex((obj => obj.p === p)); 
	return this.dbData[objIndex].selected;
  }
  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
	console.log(node);
	console.log(this.dbData);
	const objIndex = this.dbData.findIndex((obj => obj.p === node.p));
	console.log(this.dbData[objIndex].selected);
	this.dbData[objIndex].selected = !this.dbData[objIndex].selected;
	console.log(this.dbData[objIndex].selected);
	
	
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
	//node.selected = !node.selected;
	console.log(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child) ;
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    //this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
  //  this._database.updateItem(nestedNode!, itemValue);
  }
}
