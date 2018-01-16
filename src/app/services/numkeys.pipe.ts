import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numkeys'
})
export class NumKeysPipe implements PipeTransform {

  transform(value, args?) {
    return Object.keys(value).length;
  }

}