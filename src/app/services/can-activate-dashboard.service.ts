import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { LoginService } from '../shell/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateDashboardService implements CanActivate {

  constructor(private loginService: LoginService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.loginService.isUserLoggedIn();
  }
}
