import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuNode  } from '../../../models/dataModels';
import { ApiService } from '../../sub/api.service';

@Injectable({
  providedIn: 'root'
})
export class RoleMenuService {

  constructor( private api: ApiService) {
	
 	}

  public getRoleMenus(roleId: string): Observable<MenuNode[]> {
	
	var url: string ='/api/guicontroller-auth/role/' + roleId;
	
    return this.api.get(url);
  }

}
