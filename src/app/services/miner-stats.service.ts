import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from "environments/environment";
import { MinerStats } from 'app/models/miner-stats';

@Injectable()
export class MinerStatsService {
    constructor(private http: Http) {
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
