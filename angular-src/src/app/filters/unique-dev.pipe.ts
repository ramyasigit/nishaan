import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uniqueDev'
})
export class UniqueDevPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    // Remove the duplicate elements

    var uniqueArray = value.filter(function(item, pos) {
      return value.indexOf(item.deviceID) == pos.deviceID;
    });
    return uniqueArray;
  }
}
