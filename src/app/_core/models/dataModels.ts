

export interface MenuNode {
  p: string,
  name: string;
  image: string;
  position: number,
  so : number,
  url : string,
  q : string
}

export interface MenuNodes extends Array<MenuNode>{}

export interface Role {
  id: string
  name: string;
  description: string;
}
export interface Roles extends Array<Role>{}

export interface AddRole {
  
  name: string;
  description: string;
}