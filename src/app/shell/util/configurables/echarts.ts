import {Injectable} from '@angular/core';
import {ChartConfigurable} from '../../interfaces/chart-configurable';
import {ChartProviderConfiguration} from '../../interfaces/chart-provider-configuration';
import {isArray} from 'util';

declare const echarts: any;

@Injectable()
export class ECharts implements ChartConfigurable {

  forBar(title: string, data: Array<any>): ChartProviderConfiguration {
    // only get labels and heights as parameters

    const barLabels = [];
    const barHeights = [];
    let maxHeight;
    const dataShadow = [];

    for (let i = 0; i < data.length; i++) {
      barLabels.push(data[i].name);
      barHeights.push(data[i].value);
    }
    maxHeight = Math.max(...barHeights);

    for (let i = 0; i < barHeights.length; i++) {
      dataShadow.push(maxHeight);
    }

    return {
      title: {
        text: title,
      },
      grid: {},
      tooltip: {
        confine: true,
        position: (pos, params, dom, rect, size) => {
          // tooltip will be fixed on the right if mouse hovering on the left,
          // and on the left if hovering on the right.
          //  _ Pos <array> -> [a,b] -> a is horizontal distance from left, b is vertical distance from top
          const obj = {top: pos[1]};
          console.log(isArray(pos));
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return obj;
        }
      },
      xAxis: {
        data: barLabels,       
        axisLabel: {
          inside: true,
          textStyle: {
            color: '#fff'
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle:{color: '#D7D7D7'}
        },
        z: 10
      },
      yAxis: {
      splitLine:{show: false},
        axisLine: {
          show: true,
          lineStyle:{color: '#D7D7D7'}
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        }
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      series: [
        { // For shadow
          type: 'bar',
          itemStyle: {
            normal: {color: 'rgba(228,228,228,0.3)'}
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: dataShadow,
          animation: false
        },
        {
          type: 'bar',
          itemStyle: {
            normal: {
              color: 'rgba(0,55,114,1)'
            }
          },
          data: barHeights
        }
      ]
    };
  }

  forHBar(title: string, data: Array<any>): ChartProviderConfiguration {
    const option = {
      dataset: {
        source: [
          ['value', 'name']
        ]
      },
      title: {},
      padding: 0,
      grid: {containLabel: true},
      tooltip: {
        confine: true,
        position: (pos, params, dom, rect, size) => {
          // tooltip will be fixed on the right if mouse hovering on the left,
          // and on the left if hovering on the right.
          //  _ Pos <array> -> [a,b] -> a is horizontal distance from left, b is vertical distance from top
          const obj = {top: pos[1]};
          console.log(isArray(pos));
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return obj;
        }
      },
      xAxis: {name: 'score', splitLine: false},
      yAxis: {type: 'category'},
      series: [
        {
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          encode: {
            // Map the "amount" column to X axis.
            x: 'score',
            // Map the "product" column to Y axis
            y: 'product'
          }
        }
      ]
    };

    for (let i = 0; i < data.length; i++) {
      const val = [data[i].value, data[i].name];
      option.dataset.source.push(val);
    }

    return option;
  }

  forKPI(title: string, data: Array<any>): ChartProviderConfiguration {
    return {
      title: {
        text: data[0].name
      }
    };
  }

  forLine(title: string, data: Array<any>): ChartProviderConfiguration {
    const option = {
      title: {
        text: title
      },
      grid: {
        containLabel: true,
        bottom: 500
      },
      legend: {
        data: []
      },
      xAxis: {
        type: 'category',
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: []
    };

    for (let i = 0; i < data.length; i++) {
      option.legend.data.push(data[i].text);
      option.xAxis.data.push(i + 1);
      const seriesObject = {
        name: data[i].text,
        type: 'line',
        data: data[i].values
      };
      option.series.push(seriesObject);
    }

    return option;
  }

  forMeanChart(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forPie(title: string, data: Array<any>): ChartProviderConfiguration {

    const option = {
      grid: {
        containLabel: true
      },
      title: {
        left: 'center'
      },
      data: [{
        name: 'Drumstick'
      }],
      tooltip: {
        confine: true,
        trigger: 'item',
        formatter: '{b} : {c}<br/> {d}%'
      },
      series: [
        {
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'multiple',
          data: [
            // { value: 1548, name: 'Apple' },
            // { value: 535, name: 'Potato' },
            // { value: 510, name: 'Banana' },
            // { value: 634, name: 'Chicken' },
            // { value: 735, name: 'Drumstick' }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0,
              length: 5,
              length2: 5
            }
          }
        }
      ]
    };

    data.forEach((d) => {
      // option.series[0].data.push({ value: d.value, name: d.name });
      option.series[0].data.push({
        name: d.name,
        value: d.value
      });
    });

    return option;
  }

  forRing(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forScatter(title: string, data: Array<any>): ChartProviderConfiguration {
    return {
      grid: {
        containLabel: true
      },
      // baseOption:{
      //   xAxis:{},
      //   yAxis:{}
      // },
      xAxis: {},
      yAxis: {},
      series: [{
        symbolSize: 30,
        data: data,
        itemStyle: {
          normal: {
            color: 'rgba(194,53,49,1)',
            borderWidth: 2,
            label: {
              show: true,
              position: 'left',
            }
          }
        },
        type: 'scatter',
        tooltip: {
          trigger: 'item',
          // formatter: "{c}"
          formatter: c => {
            // console.log(JSON.stringify(c));
            return c.data[1] + '<br/>&nbsp;&nbsp;&nbsp;&nbsp;' + c.data[0];
          }
        }
      }]
    };
  }

  forStackedHorizontalBar(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forStackedVerticalBar(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forVBar(title: string, data: Array<any>): ChartProviderConfiguration {
    return undefined;
  }

  forArea(title: string, data: Array<any>): ChartProviderConfiguration {
    const option = {
      tooltip: {
        confine: true,
        // type: 'item',
        show: true,
        showContent: true,
        alwaysShowContent: false,
        triggerOn: 'mousemove',
        trigger: 'axis',
      },
      grid: {},
      xAxis: {
        data: [],
        type: 'category',
        boundaryGap: false
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [],
        type: 'line',
        areaStyle: {},
        tooltip: {
          type: 'item',
          axisPointer: {
            type: 'cross'
          }
        }
      }]
    };

    for (let i = 0; i < data.length; i++) {
      option.series[0].data.push(data[i].value);
      option.xAxis.data.push('' || data[i].name);
    }

    return option;
  }

  forBubble(title: string, data: Array<any>): ChartProviderConfiguration {
    // Will be defined later
    return undefined;
  }

  forGauge(title: string, data: Array<any>): ChartProviderConfiguration {
    return {
      series: [
        {
          type: 'pie',
          radius: ['80%', '110%'],
          center: ['50%', '100%'],
          startAngle: 180,
          endAngle: 0,
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              textStyle: {
                fontSize: '10',
                fontWeight: 'normal'
              }
            }
          },
          labelLine: {
            normal: {
              show: false,
              length:-6
            }
          },
          data: data.concat(data)
        }
      ]
    };
  }

  forRadar(title: string, data: Array<any>): ChartProviderConfiguration {
    // Will be defined later
    return undefined;
  }

}
