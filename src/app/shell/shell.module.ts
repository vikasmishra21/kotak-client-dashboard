import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartContainerComponent } from './components/chart-container/chart-container.component';
import { FilterComponent } from './components/filter/filter.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OptionComponent } from './components/filter/option/option.component';
import { FilterChipComponent } from './components/filter-chip/filter-chip.component';
import { HttpClientUtil } from './util/httpClient';
import { ProjectConfig } from './interfaces/project-config';
import { ProjectConfigService } from './services/project-config.service';
import { OptionFilterPipe } from './pipes/option-filter.pipe';
import { FilterChipListComponent } from './components/filter-chip-list/filter-chip-list.component';
import { ChartComponent } from './components/chart-container/chart/chart.component';
import { ClickOutsideDirective } from './directive/click-outside-directive';
import { RoundOffPipe } from './pipes/round-off.pipe';
import { BaseHighlighter } from './pipes/base-highlighter.pipe';
import { KpiChartComponent } from './components/kpi-chart/kpi-chart.component';


@NgModule({
  declarations: [
    ChartContainerComponent,
    FilterComponent,
    OptionComponent,
    FilterChipComponent,
    OptionFilterPipe,
    FilterChipListComponent,
    ChartComponent,
    ClickOutsideDirective,
    RoundOffPipe,
    BaseHighlighter,
    KpiChartComponent
  ],
  exports: [
    ChartContainerComponent,
    FilterChipComponent,
    FilterChipListComponent,
    RoundOffPipe,
    BaseHighlighter,
    FilterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
  ]
})
export class ShellModule {

  static forRoot(projectConfig: ProjectConfig): ModuleWithProviders<ShellModule> {
    return {
      ngModule: ShellModule,
      providers: [HttpClientUtil, {
        provide: ProjectConfigService,
        useValue: projectConfig
      }]
    };
  }
}
