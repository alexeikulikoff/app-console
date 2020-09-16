import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  /**
   * Checks if a user is logged in before activating the secured page.
   * @param url
   */
  static checkLogin(url: string): boolean {
    if (KeycloakService.auth.loggedIn && KeycloakService.auth.authz.authenticated) {
      return true;

    } else {
      KeycloakService.login();
      return false;
    }
  }

  constructor(public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return AuthGuard.checkLogin(url);
  }

  /**
   * @param route The route
   */
  canLoad(route: Route): boolean {
    if (!(KeycloakService.auth.loggedIn && KeycloakService.auth.authz.authenticated)) {
      KeycloakService.login();
      return false;
    }

    const data = route.data['Permission'];

    console.log(data.Role);

    if (data.Role) {
      const hasDefined = KeycloakService.hasRole(data.Role);
      if (hasDefined) {
        return true;
      }

      if (data.RedirectTo) {
        this.router.navigate([data.RedirectTo]);
      }

      return false;

    } else {
      console.log('unrole');

      if (Array.isArray(data.Only) && Array.isArray(data.Except)) {
        throw new Error('Can\'t use both \'Only\' and \'Except\' in route data.');
      }

      if (Array.isArray(data.Only)) {
        const hasDefined = KeycloakService.hasGroups(data.Only);
        if (hasDefined) {
          return true;
        }

        if (data.RedirectTo) {
          this.router.navigate([data.RedirectTo]);
        }

        return false;
      }

      if (Array.isArray(data.Except)) {
        const hasDefined = KeycloakService.hasGroups(data.Except);
        if (!hasDefined) {
          return true;
        }

        if (data.RedirectTo) {
          this.router.navigate([data.RedirectTo]);
        }

        return false;
      }
    }
  }

}
