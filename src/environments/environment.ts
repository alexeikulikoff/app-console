// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  appUrl: 'http://192.168.231.248:4800',
  production: false,
  serverUrl: 'http://172.16.0.157:15444',
  mockUrl: 'assets/mocks/',
  yaApiKey: '3aa58c76-e1b5-4ece-93ac-778cbf194482',
  ip: '192.168.231.93',
  port: '4800',
  keycloakConfig: {
    'url': 'http://172.16.0.157:8180/auth',
    'realm': 'sys101-dev-eureka-main',
    'auth-server-url': 'http://172.16.0.157:8180/auth',
    'ssl-required': 'none',
    'public-client': true,
    'confidential-port': 0,
    'clientId': 'sys101_gui_angular_client_admin'
  }


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
