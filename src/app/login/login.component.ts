import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { LoginService } from '../shell/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, AfterViewInit {
  public credentials = {
    username: '',
    password: ''
  }
  public loginInProcess = false;
  public isSSOLogin = false;
  public displayLoginBlock = true;
  public samlFormModel = {
    url: 'https://sso.kotak.com/adfs/ls/',
    request: '',
    relay: 'kotak'
  };

  @ViewChild('samlForm') samlForm: ElementRef<HTMLFormElement>;
  @ViewChild('submitInput') submitInput: ElementRef<HTMLFormElement>;

  constructor(private loginService: LoginService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.setSSOToken();

    if (this.activatedRoute.snapshot.queryParams.dsid && this.activatedRoute.snapshot.queryParams.user) {
      this.displayLoginBlock = false;

      this.loginService.authorizeDashboardWithSessionId(decodeURIComponent(this.activatedRoute.snapshot.queryParams.user),
        this.activatedRoute.snapshot.queryParams.dsid)
        .subscribe(() => {
          this.router.navigate(['/dashboard/npsoverview']);
        }, (err) => {
          let errorMessage = '';

          if (err === 400) {
            errorMessage = 'Incorrect username or password';
          } else {
            errorMessage = 'Error in login, please try again later';
          }

          this.matSnackBar.open(errorMessage, 'OK');

          // setTimeout(() => {
          //   this.redirectToSSOLogin();
          // }, 2000);
        });
    } else if (location.href.toLowerCase().indexOf('kotakdashboard.azurewebsites.net') !== -1) {
      this.isSSOLogin = true;
      this.displayLoginBlock = false;
    }
  }

  ngAfterViewInit() {
    if (this.isSSOLogin) {
      this.redirectToSSOLogin();
    }
  }

  public login(): void {
    if (!this.credentials.username.trim() || !this.credentials.password) {
      this.matSnackBar.open('Username and password required to login', 'OK');
      return;
    }

    if (this.loginInProcess) {
      return;
    }

    this.credentials.username = this.credentials.username.trim();
    this.credentials.password = this.credentials.password.trim();
    this.loginInProcess = true;

    this.loginService.accessDashboard(this.credentials.username, this.credentials.password)
      .subscribe(() => {
        this.router.navigate(['/dashboard/npsoverview']);
      }, (err) => {
        let errorMessage = '';
        this.loginInProcess = false;

        if (err === 400) {
          errorMessage = 'Incorrect username or password';
        } else {
          errorMessage = 'Error in login, please try again later';
        }

        this.credentials.password = '';
        this.matSnackBar.open(errorMessage, 'OK');
      });
  }

  public onPasswordKeypress(event): void {
    if (event.which === 13) {
      this.login();
    }
  }

  public forgotPassword(): void {
    if (!this.credentials.username.trim()) {
      this.matSnackBar.open('Username required to change the password', 'OK');
      return;
    }

    this.loginInProcess = true;

    this.loginService.forgotPassword(this.credentials.username.trim())
      .subscribe(() => {
        this.loginInProcess = false;
      }, () => {
        this.loginInProcess = false;

        this.matSnackBar.open('Error redirecting to forgot password link', 'OK');
      });
  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  private parseToFormat(date) {
    let format = "yyyy-MM-ddTHH:mm:ssZ";
    let year = date.getFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    let hour = date.getUTCHours();
    let minute = date.getUTCMinutes();
    let sec = date.getUTCSeconds();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    if (hour < 10) {
      hour = '0' + hour;
    }

    if (minute < 10) {
      minute = '0' + minute;
    }

    if (sec < 10) {
      sec = '0' + sec;
    }

    return format.replace('yyyy', year).replace('MM', month).replace('dd', day).
      replace('HH', hour).replace('mm', minute).replace('ss', sec);
  }

  private setSSOToken() {
    let date = this.parseToFormat(new Date());
    let id = 'kotak-' + this.guid().substr(1);
    let token = '<samlp:AuthnRequest xmlns="urn:oasis:names:tc:SAML:2.0:assertion" ID="' + id +
      '" Version="2.0" IssueInstant="' + date +
      '" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">' +
      '<Issuer xmlns="urn:oasis:names:tc:SAML:2.0:assertion">https://api-live.rebuscode.com</Issuer>' +
      '</samlp:AuthnRequest>';
    this.samlFormModel.request = btoa(token);
  }

  private redirectToSSOLogin() {
    setTimeout(() => {
      this.submitInput.nativeElement.click();
    }, 1000);
  }

}
