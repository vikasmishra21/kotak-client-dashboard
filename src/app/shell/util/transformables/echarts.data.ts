import {Injectable} from '@angular/core';
import {TableOutput} from '../../interfaces/table-output';
import {DataTransformable} from '../../interfaces/data-transformable';

@Injectable()
export class EChartsData implements DataTransformable {

  toHBar(data: Array<TableOutput>): Array<any> {
    return data.map((d) => {
      return {
        name: d.SeriesName || 'No Label',
        value: Math.round(d.Score) || 0
      };
    });
  }

  toKPI(data: Array<TableOutput>): Array<any> {
    return [
      {
        name: data[0].SeriesName,
        value: undefined
      }
    ];
  }

  toLine(data: Array<TableOutput>): Array<any> {

    const series: object = {};
    const seriesIndex: Array<string> = new Array<string>();
    const categories = data.filter((elem, pos, self) => {
      return self.indexOf(elem) === pos;
    }).map(elem => elem.CategoryName);

    data.forEach((d, i) => {
      if (!series.hasOwnProperty(d.SeriesName)) {
        series[d.SeriesName] = new Array<number>();
        seriesIndex.push(d.SeriesName);
      }
      const indexInCategory = categories.indexOf(d.CategoryName);
      let score: number;
      score = isNaN(d.Score) ? undefined : d.Score;
      if (indexInCategory > -1) {
        series[d.SeriesName][indexInCategory] = score;
      }
    });

    return seriesIndex.map(d => ({
      values: series[d],
      text: d
    }));
  }

  toPie(data: Array<TableOutput>): Array<any> {
    return data.map((d) => {
      return {
        value: Math.round(d.Score),
        name: d.SeriesName || 'No Label' // set sum variable for temp one.
      };
    });
  }

  toRing(data: Array<TableOutput>): Array<any> {
    return undefined;
  }

  toVBar(data: Array<TableOutput>): Array<any> {
    return undefined;
  }

  toBar(data: Array<TableOutput>): Array<any> {
    return data.map((d) => {
      return {
        value: Math.round(d.Score) || 0,
        name: d.SeriesName || 'No Label'
      };
    });
  }

  toMeanChart(data: Array<TableOutput>): Array<any> {
    return undefined;
  }

  toScatter(data: Array<TableOutput>): Array<any> {
    if (data.length % 2 != 0) {
      return [];
    } else {
      var converted = [];
      var stopCondition = data.length / 2;
      for (var i = 0; i < stopCondition; i++) {
        converted.push([data[i].Score, data[i + stopCondition].Score]);
      }
      return converted;
    }
  }

  toStackedHorizontalBar(data: Array<TableOutput>): Array<any> {
    return undefined;
  }

  toStackedVerticalBar(data: Array<TableOutput>): Array<any> {
    return undefined;
  }

  toArea(data: Array<TableOutput>): Array<any> {
    return data.map((d) => {
      return {
        name: (d.SeriesName) ? d.SeriesName : undefined,
        value: Math.round(d.Score)
      };
    });
  }

  toBubble(data: Array<TableOutput>): Array<any> {
    // Will be defined later
    return undefined;
  }

  toGauge(data: Array<TableOutput>): Array<any> {
    const values = [];
    data.forEach(d => {
      values.push({value: d.Score, name: d.Score});
    });
    return values;
  }

  toRadar(data: Array<TableOutput>): Array<any> {
    return undefined;
  }
}
