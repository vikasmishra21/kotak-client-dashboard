import {Component, Input, OnInit} from '@angular/core';
import {FilterOption} from '../../models/filterOption';
import {FilterService} from '../../services/filter.service';
import {FilterConfig} from '../../models/filterConfig';

@Component({
  selector: 'app-filter-chip',
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.css']
})
export class FilterChipComponent implements OnInit {

  @Input() filterOption: FilterOption;
  @Input() variable: string;
  @Input() hideDelete: boolean;
  config: FilterConfig;

  constructor(private filterService: FilterService) {
  }

  ngOnInit() {
    this.config = this.filterService.getFilterConfig(this.variable);
  }

  delete() {
    // remove the filter in Filter service
    this.filterService.removeChoice(this.variable, this.filterOption);
  }

}
