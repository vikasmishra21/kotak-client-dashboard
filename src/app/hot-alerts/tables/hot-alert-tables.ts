import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';

export class HotAlertTables {
  constructor() { }

  public static getHotAlertTableConfig(page: number): Chart {
    const sideBreak = ['ID', 'v62', 'v57', 'v52', 'v53', 'v56', 'v66', 'v31'];
    const config = new Chart({
      SideBreak: sideBreak,
      TopBreak: [],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Profile
    }, 'Hot Alerts', ChartProvider.ECharts);
    sideBreak.forEach(sideBreakVariable => {
      config.setSideBreakFilter(sideBreakVariable, 'v5', [0, 1, 2, 3, 4, 5, 6], FilterCondition.AnyItemSelected);
    });
    config.addDataPagination(20, page);
    return config;
  }

  public static getHotAlertTableRespondentData(id): Chart {
    const sideBreak = ['v62', 'v5', 'v6', 'v21', 'v22', 'v24', 'v38', 'v40', 'v42', 'v44', 'v26', 'v34', 'v36', 'v29', 'v33', 'v30', 'v31', 'v52', 'v53', 'v54', 'v55', 'v56', 'v57', 'v60', 'v63', 'v64', 'v65', 'v66'];
    const config = new Chart({
      SideBreak: sideBreak,
      TopBreak: [],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Profile
    }, 'Hot Alert Respondent', ChartProvider.ECharts);
    config.addCollectionFilter('ID', [id], FilterCondition.NumberEqualTo)

    return config;
  }
}
