import { Injectable } from '@angular/core';
import { FilterConfig } from '../shell/models/filterConfig';
import { FilterType } from '../shell/enums/filter-type';
import { VariableType } from '../shell/enums/variable-type';
import { FilterService } from '../shell/services/filter.service';

@Injectable({
  providedIn: 'root'
})
export class FilterConfigService {
  allFilter: Map<string, FilterConfig> = new Map();

  constructor(private filterService: FilterService) {
    this.allFilter = new Map<string, FilterConfig>();
    this.initializeFilter();
    this.allFilter.forEach(config => this.filterService.addFilterConfig(config));
  }

  initializeFilter() {
    this.allFilter.set('Location', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'v52',
      default: [],
      isNested: false,
      visibility: true,
      placeHolder: 'Location',
      isMultiSelected: true,
      enableSubmitButton: true,
      icon: 'fa fa-map-marker',
      iconColor: '#0095d9'
    });

    this.allFilter.set('Region', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'v57',
      default: [],
      isNested: false,
      visibility: true,
      placeHolder: 'Region',
      isMultiSelected: true,
      enableSubmitButton: true,
      icon: 'fa fa-globe',
      iconColor: '#22B14C'
    });

    this.allFilter.set('PSM', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'v56',
      default: [],
      isNested: false,
      visibility: true,
      placeHolder: 'PSM',
      isMultiSelected: true,
      enableSubmitButton: true,
      icon: 'fa fa-user',
      iconColor: '#7A297B'
    });

    this.allFilter.set('No. of POS machines', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'v66',
      default: [],
      isNested: false,
      visibility: true,
      placeHolder: 'No. of POS machines',
      isMultiSelected: true,
      enableSubmitButton: true,
      icon: 'fa fa-check-square',
      iconColor: '#FF7F27'
    });

    this.allFilter.set('Store Type', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'v65',
      default: [],
      isNested: false,
      visibility: true,
      placeHolder: 'Store Type',
      isMultiSelected: true,
      enableSubmitButton: true,
      icon: 'fa fa-archive',
      iconColor: '#880015'
    });

    this.allFilter.set('Main Reason', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'v6',
      default: [],
      isNested: false,
      visibility: true,
      placeHolder: 'Main Reason',
      isMultiSelected: true,
      enableSubmitButton: true,
      icon: 'fa fa-check',
      iconColor: '#002060'
    });

    this.allFilter.set('NPS Category', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'v5',
      default: [],
      isNested: false,
      visibility: true,
      placeHolder: 'NPS Category',
      isMultiSelected: true,
      enableSubmitButton: true,
      icon: 'fa fa-tasks',
      iconColor: '#0095d9'
    });

    this.allFilter.set('Times Visited', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'v33',
      default: [],
      isNested: false,
      visibility: true,
      placeHolder: 'Times Visited',
      isMultiSelected: true,
      enableSubmitButton: true,
      icon: 'fa fa-clock',
      iconColor: '#ffbf00'
    });

    this.allFilter.set('Comments Categories', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'v81',
      default: [],
      isNested: false,
      visibility: true,
      placeHolder: 'Comments Categories',
      enableSubmitButton: true,
      isMultiSelected: true,
      icon: 'fa fa-table',
      iconColor: '#22B14C'
    });

    this.allFilter.set('Branch Code', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'v53',
      default: [],
      isNested: false,
      visibility: true,
      placeHolder: 'Branch Code',
      isMultiSelected: true,
      icon: 'fa fa-asterisk',
      enableSubmitButton: true,
      iconColor: '#A349A4'
    });

    this.allFilter.set('Nature of comment', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'v82',
      default: [],
      isNested: false,
      visibility: false,
      placeHolder: 'Nature of comment',
      isMultiSelected: false,
      icon: 'fa fa-comments',
      iconColor: '#ED1C24'
    });

    this.allFilter.set('Survey Status', {
      actAs: FilterType.Filter,
      type: VariableType.MultiChoice,
      variable: 'SurveyStatus',
      default: ['2'],
      isNested: false,
      visibility: false,
      placeHolder: 'Survey Status',
      isMultiSelected: false,
      icon: 'fa fa-comments',
      iconColor: '#ED1C24'
    });
  }
}
