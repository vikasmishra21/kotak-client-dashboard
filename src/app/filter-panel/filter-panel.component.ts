import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterService } from '../shell/services/filter.service';
import { FilterConfig } from '../shell/models/filterConfig';
import { FilterConfigService } from '../services/filter-config.service';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.sass']
})
export class FilterPanelComponent implements OnInit {
  public filters: Array<FilterConfig>;
  @Output() onCloseClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(private filterService: FilterService, private filterConfigService: FilterConfigService) {
    this.filters = new Array<FilterConfig>();
  }

  ngOnInit() {
    // console.log(this.filterConfigService);
    this.filterService.getAllFilters().forEach(config => {
      // if (config.variable !== 'v81' && config.variable !== 'v82' && config.variable !== 'v53') {
        this.filters.push(config);
      // }
    });
  }

  public closeFilterPanel(): void {
    this.onCloseClick.emit();
  }

  onFilterChangeHide() {
    this.onCloseClick.emit();
  }
}
