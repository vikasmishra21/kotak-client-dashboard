import { Filter } from './filter';
import { VariableMap } from '../interfaces/variable-map';
import { CombineOption } from './combineOption';
import { FilterRuleConfig } from '../interfaces/filter-rule-config';
import { FilterRule } from './filter.rule';
import { Measure } from '../enums/measure';

export class Break {
  private QuestionGUID: string;
  private SelectedVariable: string;
  private SelectedVariableGUID: string;
  private SelectedAttributeGUID: string;
  private SelectedGroupGUID: string;
  private LoopQuestionGUID: string;
  private SectionGUID: string;
  private Measures: Array<number>;
  private UnweightedbaseMeasure: Measure;
  private AxisType: 1;
  private Rolling: {
    RollingType: 2;
    frequency: 1;
    RollPeriod: 0;
    RollData: boolean
  };
  private ShowBase: boolean;
  private ShowUnWeightedBase: boolean;
  private Total: boolean;
  private Display: true;
  private Weight: string;
  private WeightQuestionGuid: string;
  private Clevel: 95;
  private IsContinuityCorrection: boolean;
  private IsGridOverlap: boolean;
  private Filter: Filter;
  private IsSentimentAnalysis: boolean;
  private Command: any;
  private Combine: any;
  private Children: Array<Break>;
  private ShowEffectiveBase: boolean;
  private DisplayNoAnswer: boolean;
  private IsdependentVariable: boolean = false;
  private IsContinousVariable: boolean = true;

  constructor(variableMap: VariableMap, measure: number) {
    for (const i in variableMap) {
      if (!this[i]) {
        this[i] = variableMap[i];
      }
    }
    this.Filter = new Filter();
    this.Measures = [measure];
    this.Children = new Array<Break>();
    this.Combine = {};
    this.Command = {};
    this.ShowEffectiveBase = false;
    this.ShowBase = false;
    this.ShowUnWeightedBase = false;
    this.Total = false;
    this.DisplayNoAnswer = false;
    this.IsContinousVariable = true;
  }

  addNestBreak(nestedBreak: Break) {
    this.Children.push(nestedBreak);
  }

  showOptions(options: number[]) {
    if (options.length > 0) {
      this.Command.Show = options;
      this.Command.Order = options;
    }
  }

  hideOptions(options: number[]) {
    if (options.length > 0) {
      this.Command.Hide = options;
    }
  }

  addCombinedOption(combinedSet: number[], names?: string[]) {
    combinedSet.map((options, index) => {
      const i = Object.keys(this.Combine).length;
      const combine = new CombineOption(options);
      combine.ID = 100001 + i;
      combine.Name = Array.isArray(names) ? (names[i] || '') : '';
      this.Combine[combine.ID] = combine;
    });
  }

  addFilterRule(config: FilterRuleConfig, treeType?: number) {
    const rule = new FilterRule(config, treeType);
    this.Filter.group.rules.push(rule);
  }

  enableSigTest() {

  }

  showBase(isBaseShown: boolean) {
    this.ShowBase = isBaseShown;
  }

  showUnweightedBase(isBaseShown: boolean) {
    this.ShowUnWeightedBase = isBaseShown;
  }

  setUnweightedBaseMeasure(measure: Measure) {
    if (measure in Measure) {
      this.UnweightedbaseMeasure = measure;
    }
  }


  showTotal(isTotalShown: boolean) {
    this.Total = isTotalShown;
  }

  includeNotAnswered(isShown: boolean) {
    this.DisplayNoAnswer = isShown;
  }

  isDependentVariable(dependent: boolean) {
    this.IsdependentVariable = dependent;
  }

  setContinousVariable(val: boolean) {
    this.IsContinousVariable = val;
  }
}
