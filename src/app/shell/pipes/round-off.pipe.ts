import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'roundOff'
})
export class RoundOffPipe implements PipeTransform {

  transform(value: any, args?: any, base?: number, noRoundOff?): any {

    if (base && base < 30) {
      return isNaN(value) || value === 'NaN' ? 'NA' : '';
    } else if (args) {
      return isNaN(value) || value === 'NaN' ? 'NA' : (noRoundOff == true ? value : Math.round(value)) + args[0];
    } else {
      return isNaN(value) || value === 'NaN' ? 'NA' : (noRoundOff == true ? value : Math.round(value));
    }
  }

}
