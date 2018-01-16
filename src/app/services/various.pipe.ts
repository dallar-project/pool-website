import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'environments/environment';

@Pipe({name: 'numkeys'})
export class NumKeysPipe implements PipeTransform {
  transform(value, args?) {
    return Object.keys(value).length;
  }
}

@Pipe({name: 'keyvalue'})
export class KeyValuePipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}


// https://github.com/calvintam236/miningcore-ui/blob/develop/assets/js/miningcore-ui.js
@Pipe({name: 'si'})
export class SiPipe implements PipeTransform {
  transform(value: number, decimal: number, unit: string): string {
    if (value === 0) {
      return '0 ' + unit;
    } else {
        var si = [
            { value: 1e-6, symbol: "μ" },
            { value: 1e-3, symbol: "m" },
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" },
        ];
        for (var i = si.length - 1; i > 0; i--) {
            if (value >= si[i].value) {
                break;
            }
        }
        return (value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + ' ' + si[i].symbol + unit;
    }
  }
}

@Pipe({name: 'hashScale'})
export class HashRateScalePipe implements PipeTransform {
  transform(value, args?):number {
    return value * environment.poolHashRateScale;
  }
}