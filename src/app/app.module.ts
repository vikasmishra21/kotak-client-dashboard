import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectConfig } from './shell/interfaces/project-config';
import { TreeType } from './shell/enums/tree.type';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AppContainerComponent } from './app-container/app-container.component';
import { PageListComponent } from './page-list/page-list.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { NpsOverviewComponent } from './nps-overview/nps-overview.component';
import { ContentHeaderComponent } from './content-header/content-header.component';
import { ShellModule } from './shell/shell.module';
import { ProgressLoadingComponent } from './progress-loading/progress-loading.component';
import { FilterConfigService } from './services/filter-config.service';
import { DriversComponent } from './drivers/drivers.component';
import { QueryResolutionComponent } from './query-resolution/query-resolution.component';
import { IndividualDriversComponent } from './individual-drivers/individual-drivers.component';
import { ResponseRateComponent } from './response-rate/response-rate.component';
import { CommentsComponent } from './comments/comments.component';
import { HotAlertsComponent } from './hot-alerts/hot-alerts.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogBodyComponent } from "./dialog-body/dialog-body.component";
import { GenericRespondantShare } from './services/generic-respondant-share.services';

const projectConfig: ProjectConfig = {
  ProjectID: '84048b9b-a6f4-14a1-23c9-59b76477ee28',
  ProjectName: 'Kotak POS',
  DashboardName: 'KotakDashboard',
  DashboardID: 'c1b7aeae-5298-2855-7fec-383dada25823',
  Subscription: '145',
  HostPath: 'https://beta-v3-live-webrole.rebuscode.com/',
  version: 'v3',
  TreeTypes: [TreeType.Survey, TreeType.Sample, TreeType.System, TreeType.Calculated]
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AppContainerComponent,
    PageListComponent,
    FilterPanelComponent,
    NpsOverviewComponent,
    ContentHeaderComponent,
    ProgressLoadingComponent,
    DriversComponent,
    QueryResolutionComponent,
    IndividualDriversComponent,
    ResponseRateComponent,
    CommentsComponent,
    HotAlertsComponent,
    DialogBodyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatTreeModule,
    MatSnackBarModule,
    MatSelectModule,
    FormsModule,
    MatDialogModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    ShellModule.forRoot(projectConfig)
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500, horizontalPosition: 'right', verticalPosition: 'top' } },
    FilterConfigService, GenericRespondantShare
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogBodyComponent]
})
export class AppModule { }
