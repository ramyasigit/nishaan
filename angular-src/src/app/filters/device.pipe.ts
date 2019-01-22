import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'device'
})
export class DevicePipe implements PipeTransform {

  transform(Data: any, selectedValue?: any): any {
    //check if selectedValue is undefined
    if (selectedValue === undefined || !selectedValue || selectedValue == null || selectedValue == "" || selectedValue == " ")
      return Data;
    // return updated user arrays

    return Data.filter(o => o.deviceID == selectedValue);

  }
}
