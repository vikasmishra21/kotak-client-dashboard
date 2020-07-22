import { Injectable } from '@angular/core';
import { CommunicationService } from './communication.service';
import { Observable, Subject } from 'rxjs';
import { FilterConfig } from '../models/filterConfig';
import { FilterOption } from '../models/filterOption';
import { map } from 'rxjs/operators';
import { FilterDataSource } from '../enums/filter-data-source';
import { JObject } from '../interfaces/j-object';
import { FilterCascadeOutput } from '../interfaces/filter-cascade-output';
import { FilterType } from '../enums/filter-type';
import { FilterCaching } from '../util/filterCaching';
import { CacheTypes } from '../enums/cache.types';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private jObjectSource: Map<string, JObject>;
  private optionSelectionCallback: Subject<Map<string, Array<FilterOption>>> = new Subject<Map<string, Array<FilterOption>>>();
  private uiUpdaterCallback: Subject<Map<string, Array<FilterOption>>> = new Subject<Map<string, Array<FilterOption>>>();
  optionSelectionCallback$ = this.optionSelectionCallback.asObservable();
  uiUpdaterCallback$ = this.uiUpdaterCallback.asObservable();

  // contains all the filter configurations. Filters will be drawn based on these configs.
  readonly filterConfigurations: Map<string, FilterConfig>;
  private readonly selectedChoices: Map<string, Array<FilterOption>>;

  constructor(private communicationService: CommunicationService) {
    this.filterConfigurations = new Map<string, FilterConfig>();
    this.selectedChoices = new Map<string, Array<FilterOption>>();
    this.jObjectSource = new Map<string, JObject>();
  }

  setJObject(variable: string, obj: JObject) {
    this.jObjectSource.set(variable, obj);
  }

  addFilterConfig(filter: FilterConfig) {
    this.filterConfigurations.set(filter.variable, filter);
  }

  getAllFilters(): Map<string, FilterConfig> {
    return this.filterConfigurations;
  }

  getVisibleFilters(): FilterConfig[] {
    const values = [];
    this.filterConfigurations.forEach(value => {
      if (value.visibility) {
        values.push(value);
      }
    });
    return values;
  }

  getFilterConfig(variable: string): FilterConfig {
    return this.filterConfigurations.get(variable);
  }

  refreshFilters() {
    this.filterConfigurations.forEach(value => value.visibility = true);
  }

  hideFilter(variable: string) {
    this.filterConfigurations.get(variable).visibility = false;
    this.selectedChoices.delete(variable);
    this.sendUpdates(new Map([[variable, new Array<FilterOption>()]]));
  }

  setDefaultChoice(variable: string, choices: FilterOption[]) {
    this.selectedChoices.set(variable, choices);
    const totalDefaults = [];
    this.filterConfigurations.forEach(value => {
      if (value.default.length > 0 && value.visibility) {
        totalDefaults.push(value.variable);
      }
    });
    if (totalDefaults.every(value => this.selectedChoices.has(value))) {
      this.sendUpdates(new Map([[variable, this.selectedChoices.get(variable)]]));
    }
  }

  setChoices(variable: string, choices: FilterOption[]) {
    this.selectedChoices.set(variable, choices);
    const exclusiveVariables = this.filterConfigurations.get(variable).exclusivityWith;
    if (exclusiveVariables && Array.isArray(exclusiveVariables)) {
      exclusiveVariables.forEach(value => {
        if (this.selectedChoices.get(value)) {
          this.selectedChoices.get(value).forEach(choice => choice.isSelected = false);
          this.selectedChoices.set(value, []);
          this.uiUpdaterCallback.next(new Map([[value, this.selectedChoices.get(value)]]));
        }
      });
    }
    this.sendUpdates(new Map([[variable, this.selectedChoices.get(variable)]]));
  }

  removeChoice(variable: string, choice: FilterOption) {
    choice.isSelected = false;
    this.selectedChoices.set(variable, this.selectedChoices.get(variable).filter((val) => {

      if (val.isRemoveBoth) {
        return !val.isRemoveBoth; //condition if true then remove both chip set of same cagegories
      } else {
        return val.code !== choice.code
      }
    }));
    this.sendUpdates(new Map([[variable, this.selectedChoices.get(variable)]]));
  }

  getSelectedChoices(variable: string) {
    return this.selectedChoices.get(variable) || [];
  }

  getAppliedFilters() {
    const appliedFilters: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
    this.selectedChoices.forEach(((value, key) => {
      const isFilter = this.getFilterConfig(key).actAs === FilterType.Filter;
      if (value.length > 0 && isFilter) {
        appliedFilters.set(key, value);
      }
    }));
    return appliedFilters;
  }

  getAppliedTimePeriods() {
    const appliedTimePeriod: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
    this.selectedChoices.forEach(((value, key) => {
      const isTimePeriod = this.getFilterConfig(key).actAs === FilterType.TimePeriod;
      if (value.length > 0 && isTimePeriod) {
        appliedTimePeriod.set(key, value);
      }
    }));
    return appliedTimePeriod;
  }

  getAppliedSeriesSelectors() {
    const appliedSeries: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
    this.selectedChoices.forEach(((value, key) => {
      const isSeries = this.getFilterConfig(key).actAs === FilterType.SeriesSelector;
      if (value.length > 0 && isSeries) {
        appliedSeries.set(key, value);
      }
    }));
    return appliedSeries;
  }


  getFilterData(config: FilterConfig): Observable<FilterCascadeOutput> {
    let req: Observable<any>;
    switch (config.dataSource) {
      case FilterDataSource.FilterCascade:
        req = this.getDataFromAnalysis(config);
        break;
      case FilterDataSource.JObject:
        req = this.getDataFromJObject(config);
        break;
      case FilterDataSource.JsonFile:
        req = this.getDataFromJsonFile(config.dataFilePath);
        break;
      default:
        req = this.getDataFromAnalysis(config);
    }
    return req;
  }

  getFilterDataFromDefinition(filterDefinition): Observable<FilterCascadeOutput> {
    return this.communicationService.getFilterData(filterDefinition);
  }

  private getDataFromAnalysis(config: FilterConfig): Observable<FilterCascadeOutput> {
    const filterSyntax = new Object({
      Key: 'side{' + config.variable + '}',
      Value: ''
    });
    if (FilterCaching.isCached(config.variable)) {
      return Observable.create(
        obs => {
          obs.next(FilterCaching.getCachedData(config.variable));
          obs.complete();
        }
      );
    }
    return this.communicationService.getFilterData(filterSyntax)
      .pipe(map(d => {
        const obj = {
          options: [],
          variableText: ''
        };
        obj.variableText = d[config.variable].text;
        Object.keys(d[config.variable].options || {}).map((code, index) => {
          obj.options[d[config.variable].options[code].sequance] = d[config.variable].options[code];
        });
        obj.options = obj.options.filter(item => {
          return typeof item === 'object';
        });
        FilterCaching.cacheData(config.variable, obj, CacheTypes.InMemory);
        return obj;
      }));
  }

  private getDataFromJsonFile(filePath: string): Observable<FilterCascadeOutput> {
    /*TODO*/
    return this.communicationService.getFile(filePath);
  }

  private getDataFromJObject(config: FilterConfig): Observable<FilterCascadeOutput> {
    return Observable.create(
      obs => {
        if (typeof this.jObjectSource.get(config.variable).getFilteredData === 'function') {
          obs.next(this.jObjectSource.get(config.variable).getFilteredData(config.default));
          obs.complete();
        } else {
          obs.error();
          obs.complete();
        }
      }
    );
  }

  private sendUpdates(update) {
    this.optionSelectionCallback.next(update);
    this.uiUpdaterCallback.next(update);
  }
}
