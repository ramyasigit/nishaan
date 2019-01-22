import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceArray'
})
export class DeviceArrayPipe implements PipeTransform {

  transform(Data: any, selectedValue?: any): any {
    //check if selectedValue is undefined
    console.log('Data')
    console.log(Data);
    console.log('selectedValue');
    console.log(selectedValue);
    if (selectedValue.length == 0) return Data;
    // return updated user arrays
    else {
      console.log('not null')
      return Data.filter(function(o: any) {
        console.log('checking')
        for (var k in selectedValue) {
          if (o.deviceName == selectedValue[k]) return true;
        }
      });
    }
  }
}
