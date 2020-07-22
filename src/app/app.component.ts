import { Component, OnInit } from '@angular/core';
import { Chart } from './shell/models/chart';
import { FilterService } from './shell/services/filter.service';
import { Subject } from 'rxjs';
import { SurveyStatusConfig } from './survey-status';
import { GenericRespondantShare } from './services/generic-respondant-share.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  title = 'kotak-client-dashboard';
  public onDataUpdate: Subject<any> = new Subject<any>();

  public npsChart: Chart;
  public noOfRespondant: number;
  constructor(private filterService: FilterService, private respondant: GenericRespondantShare) { }
  ngOnInit() {
    this.surveyChart();
    this.filterService.optionSelectionCallback$.subscribe(value => {
      setTimeout(() => {
        this.onDataUpdate.next();
      });
    });
  }

  surveyChart() {
    this.npsChart = SurveyStatusConfig.getNPSChartConfig();
    this.npsChart.addCalculationLogic((output) => {
      this.noOfRespondant = 0;
      if (output.Bases.get('Survey Status')[0]) {
        this.noOfRespondant = output.Bases.get('Survey Status')[0] ? output.Bases.get('Survey Status')[0].Score : 0;
      }
      this.respondant.sendRespondant(this.noOfRespondant);
      return output;
    });
  }
}
