import {Injectable} from '@angular/core';
import {ChartConfigurable} from '../../interfaces/chart-configurable';
import {ChartProviderConfiguration} from '../../interfaces/chart-provider-configuration';
import { element } from 'protractor';

@Injectable()
export class ZingChart implements ChartConfigurable {

  forBar(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forHBar(title: string, data: Array<any>): ChartProviderConfiguration {
    const config: any = {
      type: 'hbar',
      series: []
    };
    const series = {values: []};
    data.map(d => {
      series.values.push(d.value);
    });
    config.series.push(series);
    return config;
  }

  forKPI(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forLine(title: string, data: Array<any>): ChartProviderConfiguration {
  var config={  
  "type": "line",
  "height": '400px',
  "width": '500px',
  "series": [
    {
      "values":[20,40,25,50,15,45,33,34]
    },
    {
      "values":[5,30,21,18,59,50,28,33]
    }
  ]}
  return config;
}

  forMeanChart(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forPie(title: string, data: Array<any>): ChartProviderConfiguration {
    const config: any = {

      type: 'pie',
      plot: {
        tooltip: {
          text: '%t : %v'
        },
        borderWidth: 0,
        valueBox: {
          visible: true,
          'font-size': '12',
          'font-family': 'Arial',
          color: 'white',
          decimals: 0
        }
      },
      plotarea: {
        'margin-top': '0%',
        'margin-bottom': '15%'
      },
      legend: {
        layout: '2x3',
        x: '0%',
        y: '83%',
        // "layout":"1:1",
        'background-color': 'none',
        'toggle-action': 'remove',
        'border-width': 0,
        shadow: 0,
        'max-items': 6,
        height: '20%',
        overflow: 'scroll',
        item: {
          'font-color': '#7E7E7E',
          'max-chars': 17
        },
        tooltip: {
          text: '%t',
          'font-size': 10
        },
        scroll: {
          handle: {
            width: '8px'
          }
        }
      },
      series: []
    };

    data.forEach((d, i) => {
      config.series.push(
        {
          values: [d.value],
          ['background-color']: d.bgColor,
          text: d.name
        }
      );
    });
    return config;
  }

  forRing(title: string, data: Array<any>): ChartProviderConfiguration {
    const config: any = {
      type: 'ring',
      plot: {
        slice: 100
      },
      plotarea: {
        'margin-top': '0%',
        'margin-bottom': '0%',
        'margin-left': '0%',
        'margin-right': '0%',
      },
      scaleR: {
        refAngle: 270
      },
      series: []
    };
    data.forEach((d, i) => {
      config.series.push({
        values: [d]
      });
    });
    return config;
  }

  forScatter(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forStackedHorizontalBar(title: string, data: Array<any>): ChartProviderConfiguration {
    const config: any = {
      type: 'hbar',
      legend: {
        layout: '1x3', // row x column
        'border-width': '0',
        align: 'center',
        'vertical-align': 'top',
      },
      plot: {
        stacked: true,
        stackType: 'normal',
        margin: 0,
        'value-box': {
          'font-size': 12,
          'font-weight': 'normal',
          text: '%v %',
          color: 'white',
          placement: 'middle'
        }
      },
      plotarea: {
        'margin-top': '10%',
        'margin-right': 'dynamic',
        'margin-bottom': '19%',
        'margin-left': 'dynamic',
        'adjust-layout': true
      },
      scaleY: {
        visible: false,
        labels:[]
      },
      scaleX: {
        visible: true,
        labels:[],
      },
      series: []
    };
    data.forEach(d => {
      config.series.push(
        {values: d.values,['background-color']: d.bgColor, text: d.name}
      );
    });

    return config;
  }

  forStackedVerticalBar(title: string, data: Array<any>): ChartProviderConfiguration {
    const config: any = {
      type: 'vbar',
      legend: {
        layout: '1x3', // row x column
        'border-width': '0',
        align: 'center',
        'vertical-align': 'top',
      },
      plot: {
        stacked: true,
        stackType: 'normal',
        margin: 0,
        'value-box': {
          'font-size': 12,
          'font-weight': 'normal',
          text: '%v %',
          color: 'white',
          placement: 'middle'
        }
      },
      plotarea: {
        'margin-top': '10%',
        'margin-right': 'dynamic',
        'margin-bottom': '19%',
        'margin-left': 'dynamic',
        'adjust-layout': true
      },
      'scale-y': {
        visible: true
      },
      'scale-x': {
        visible: false
      },
      series: []
    };
    data.forEach(d => {
      config.series.push(
        {values: d.values,backgroundColor: d.bgColor, text: d.name}
      );
    });

    return config;
  }

  forVBar(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forArea(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forBubble(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forGauge(title: string, data: Array<any>): ChartProviderConfiguration {
    // Will be defined later
    return undefined;
  }
  forRadar(title: string, data: Array<any>): ChartProviderConfiguration {
    const config = {
        type: 'radar',
        plot: {
          tooltip: {
            text: '%t : %v'
          },
          borderWidth: 0,
          valueBox: {
            visible: true,
            'font-size': '12',
            'font-family': 'Arial',
            color: 'white',
            decimals: 0
          }
        },
        plotarea: {
          'margin-top': '0%',
          'margin-bottom': '15%'
        },
        legend: {
          layout: '2x3',
          x: '0%',
          y: '83%',
          // "layout":"1:1",
          'background-color': 'none',
          'toggle-action': 'remove',
          'border-width': 0,
          shadow: 0,
          'max-items': 6,
          height: '20%',
          overflow: 'scroll',
          item: {
            'font-color': '#7E7E7E',
            'max-chars': 17
          },
          tooltip: {
            text: '%t',
            'font-size': 10
          },
          scroll: {
            handle: {
              width: '8px'
            }
          }
        },
        scaleK: {
          visible:true,
          labels: [],
          guide:{
            items:[
              {
                alpha: 1,
                backgroundColor: 'none',
                borderColor: 'none',
                borderWidth: 0,
              }
            ]
          },
          tick : {
            lineColor : 'black',
            lineStyle:'solid',
            size : 10
          },
       },
       scaleV: {
         visible: true
       },
        series: [],
      };

      data.forEach((d, i) => {
        config.series.push(
          {
            values: d,
          }
        );
      });
      return config;
  }
}
