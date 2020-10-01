import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, throwError, of, Observable} from 'rxjs';
import { MenuTree, MenuTree2, MenuNode,  TempNode, Roles } from '../_core/models/dataModels';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Validators, FormBuilder } from '@angular/forms';
import { RoleService } from '../_core/services/api/roles/roles.service';



const NULL = '00000000-0000-0000-0000-000000000000';
const BASE_URL = environment.serverUrl;
const urlBaseMenu = '/api/guicontroller-auth/base/list';
const urlPrefered = '/api/guicontroller-auth/prefered/list';
/**
 * Node for to-do item
 */
export class TodoItempNode {
  children: TodoItempNode[];
  p: string;
  q: string;
  item: string;
  selected: boolean;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  p: string;
  q:string;
  expandable: boolean;
  selected: boolean;
}



/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
const NodeList = (menuNodes: TempNode[], p: string): TempNode[] => {
   return menuNodes.filter(s => s.q === p );
 };

const createTreeNode = (data: TempNode[], p: string, node: TodoItempNode) => {
    
	 NodeList(data, p).forEach( s => {
        const p1 = s.p;
        const n = new TodoItempNode();
	       n.item = s.name;
           n.p = s.p;
           n.q = s.q;
		   n.selected = s.selected;
		   n.children = [];
 		   node.children.push(n);
        createTreeNode(data, p1, n );
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
  
  rolMenuMapForm = this.fb.group({

    role: [null, Validators.required],

  });	
  roles = [];

  flag: boolean;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItempNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItempNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItempNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItempNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  node1: TodoItempNode ;

  dataChange = new BehaviorSubject<TodoItempNode[]>([]);


  get data(): TodoItempNode[] { return this.dataChange.value; }

  uuids: string[];

  constructor( private httpClient: HttpClient, private fb: FormBuilder, private roleService: RoleService, ) {
	this.node1 = new TodoItempNode();
	this.node1.p = '00000000-0000-0000-0000-000000000000';
	this.node1.q = 'NO';
	this.node1.item="root",
	this.node1.selected = true;
	this.node1.children = [];
	
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
    this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

     roleService.getAllRoles().subscribe(r =>{ 
		
		this.roles = r;
		console.log(this.roles);
	 });
 
     this.dataChange.subscribe(data => {
      	this.dataSource.data = data;
	});

 	
  }

  getLevel = (node: TodoItemFlatNode) => node != null ?  node.level: 0;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItempNode): TodoItempNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItempNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();

  	flatNode.selected = node.selected;
  	flatNode.p = node.p;
	flatNode.q = node.q;
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
	
    return flatNode;
  }

  refreshTree():void{

	this.loadBaseMenu(this.node1);
	this.treeControl.expandAll();
	
  }
  loadBaseMenu( node: TodoItempNode):void{
	  const http$ = this.httpClient.get<MenuNode[]>(`${BASE_URL}${urlBaseMenu}`);
      http$
		.pipe(map(res => res))
		.subscribe(res => this.prepareBaseMenu(res,node));
   }
   prepareBaseMenu(res: MenuNode[], node: TodoItempNode){
	
		const baseMenu = res.map(s=>{
			return {...s, selected: false};
		});
		this.loadPreferedMenu(baseMenu, node);
   }
   loadPreferedMenu(baseMenu: MenuNode[], node: TodoItempNode):void{
	
	const http$ = this.httpClient.get<MenuNode[]>(`${BASE_URL}${urlPrefered}`);
    http$
      .pipe(map(res => res))
      .subscribe(res => this.preparePreferedMenu(baseMenu, res, node));
   }

	/**@abstract 
	*
	*   
	* 
	*/
  preparePreferedMenu(baseMenu: MenuNode[], prefered: MenuNode[], node: TodoItempNode){
	
	 const data: TempNode[] = baseMenu.map(base=>{
		return prefered.findIndex(s => s.p === base.p) > -1 ? { p: base.p, q: base.q, name: base.name, selected: true} : { p: base.p, q: base.q, name: base.name, selected: false}; 
	 });
	
	createTreeNode( data, NULL , node );
	const array: TodoItempNode[] = [];
	this.node1.children.forEach(s=>{
		array.push(s);
	})
	this.dataChange.next(array);
	
  }
  
  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
	const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child) ;
    });
	  return descAllSelected ;
   
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);

  }
  
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
	this.toggleChildred(node);
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
  
 	( node.selected && this.checklistSelection.isSelected(node) )? 
				  this.checklistSelection.select(...descendants) : 
				  this.checklistSelection.deselect(...descendants);
	/*
	this.checklistSelection.isSelected(node) ? 
				  this.checklistSelection.select(...descendants) : 
				  this.checklistSelection.deselect(...descendants);

*/
  
    descendants.forEach(child => {
		this.checklistSelection.isSelected(child)
	});
		
    this.checkAllParentsSelection(node);
	
	this.toggleParent(node.p);
	
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {

	const k = this.treeControl.dataNodes.findIndex((t => t.p == node.p));
	this.treeControl.dataNodes[k].selected = !this.treeControl.dataNodes[k].selected;
  
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
 	this.toggleParent(node.p);
  
	let parent: TodoItemFlatNode | null = this.getParentNode(node);
	const descendants = this.treeControl.getDescendants(parent);

	if (descendants != null && descendants.length > 0){
		let flag: boolean = false;
		const i1 = descendants.findIndex((t => t.p == node.p));
		descendants[i1].selected = node.selected;
		descendants.forEach(s=>{
			if (s.selected) flag = true;
		});
		if (!flag){
			
			const j = this.treeControl.dataNodes.findIndex((t => t.p == parent.p));
			this.treeControl.dataNodes[j].selected = flag;
			this.checklistSelection.deselect(parent);
		}

	}
	
  }
  saveAll(){
	this.treeControl.dataNodes.forEach(s=>{
		if (s.selected ){
		  console.log(s);	
		}
		
	})
  }
   change( event ): void{
	 console.log(event);
  }

  findChildren(p: string){
	const list = this.treeControl.dataNodes.filter(s=>s.q === p);
    list.forEach(u=>{
		p = u.p;
		this.uuids.push(p);
		this.findChildren(p);
	})
  }

  toggleChildred = (node: TodoItemFlatNode) => {
	const k = this.treeControl.dataNodes.findIndex((t => t.p == node.p));
	this.treeControl.dataNodes[k].selected = !this.treeControl.dataNodes[k].selected;
	this.uuids = [];
	this.findChildren(node.p);
	this.uuids.forEach(u=>{
		const i = this.treeControl.dataNodes.findIndex((t => t.p == u));
		if (!node.selected){
			this.treeControl.dataNodes[i].selected = node.selected
		}else{
			this.treeControl.dataNodes[i].selected = !this.treeControl.dataNodes[i].selected ;	
		}
	})
   
 }
 toggleParent = (p: string) => {

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
/** Add an item to to-do list
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
	
    const parentNode = this.flatNodeMap.get(node);
    const value: TodoItempNode = {
			p: '',
			q: parentNode.p,
			selected: false,
			item: '',
			children: []
		}
	parentNode.children.push(value);
	this.dataChange.next(this.data);
    this.treeControl.expand(node);
	
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
 	console.log(nestedNode);
	nestedNode.item = itemValue;
	this.dataChange.next(this.data);
 
  //  this._database.updateItem(nestedNode!, itemValue);
  }
  onSubmit() {
      console.log();
  }
}
