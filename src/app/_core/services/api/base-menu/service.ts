import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuNode } from '../../../models/dataModels';
import { ApiService } from '../../sub/api.service';

const rootPath = '/api/water_sources';
const basePath = `${rootPath}/water_supply_registry`;
const description = `${rootPath}/structure`;
const CrudPath = `${basePath}`;
const GetCardStructure = `${description}`;
const GetRegistry = `${description}`;
const GetList = `${basePath}/registry/list`;

@Injectable({
  providedIn: 'root'
})
export class BaseMenuService {

  constructor(
    private api: ApiService
  ) { }

 

  public getBaseMenu(): Observable<MenuNode[]> {
	
	var url: string ='/api/guicontroller-auth/base/list';
	
    return this.api.get(url);
  }
  public assignMenu(nodeid: string, roleid: string ): Observable<MenuNode[]> {
	
	var url: string ='/api/guicontroller-auth/base/assign?nodeid=' + nodeid + '&roleid=' + roleid;
	
    return this.api.post(url, null);
  }
  public deAssignMenu(nodeid: string, roleId : string){
	
		var url: string ='/api/guicontroller-auth/base/deassign?nodeid=' + nodeid + '&roleid=' + roleId;
	
    	return this.api.post(url, null);
   }


  public create(data: any): Observable<any> {
    return this.api.post(`${CrudPath}/add`, data);
  }

  public update(data: any): Observable<any> {
    return this.api.put(`${CrudPath}/update`, data);
  }

  public delete(id: string ): Observable<any> {
    return this.api.delete(`${CrudPath}/${id}`);
  }
}
