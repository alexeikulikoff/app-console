import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roles } from '../../../models/dataModels';
import { Role } from '../../../models/dataModels';
import { ApiService } from '../../sub/api.service';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private api: ApiService
  ) { }

 

  public getAllRoles(): Observable<Roles> {
	
	var url: string ='/api/guicontroller-auth/access/getRoles';
	
    return this.api.get(url);
  }
  public update(role: Role) : Observable<any>{
	
	var url: string ='/api/guicontroller-auth/access/role/update';
	
	return this.api.post(url,role);
	
  }

/*
  public create(data: any): Observable<any> {
    return this.api.post(`${CrudPath}/add`, data);
  }

  public update(data: any): Observable<any> {
    return this.api.put(`${CrudPath}/update`, data);
  }

  public delete(id: string ): Observable<any> {
    return this.api.delete(`${CrudPath}/${id}`);
  }
*/
}
