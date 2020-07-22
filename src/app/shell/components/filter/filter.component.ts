import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FilterOption } from '../../models/filterOption';
import { FilterConfig } from '../../models/filterConfig';
import { FilterService } from '../../services/filter.service';
import { Subject, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BasicUtil } from '../../util/basicUtil';
import { FilterType } from '../../enums/filter-type';
import { TimePeriod } from '../../models/time.period';
import { FilterViewType } from '../../enums/filter-view-type';
import { VariableType } from '../../enums/variable-type';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input()
  get filterConfig(): FilterConfig {
    return this.pFilterConfig;
  }

  set filterConfig(value: FilterConfig) {
    this.pFilterConfig = value;
  }

  @Input()
  get options(): FilterOption[] {
    return this.pOptions;
  }

  set options(value: FilterOption[]) {
    this.pOptions = value;
    setTimeout(() => {
      if (value !== undefined && value.length > 0) {
        this.updateFilter();
      }
    });
  }

  @Output() filterSelection: EventEmitter<object>;
  @ViewChild('limit') limitLabel: ElementRef;

  searchTerm$ = new Subject<string>();
  private pOptions: FilterOption[];
  pFilterConfig: FilterConfig;
  private unSubscribe = new Subject();
  private unSubscribeOptionSelection = new Subject();
  showDropdown: boolean;
  selectedOptions: FilterOption[];
  filteredOptions: FilterOption[];
  searchText: string;
  singleSelectOption: string;
  Gender: boolean;
  Age: boolean;
  MarketQualifier: boolean;
  MarketQualifierList: boolean;
  compareModel: string;
  viewType: FilterViewType;

  get FilterViewTypes() {
    return FilterViewType;
  }
  @Output() filterItemClick = new EventEmitter<any>();

  constructor(private filterService: FilterService) {
    this.singleSelectOption = 'null';
    this.compareModel = '';
    this.filterSelection = new EventEmitter();
    this.selectedOptions = new Array<FilterOption>();
    this.filteredOptions = new Array<FilterOption>();
  }

  ngOnInit() {
    switch (this.pFilterConfig.type) {
      case VariableType.SingleChoice:
        this.viewType = FilterViewType.SelectBox;
        break;

      case VariableType.Numeric:
        this.viewType = FilterViewType.NumericInput;
        const range = {
          from : new FilterOption(),
          to : new FilterOption()
        };
        range.from.code = '';
        range.to.code = '';
        if(this.pFilterConfig.removeBoth){
          range.from.isRemoveBoth = true; //to hide both chip set
          range.to.isRemoveBoth = true;
        }
        this.filteredOptions.push(range.from);
        this.filteredOptions.push(range.to);
        break;

      default:
        this.viewType = FilterViewType.SelectBox;
        break;
    }
    if (this.pFilterConfig.isMultiSelected || this.pFilterConfig.isNested) {
      this.viewType = FilterViewType.CheckBox;
    } else if (this.pFilterConfig.hasTimeComparison) {
      this.viewType = FilterViewType.ComparisonRadio;
    }

    if (this.pOptions === undefined) {
      this.filterService.getFilterData(this.pFilterConfig)
        .subscribe(data => {
          this.populateOptions(this.pFilterConfig.placeHolder || data.variableText, data.options);
        });
    } else {
      this.populateOptions(this.pFilterConfig.placeHolder, this.pOptions);
    }

    this.filterService.uiUpdaterCallback$
      .pipe(takeUntil(this.unSubscribeOptionSelection))
      .subscribe(selectedFilter => {
        if (selectedFilter.keys().next().value === this.pFilterConfig.variable) {
          this.selectedOptions = selectedFilter.get(this.pFilterConfig.variable);
          this.selectedOptions.forEach(value => this.setSelectedOption(this.filteredOptions, value.code));
          if (!this.pFilterConfig.isMultiSelected && !this.pFilterConfig.isNested) {
            if (this.selectedOptions.length === 0) {
              this.singleSelectOption = 'null';
              this.compareModel = 'NaN';
            } else {
              this.singleSelectOption = this.selectedOptions[0].code;
            }
          }
        }
      });

    if (this.filterConfig.isNested || this.filterConfig.isMultiSelected) {
      this.searchTerm$
        .pipe(
          debounceTime(400),
          distinctUntilChanged())
        .subscribe((res: string) => {
          this.searchOptions(res);
        });
    }
  }

  onFilterSelection(selection: any) {
    this.selectedOptions.length = 0;
    this.setSelectedOption(this.filteredOptions, selection);
    if (TimePeriod.PreviousPeriod === parseInt(selection, 10)) {
      TimePeriod.PreviousPeriod = undefined;
    }
    this.filterService.setChoices(this.pFilterConfig.variable, this.selectedOptions);
  }

  onCompareSelection(selection: any) {
    if (this.pFilterConfig.actAs === FilterType.TimePeriod) {
      TimePeriod.PreviousPeriod = parseInt(selection, 10);
    }
    this.filterService.setChoices(this.pFilterConfig.variable, this.selectedOptions);
  }

  onMultipleOptionSelection(option: FilterOption) {
    let indexOfSelectedOption = -1;
    for (let i = 0; i < this.selectedOptions.length; i++) {
      if (this.selectedOptions[i].code === option.code) {
        indexOfSelectedOption = i;
        break;
      }
    }
    if (indexOfSelectedOption > -1) {
      // if (this.filterConfig.minSelectionLimit === this.selectedOptions.length) {
      //   this.limitLabel.nativeElement.classList.add('shake-label');
      //   setTimeout(() => {
      //     this.limitLabel.nativeElement.classList.remove('shake-label');
      //   }, 1000);
      //   return;
      // } else {
      // }
      this.selectedOptions.splice(indexOfSelectedOption, 1);
      this.selectedOptions.map(value => this.removeSelectedOption(this.filteredOptions, option.code));
    } else {
      // if (this.filterConfig.maxSelectionLimit === this.selectedOptions.length) {
      //   this.limitLabel.nativeElement.classList.add('shake-label');
      //   setTimeout(() => {
      //     this.limitLabel.nativeElement.classList.remove('shake-label');
      //   }, 1000);
      //   return;
      // } else {
      // }
      this.setSelectedOption(this.filteredOptions, option.code);
    }
    if (!this.filterConfig.enableSubmitButton) {
      this.filterService.setChoices(this.pFilterConfig.variable, this.selectedOptions);
    }
  }

  onSelectAll() {
    this.selectedOptions.length = 0;
    let limit = 0;
    if (this.pFilterConfig.maxSelectionLimit !== undefined) {
      limit = this.pFilterConfig.maxSelectionLimit;
    } else {
      limit = this.filteredOptions.length;
    }
    for (let i = 0; i < limit; i++) {
      this.filteredOptions[i].isSelected = true;
      this.selectedOptions.push(this.filteredOptions[i]);
    }
    this.filterService.setChoices(this.pFilterConfig.variable, this.selectedOptions);
  }

  onClearAll(broadcastChanges: boolean) {
    this.selectedOptions.map(d => this.removeSelectedOption(this.filteredOptions, d.code));
    this.selectedOptions.length = 0;
    if (broadcastChanges) {
      this.filterService.setChoices(this.pFilterConfig.variable, this.selectedOptions);
    }
  }

  onSubmit() {
    this.filterItemClick.emit();
    if (this.selectedOptions.length > this.filterConfig.maxSelectionLimit
      || this.selectedOptions.length < this.filterConfig.minSelectionLimit) {
      this.limitLabel.nativeElement.classList.add('shake-label');
      setTimeout(() => {
        this.limitLabel.nativeElement.classList.remove('shake-label');
      }, 1000);
      this.showDropdown = false;
    } else {
      this.filterService.setChoices(this.pFilterConfig.variable, this.selectedOptions);
    }
    this.showDropdown = !this.showDropdown;
  }

  onSubmitNumeric(fromValue, toValue){
    this.filteredOptions[0].text = fromValue;
    this.filteredOptions[1].text = toValue;
    const values = [];
    if(fromValue){
      values.push(this.filteredOptions[0]);
    }
    if(toValue){
      values.push(this.filteredOptions[1]);
    }
    this.filterService.setChoices(this.pFilterConfig.variable, values);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    this.searchText = '';
    this.searchTerm$.next('');
  }

  closeDropdown($event) {
    this.showDropdown = false;
    this.searchText = '';
    this.searchTerm$.next('');
  }

  ngOnDestroy(): void {
    /*this.onClearAll(true);*/
    this.unSubscribe.next();
    this.unSubscribe.complete();
    this.unSubscribeOptionSelection.next();
    this.unSubscribeOptionSelection.complete();
  }

  private searchOptions(searchText: string) {
    const search = (text, options) => {
      options = options === null || options === undefined ? [] : options;
      return options.filter(d => {
        d.child = search(text, BasicUtil.deepCopy(d.child));
        return d.text.toLowerCase().indexOf(text.toLowerCase()) > -1 || d.child.length > 0;
      });
    };
    this.filteredOptions = search(searchText, BasicUtil.deepCopy(this.pOptions));
    if (Array.isArray(this.pFilterConfig.hideOptions)) {
      this.pFilterConfig.hideOptions.map(value => this.hideOptions(this.filteredOptions, value));
    }
    this.selectedOptions.map(value => this.setSelectedOption(this.filteredOptions, value.code));
  }

  private checkSelectionLimit() {

  }

  private setSelectedOption(options, code) {
    options.map(d => {
      if (Array.isArray(d.child) && d.child.length > 0) {
        this.setSelectedOption(d.child, code);
      }
      if (d.code === code) {
        d.isSelected = true;
        if (this.selectedOptions.length === 0) {
          this.selectedOptions.push(d);
        } else {
          const isPresent = this.selectedOptions.reduce((prev, curr) => {
            return prev || curr.code === code;
          }, false);
          if (!isPresent) {
            this.selectedOptions.push(d);
          }
        }
      }
    });
    if (this.filterConfig.actAs === FilterType.TimePeriod) {
      if (this.selectedOptions.length > 0) {
        TimePeriod.Variable = this.filterConfig.variable;
        TimePeriod.CurrentPeriod = parseInt(this.selectedOptions[0].code, 10);
        if (this.viewType !== FilterViewType.ComparisonRadio) {
          TimePeriod.PreviousPeriod = TimePeriod.CurrentPeriod - 1;
        }
      }
    }
  }

  private removeSelectedOption(options, code) {
    options.map(d => {
      if (Array.isArray(d.child) && d.child.length > 0) {
        this.removeSelectedOption(d.child, code);
      }
      if (d.code === code) {
        d.isSelected = false;
      }
    });
  }

  private hideOptions(options, code) {
    options.map(d => {
      if (Array.isArray(d.child) && d.child.length > 0) {
        this.hideOptions(d.child, code);
      }
      if (d.code === code) {
        d.isHidden = true;
      }
    });
  }

  private populateOptions(text, options) {
    this.selectedOptions.length = 0;
    this.pFilterConfig.variableText = text;
    this.pOptions = options;
    this.filteredOptions = BasicUtil.deepCopy(this.pOptions);
    if(this.pFilterConfig.type === VariableType.Numeric){
      const range = {
        from : new FilterOption(),
        to : new FilterOption()
      };
      range.from.code = '';
      range.to.code = '';
      if(this.pFilterConfig.removeBoth){
        range.from.isRemoveBoth = true;
        range.to.isRemoveBoth = true;
      }
      this.filteredOptions.push(range.from);
      this.filteredOptions.push(range.to);
    }
    if (this.pFilterConfig.actAs === FilterType.Filter && this.filterService.getSelectedChoices(this.pFilterConfig.variable).length > 0) {
      this.filterService.getSelectedChoices(this.pFilterConfig.variable)
        .map(value => this.setSelectedOption(this.filteredOptions, value.code));
    } else {
      this.pFilterConfig.default.map(value => this.setSelectedOption(this.filteredOptions, value));
    }
    if (Array.isArray(this.pFilterConfig.hideOptions)) {
      this.pFilterConfig.hideOptions.map(value => this.hideOptions(this.filteredOptions, value));
    }
    if (this.selectedOptions.length > 0) {
      if (!this.pFilterConfig.isMultiSelected && !this.pFilterConfig.isNested) {
        this.singleSelectOption = this.selectedOptions[0].code;
      }
      this.filterService.setDefaultChoice(this.pFilterConfig.variable, this.selectedOptions);
    }
  }

  private updateFilter() {
    this.selectedOptions.length = 0;
    this.filteredOptions = BasicUtil.deepCopy(this.pOptions);
    this.pFilterConfig.default.map(value => this.setSelectedOption(this.filteredOptions, value));
    if (Array.isArray(this.pFilterConfig.hideOptions)) {
      this.pFilterConfig.hideOptions.map(value => this.hideOptions(this.filteredOptions, value));
    }
    if (this.selectedOptions.length > 0) {
      if (!this.pFilterConfig.isMultiSelected && !this.pFilterConfig.isNested) {
        this.singleSelectOption = this.selectedOptions[0].code;
      }
      this.filterService.setChoices(this.pFilterConfig.variable, this.selectedOptions);
    }
  }
}
