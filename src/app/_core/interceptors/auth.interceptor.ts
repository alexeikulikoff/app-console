import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KeycloakService } from '../services/keycloak.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**
   * Intercepts the http request and add the bearer token of the currently logged user.
   *
   * @param request http request
   * @param next http handler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (KeycloakService.auth.authz != null && KeycloakService.auth.loggedIn && KeycloakService.auth.authz.authenticated) {
      KeycloakService.getToken();

      const kcToken = KeycloakService.auth.authz.token;
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + kcToken
        }
      });
    }
    return next.handle(request);
  }
}
