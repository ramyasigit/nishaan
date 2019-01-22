import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'testId'
})
export class TestIdPipe implements PipeTransform {

  transform(Data: any, selectedValue?: any): any {
    if (selectedValue === undefined || !selectedValue || selectedValue == null || selectedValue == "" || selectedValue == " ")
      return Data;
    return Data.filter(o => o.TestID == selectedValue);
  }

}
