import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilterOption} from '../../../models/filterOption';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent implements OnInit {

  @Input() option: FilterOption;
  @Output() optionSelect: EventEmitter<FilterOption>;

  constructor() {
    this.optionSelect = new EventEmitter();
  }

  ngOnInit() {
  }

  onOptionSelection(option?: FilterOption) {
    if (option) {
      this.optionSelect.emit(option);
    } else {
      this.optionSelect.emit(this.option);
    }

  }

}
