import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginService } from '../shell/services/login.service';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.sass']
})
export class DialogBodyComponent implements OnInit {

  public showDetail: boolean = false;
  public resDetail: any;
  public crnValue: any;
  public showLoader: boolean;
  constructor(public dialogRef: MatDialogRef<DialogBodyComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private loginService: LoginService) { }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }

  showDetails() {
    this.showDetail = true;
    this.showLoader = true;
    for (const row of this.data) {
      if (row[0] === 'CRN') {
        this.crnValue = row[1];
      }
    }
    this.loginService.getCRN(this.crnValue)
    .subscribe((data) => {
      this.resDetail = data.payLoad.email_id;
      this.showLoader = false;
      setTimeout(() => {
        this.showDetail = false;
      },5000);
    }, (err) => {
      this.resDetail = 'Error!';
    this.showLoader = false;
    setTimeout(() => {
      this.showDetail = false;
    },5000);
    console.log('Error!');
    });
  }

  getContentWidth() {
    var width = document.getElementById("dataTable").offsetWidth;
    return width;
  }
}
