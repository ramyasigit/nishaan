import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gateway'
})
export class GatewayPipe implements PipeTransform {

  transform(Data: any, selectedGateway?: any): any {
    //check if selectedGateway is undefined
    if (selectedGateway === undefined) return Data;
    // return updated user arrays

      return Data.filter(o => o.Id == selectedGateway);

  }

}
