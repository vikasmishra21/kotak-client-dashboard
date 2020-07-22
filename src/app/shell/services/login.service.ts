import { Injectable } from '@angular/core';
import { CommunicationService } from './communication.service';

import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { UserInfo } from '../interfaces/user-info';
import { HttpClientUtil } from '../util/httpClient';
import { AfterSessionExpired } from '../interfaces/after-data-fetch';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userInfo: UserInfo;

  constructor(private communicationService: CommunicationService, private http: HttpClientUtil) {
  }

  accessDashboard(username: string, password: string): Observable<void> {
    return this.authenticateUser(username, password)
      .pipe(
        mergeMap(id => this.authorizeToProject(id)),
        mergeMap(() => this.authorizeToDashboard())
      );
  }

  authenticateUser(username: string, password: string): Observable<string> {
    const credentials = `username=${encodeURIComponent(username.toLowerCase())}&password=${encodeURIComponent(password)}`;
    const data = `${credentials}&grant_type=password&applicationname=dashboard`;
    const authURL = this.http.PATHS.BASE_URL + 'oauth/token';
    return this.http.post(authURL, data)
      .pipe(
        map((response: any) => {
          const token = response.access_token;
          this.http.addHeader(this.http.CUSTOM_HEADERS.USER_AUTH, `Bearer ${token}`);
          try {
            this.userInfo = JSON.parse(atob(token.split('.')[1]));
            return this.userInfo.userid;
          } catch (e) {
            return '';
          }
        }));
  }

  authorizeToProject(userID: string): Observable<void> {
    const apiPath = `${this.http.PATHS.PROJECT_URL}users/${userID}/token`;
    return this.http.get(apiPath)
      .pipe(
        map((response: any) => {
          this.http.addHeader(this.http.CUSTOM_HEADERS.PROJECT_AUTH, response.access_token);
        }));
  }

  authorizeToDashboard(): Observable<void> {
    const apiPath = `${this.http.PATHS.PROJECT_URL}dashboards/token`;
    return this.http.get(apiPath)
      .pipe(
        mergeMap((response: any) => {
          this.http.addHeader(this.http.CUSTOM_HEADERS.DASHBOARD_AUTH, response.Signature);
          this.http.saveSession();
          return Observable.create(obs => {
            obs.next();
            obs.complete();
          });
        }),
        mergeMap((response: any) => this.communicationService.populateVariableMap())
      );
  }

  authorizeDashboardWithSessionId(userName, sessionId): Observable<void> {
    const apiPath = `${this.http.PATHS.BASE_URL}v3/oauth/usertoken`;
    const data = {
      username: userName,
      appname: 'dashboard',
      sessiontoken: sessionId
    };

    return this.http.post(apiPath, data)
      .pipe(
        mergeMap((response: any) => {
          const token = response.access_token;
          this.http.addHeader(this.http.CUSTOM_HEADERS.USER_AUTH, `Bearer ${token}`);
          try {
            this.userInfo = JSON.parse(atob(token.split('.')[1]));
            return this.userInfo.userid;
          } catch (e) {
            return '';
          }
        }),
        mergeMap(id => this.authorizeToProject(id)),
        mergeMap(() => this.authorizeToDashboard())
      );
  }

  logout() {
    this.http.removeSession();
  }

  isUserLoggedIn() {
    return this.http.isSessionPresent();
  }

  addOnSessionExpire(callback: AfterSessionExpired) {
    this.http.addOnSessionExpire(callback);
  }

  forgotPassword(user: string) {
    const url = this.http.PATHS.USERS_URL + "?action=forgotpassword_pin&username=" + encodeURIComponent(user);
    return this.http.post(url, undefined, true).pipe(map((response: Response) => {
      if (response.status === 202) {
        window.location.href = this.http.PATHS.PORTAL_URL + "#!ForgotPassword?username=" + encodeURIComponent(user) +
          "&redirecturl=" + encodeURIComponent(window.location.href);
      }
    }));
  }

  getCRN(crn): Observable<any> {
    const url = 'http://10.10.35.31:9001/getcrn/' + crn + '/3'
    return this.http.get(url);
  }
}
