import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare var Keycloak: any;

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  static auth: any = {};

  static redirectUrl = `http://${environment.ip}:${environment.port}`;

  static init(): Promise<any> {
	
	console.log(environment.keycloakConfig);
	
    const keycloakAuth = new Keycloak(environment.keycloakConfig);

    KeycloakService.auth.loggedIn = false;

    return new Promise((resolve, reject) => {
	
	   
	
      keycloakAuth.init({onLoad: 'login-required'})
      .then(() => {
        KeycloakService.auth.loggedIn = true;
        KeycloakService.auth.authz = keycloakAuth;
        KeycloakService.auth.registerUrl = KeycloakService.auth.authz.createRegisterUrl();

        KeycloakService.auth.logoutUrl = `${keycloakAuth.authServerUrl}/realms/${environment.keycloakConfig.realm}/protocol
        /openid-connect/logout?redirect_uri=${this.redirectUrl}`;

        resolve();
      })
      .catch(() => {
        reject();
      });
    });
  }

  static hasGroup(groupName: string): boolean {
    return KeycloakService.auth.authz != null
      && KeycloakService.auth.authz.authenticated
      && KeycloakService.auth.authz.idTokenParsed.groups.indexOf('/' + groupName) !== -1;
  }

  /**
   * Checks if the logged user is a member of the specified groups
   *
   * @param groupNames a list of group names defined in keycloak
   */
  static hasGroups(groupNames: string[]): boolean {
    if (!groupNames) {
      return false;
    }
    return groupNames.some(e => {
      if (typeof e === 'string') {
        return KeycloakService.hasGroup(e);
      }
    });
  }

  /**
   * Checks if the logged user has the role specified
   *
   * @param roleName The name of the role
   * @param resource The keycloak client
   */
  static hasRole(roleName: string, resource?: string): boolean {
    return KeycloakService.auth.authz.hasRealmRole(roleName)
      || KeycloakService.auth.authz.hasResourceRole(roleName)
      || KeycloakService.auth.authz.hasResourceRole(roleName, resource);
  }

  /**
   * Logout the current user
   */
  static logout() {
    KeycloakService.auth.authz.logout();
    KeycloakService.auth.loggedIn = false;
    KeycloakService.auth.authz = null;
  }

  static getUserName(): string {
    if (KeycloakService.auth.authz.idTokenParsed) {
      const {preferred_username} = KeycloakService.auth.authz.idTokenParsed;
      return preferred_username;
    }
    return null;
  }

  /**
   * Redirects to keycloak login page
   */
  static login() {
    KeycloakService.auth.authz.login();
  }

  /**
   * Returns the token of the currently logged user
   */
  static getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (KeycloakService.auth.authz.token) {
        KeycloakService.auth.authz.updateToken(5)
        .success(() => {
          resolve(KeycloakService.auth.authz.token as string);
        })
        .error(() => {
          reject('Failed to refresh token');
        });
      }
    });
  }

  /**
   * Returns true if the current user is logged in
   */
  static isLogged(): boolean {
    return KeycloakService.auth.authz != null && KeycloakService.auth.authz.authenticated;
  }

  /**
   * Returns keycloak registration url
   */
  static createRegisterUrl() {
    return KeycloakService.auth.registerUrl;
  }

  constructor(
  ) {

  }

}
