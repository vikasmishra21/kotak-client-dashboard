import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ProjectConfigService } from '../services/project-config.service';
import { AfterSessionExpired } from '../interfaces/after-data-fetch';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {TreeType} from '../enums/tree.type';

@Injectable()
export class HttpClientUtil {
  readonly CUSTOM_HEADERS = {
    USER_AUTH: 'Authorization',
    PROJECT_AUTH: 'x-rc-project_auth_token',
    DASHBOARD_AUTH: 'x-RC-Token'
  };
  readonly PATHS = {
    BASE_URL: '',
    PROJECT_URL: '',
    USERS_URL: '',
    VARIABLE_MAP_URL: '',
    PORTAL_URL: ''
  };
  readonly TREE_TYPES: TreeType[];
  readonly headersValues: {};
  private headers: HttpHeaders;
  private onSessionExpire: AfterSessionExpired;

  constructor(@Inject(ProjectConfigService) private config, private http: HttpClient) {
    /**
     * Defining API for the given project
     */
    this.PATHS.BASE_URL = config.HostPath;
    this.PATHS.VARIABLE_MAP_URL = `${config.HostPath}${config.version}/Projects/packageObject/${config.ProjectID}/`;
    this.PATHS.PROJECT_URL = `${config.HostPath}${config.version}/subscriptions/${config.Subscription}/projects/${config.ProjectID}/`;
    this.PATHS.USERS_URL = `${config.HostPath}${config.version}/users/`;
    this.PATHS.PORTAL_URL = `https://app.rebuscode.com/`;
    this.TREE_TYPES = config.TreeTypes;
    this.headersValues = {};
    this.headers = new HttpHeaders();
    this.initialiseSession();
  }

  initialiseSession() {
    if (!this.headersValues[this.CUSTOM_HEADERS.USER_AUTH] && sessionStorage.getItem(this.CUSTOM_HEADERS.USER_AUTH) != null) {
      this.headersValues[this.CUSTOM_HEADERS.USER_AUTH] = sessionStorage.getItem(this.CUSTOM_HEADERS.USER_AUTH);
    }
    if (!this.headersValues[this.CUSTOM_HEADERS.PROJECT_AUTH] && sessionStorage.getItem(this.CUSTOM_HEADERS.PROJECT_AUTH) != null) {
      this.headersValues[this.CUSTOM_HEADERS.PROJECT_AUTH] = sessionStorage.getItem(this.CUSTOM_HEADERS.PROJECT_AUTH);
    }
    if (!this.headersValues[this.CUSTOM_HEADERS.DASHBOARD_AUTH] && sessionStorage.getItem(this.CUSTOM_HEADERS.DASHBOARD_AUTH) != null) {
      this.headersValues[this.CUSTOM_HEADERS.DASHBOARD_AUTH] = sessionStorage.getItem(this.CUSTOM_HEADERS.DASHBOARD_AUTH);
    }
    this.headers = new HttpHeaders(this.headersValues);
  }

  saveSession() {
    sessionStorage.setItem(this.CUSTOM_HEADERS.USER_AUTH, this.headersValues[this.CUSTOM_HEADERS.USER_AUTH]);
    sessionStorage.setItem(this.CUSTOM_HEADERS.PROJECT_AUTH, this.headersValues[this.CUSTOM_HEADERS.PROJECT_AUTH]);
    sessionStorage.setItem(this.CUSTOM_HEADERS.DASHBOARD_AUTH, this.headersValues[this.CUSTOM_HEADERS.DASHBOARD_AUTH]);
  }

  removeSession() {
    Object.keys(this.CUSTOM_HEADERS).forEach(key => {
      sessionStorage.removeItem(this.CUSTOM_HEADERS[key]);
      const headerKey = this.CUSTOM_HEADERS[key]
      delete this.headersValues[headerKey];
    });
    this.headers = new HttpHeaders();
    if (typeof this.onSessionExpire === 'function') {
      this.onSessionExpire();
    }
  }

  public isSessionPresent() {
    return !!sessionStorage.getItem(this.CUSTOM_HEADERS.USER_AUTH);
  }

  addOnSessionExpire(callback: AfterSessionExpired) {
    this.onSessionExpire = callback;
  }

  addHeader(name, value) {
    this.headersValues[name] = value;
    this.headers = new HttpHeaders(this.headersValues);
  }

  get(url) {
    return this.http.get(url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  post(url, data, response?) {
    const options = { headers: this.headers }
    if (response) {
      options['observe'] = 'response';
    }
    return this.http.post(url, data, options).pipe(
      catchError(this.handleError),
    );
  }

  put(url, data) {
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.status === 401) {
        if (typeof this.onSessionExpire === 'function') {
          this.onSessionExpire();
        }
      }
    }
    // return an observable with a user-facing error message
    return throwError(error.status);
  }
}
