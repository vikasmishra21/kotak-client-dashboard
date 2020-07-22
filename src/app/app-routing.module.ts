import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppContainerComponent } from './app-container/app-container.component';
import { NpsOverviewComponent } from './nps-overview/nps-overview.component';
import { CanActivateDashboardService } from './services/can-activate-dashboard.service';
import { DriversComponent } from './drivers/drivers.component';
import { QueryResolutionComponent } from './query-resolution/query-resolution.component';
import { IndividualDriversComponent } from './individual-drivers/individual-drivers.component';
import { ResponseRateComponent } from './response-rate/response-rate.component';
import { CommentsComponent } from './comments/comments.component';
import { HotAlertsComponent } from './hot-alerts/hot-alerts.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [CanActivateDashboardService],
    component: AppContainerComponent,
    children: [
      { path: 'npsoverview', component: NpsOverviewComponent },
      { path: 'overall-drivers', component: DriversComponent },
      { path: 'drivers/installation', component: IndividualDriversComponent, data: { title: 'Installation', variable: 'v22', icon:'cogs', color: 'rgb(88, 103, 221)' } },
      { path: 'drivers/explanation', component: IndividualDriversComponent, data: { title: 'Explanation', variable: 'v24' ,icon:'info-circle', color: 'rgb(255, 184, 34)'} },
      { path: 'drivers/easeofdocumentation', component: IndividualDriversComponent, data: { title: 'Ease of Documentation', variable: 'v38' ,icon:'file-alt', color: 'rgb(250, 40, 191)'} },
      { path: 'drivers/resolution', component: IndividualDriversComponent, data: { title: 'Resolution', variable: 'v44' ,icon:'user-cog', color: 'rgb(23, 165, 20)'} },
      { path: 'drivers/callcenterresponse', component: IndividualDriversComponent, data: { title: 'Response at Call Center', variable: 'v42',icon:'reply-all', color: 'rgb(0, 149, 217)' } },
      { path: 'drivers/pricingandcharges', component: IndividualDriversComponent, data: { title: 'Pricing and Charges', variable: 'v40',icon:'dollar-sign', color: 'rgb(186, 33, 143)' } },
      { path: 'queryResolution', component: QueryResolutionComponent },
      { path: 'query-resolution/installation', component: IndividualDriversComponent, data: { title: 'Installation', variable: 'v26' ,icon:'cogs', color: 'rgb(88, 103, 221)'} },
      { path: 'query-resolution/servicing', component: IndividualDriversComponent, data: { title: 'Servicing', variable: 'v36' ,icon:'cog', color: 'rgb(253,103,103)' } },
      { path: 'query-resolution/documentation', component: IndividualDriversComponent, data: { title: 'Documentation', variable: 'v34',icon:'file', color: 'rgb(250, 40, 191)' } },
      { path: 'response-rate', component: ResponseRateComponent },
      { path: 'comments', component: CommentsComponent },
      { path: 'hot-alerts', component: HotAlertsComponent },
      { path: '', pathMatch: 'full', redirectTo: 'npsoverview' },
      { path: '**', redirectTo: 'npsoverview' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
