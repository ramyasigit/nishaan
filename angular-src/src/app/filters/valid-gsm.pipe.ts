import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validGsm'
})
export class ValidGsmPipe implements PipeTransform {

  transform(Data: any): any {
  //if (selectedValue === undefined) return Data;
    // var stageOne = Data.filter(o => o.deviceID == selectedValue);
    return Data.filter(o => o.gsm.latitude != 0);
  }

}
