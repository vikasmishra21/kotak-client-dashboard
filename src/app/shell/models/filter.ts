import {FilterGroup} from './filter.group';

export class Filter {
  Name: string;
  Text: string;
  DisplayFilter: string;
  count = -1;
  group: FilterGroup;

  constructor() {
    this.Name = '';
    this.Text = '';
    this.DisplayFilter = '';
    this.group = new FilterGroup();
  }
}
