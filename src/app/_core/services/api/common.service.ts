import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from '../../models/guid';
import { Utils } from '../../utils';
import { ApiService } from '../sub/api.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private api: ApiService
  ) { }

    public getListSelect(url, id?: Guid, parseId = false): Observable<any> {
    const parsedUrl = parseId ? url.replace('{id}', id) : Utils.getRequestUrl(url);
    return this.api.get(parsedUrl);
  }

  public delete(url, id: any, parentField?: string, parentId?: string): Observable<any> {
    return parentField ? this.api.delete(`${url}?${parentField}=${parentId}&id=${id}`) : this.api.delete(`${url}`);
  }

  public create(data: any, url: string, parentField?: string, parentId?: string): Observable<any> {
    return parentField ? this.api.post(`${url}?${parentField}=${parentId}`, data) : this.api.post(`${url}`, data);
  }

  public update(data: any, url: string): Observable<any> {
    return this.api.put(`${url}`, data);
  }
}
