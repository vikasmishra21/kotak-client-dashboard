import {Injectable} from '@angular/core';
import {TableOutput} from '../../interfaces/table-output';
import {DataTransformable} from '../../interfaces/data-transformable';
import { count } from 'rxjs/operators';

@Injectable()
export class ZingChartData implements DataTransformable {

  toHBar(data: Array<TableOutput>): Array<any> {
    return undefined;
  }

  toKPI(data: Array<TableOutput>): Array<any> {
    return undefined;
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
      const score = isNaN(d.Score) ? undefined : Math.round(d.Score);
      if (indexInCategory > -1) {
        series[d.SeriesName][indexInCategory] = score;
      }
    });

    return seriesIndex.map(d => ({
      values: series[d],
      text: d
    }));
  }

  toBar(data: Array<TableOutput>): Array<any> {
    return data.map((d) => {
      return {
        value: d.Score || 0,
        name: d.SeriesName
      };
    });
  }

  toPie(data: Array<TableOutput>): Array<any> {
    const bgColor: Array<string> = ['#2fc32f', '#6f52b8', '#de672c', '#eab404', '#009FE0', '#b0dc0b', '#d5429b', '#ec2e2e'];
    return data.map((d, i) => {

      return {
        value: Math.round(d.Score),
        name: d.SeriesVariableID.split('.')[1] || 'Total TA', // set sum variable for temp one.
        bgColor: bgColor[i]
      };
    });
  }

  toRing(data: Array<TableOutput>): Array<any> {
    return data.map((d) => Math.round(d.Score) || 0);
  }

  toVBar(data: Array<TableOutput>): Array<any> {
    return undefined;
  }

  toMeanChart(data: Array<TableOutput>): Array<any> {
    return undefined;
  }

  toScatter(data: Array<TableOutput>): Array<any> {
    return undefined;
  }

  toStackedHorizontalBar(data: Array<TableOutput>): Array<any> {
    const bgColor: Array<string> = ['#2fc32f', '#6f52b8', '#de672c', '#eab404', '#009FE0', '#b0dc0b', '#d5429b', '#ec2e2e'];
    let seriesDetail = [];
    data.forEach((d,i)=>{
      const detail = {
        values :[d.Score],
        name:d.SeriesName,
        bgColor:bgColor[i]
      }
      let index = null;
      seriesDetail.forEach((val,i)=>{
        if(val.name == detail.name){
          index =i;
        }
      });
      if(index != null){
        seriesDetail[index].values.push(d.Score);
      }else{
        seriesDetail.push(detail);
      }
    });
    return seriesDetail;
  }

  toStackedVerticalBar(data: Array<TableOutput>): Array<any> {
    const bgColor: Array<string> = ['#2fc32f', '#6f52b8', '#de672c', '#eab404', '#009FE0', '#b0dc0b', '#d5429b', '#ec2e2e'];
    let seriesDetail = [];
    data.forEach((d,i)=>{
      const detail = {
        values :[d.Score],
        name:d.SeriesName,
        bgColor:bgColor[i]
      }
      let index = null;
      seriesDetail.forEach((val,i)=>{
        if(val.name == detail.name){
          index =i;
        }
      });
      if(index != null){
        seriesDetail[index].values.push(d.Score);
      }else{
        seriesDetail.push(detail) 
      }
    });
    return seriesDetail;
  }

  toArea(data: Array<TableOutput>): Array<any> {
    return undefined;
  }

  toBubble(data: Array<TableOutput>): Array<any> {
    return undefined;
  }

  toGauge(data: Array<TableOutput>): Array<any> {
    // Will be defined later
    return undefined;
  }
  toRadar(data: Array<TableOutput>): Array<any> {
    let seriesDetail = [];
    let values = [];
      
    data.forEach((d,i)=>{
      values.push(d.Score);
      //detail.labels.push(d.SeriesName);
      //let index = null;
      //seriesDetail.forEach((val,i)=>{
        // if(val.label == detail.label){
        //   index =i;
        // }
     // });
      // if(index != null){
      //   seriesDetail[index].values.push(d.Score);
      // }else{
      //   seriesDetail.push(detail);
      // }
    });
    seriesDetail.push(values);
    return seriesDetail;
  }

}
