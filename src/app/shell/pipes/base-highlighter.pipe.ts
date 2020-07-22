import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'baseHighlight'
})
export class BaseHighlighter implements PipeTransform {

  transform(value: any, args?: any): any {

    value = parseInt(value, 10);
    return value >= 30 && value <= 50 ? '*' : value < 30 ? '**' : '';
  }

}
