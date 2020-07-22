import { Component, OnInit } from '@angular/core';
import { LoginService } from '../shell/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.sass']
})
export class AppContainerComponent implements OnInit {
  public pageNavigationPanelOpened: boolean = false;
  public filterPanelOpened: boolean = false;
  public showProgress: boolean = false;

  constructor(private loginService: LoginService,
    private router: Router) { }

  ngOnInit() {
  }

  public togglePageNavigation() {
    this.pageNavigationPanelOpened = !this.pageNavigationPanelOpened;
  }

  public toggleFilterPanel() {
    this.filterPanelOpened = !this.filterPanelOpened;
  }

  public onPageNavigationCloseStart() {
    this.pageNavigationPanelOpened = false;
  }

  public onFilterPanelCloseStart() {
    this.filterPanelOpened = false;
  }

  public logOut(): void {
    this.loginService.logout();
    this.router.navigate(['./login']);
  }

  public onFilterDataLoadStart() {
    this.showProgress = true;
  }

  public onFilterDataLoadEnd() {
    this.showProgress = false;
  }

  public getContentHeight() {
    return window.innerHeight - 56;
  }

  public onNavigationClick() {
    this.onFilterPanelCloseStart();
    this.onPageNavigationCloseStart();
  }

  onFilterChangeHide() {
    this.onFilterPanelCloseStart();
    this.onPageNavigationCloseStart();
  }
}
