import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from "environments/environment";
import { MinerStats } from 'app/models/miner-stats';

@Injectable()
export class MinerStatsService {
    constructor(private http: Http) {
    }

    // https://github.com/calvintam236/miningcore-ui/blob/develop/assets/js/miningcore-ui.js
    static toSI(value, decimal, unit): string {
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

    getMinerStats(workerAddress: String): Observable<MinerStats> {
        //@TODO: Validate worker address. Between 24-40 characters. Must start with a D.
        return this.http.get(`${environment.poolApi}pools/${environment.poolId}/miners/${workerAddress}`)
            .map((res: Response) => {
                let data = res.json();
                return data as MinerStats;
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}
