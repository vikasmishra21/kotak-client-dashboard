import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'optionFilter'
})
export class OptionFilterPipe implements PipeTransform {

  transform(items: any[], searchString: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchString) {
      return items;
    }
    searchString = searchString.toLowerCase();
    return this.find(items, searchString);
  }

  private find(items, searchString): any[] {
    return items.filter(it => {
      /*if (Array.isArray(it.child) && it.child.length > 0) {
        it.child = this.find(it.child, searchString);
      }*/
      return it.text.toLowerCase().includes(searchString);
    });
  }
}
