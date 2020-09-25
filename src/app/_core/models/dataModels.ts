

export interface MenuNode {
  p: string,
  name: string;
  image: string;
  position: number,
  so : number,
  url : string,
  q : string,
  isOpen: boolean;
}

export interface MenuNodes extends Array<MenuNode>{}

export interface Role {
  id: string
  name: string;
  description: string;
}
export type MenuTree = {
  children: MenuTree[];
  item: string;
  p: string,
  name: string;
  image: string;
  position: number,
  so : number,
  url : string,
  q : string
 
}

export type MenuTree2 = {
  item: string; 

  children: MenuTree2[];
  
}

export interface Roles extends Array<Role>{}

export interface AddRole {
  
  name: string;
  description: string;
}