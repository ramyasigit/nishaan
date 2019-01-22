import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validLocations'
})
export class ValidLocationsPipe implements PipeTransform {

  transform(Data: any): any {
  //if (selectedValue === undefined) return Data;
    // var stageOne = Data.filter(o => o.deviceID == selectedValue);
    return Data.filter(o => o.gps.latitude != 0);
  }

}
