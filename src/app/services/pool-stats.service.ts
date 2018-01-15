import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { PoolStats, PoolPortInfo, PoolPaymentProcessing, NetworkStats, TopMinerStats } from "../models/pool-stats";
import { environment } from "environments/environment";
import { IMiner } from "app/models/iminer";

@Injectable()
export class PoolStatsService {
    constructor(private http: Http) {
    }

    // https://github.com/calvintam236/miningcore-ui/blob/develop/assets/js/miningcore-ui.js
    toSI(value, decimal, unit): string {
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

    getPoolStats(): Observable<PoolStats> {
        return this.http.get(`${environment.poolApi}pools/${environment.poolId}`)
            .map((res: Response) => {
                let data = res.json();
                let coin = data.pool.coin.type;

                let ports = Object.keys(data.pool.ports);
                let portInfos = [];
                ports.forEach(port => {
                    portInfos.push(new PoolPortInfo(
                        data.pool.ports[port].name,
                        parseFloat(port),
                        data.pool.ports[port].difficulty,
                        data.pool.ports[port].varDiff.minDiff,
                        0,
                        data.pool.ports[port].targetTime,
                        data.pool.ports[port].retargetTime,
                        data.pool.ports[port].variancePercent
                    ));
                });

                let payment = new PoolPaymentProcessing(
                    data.pool.paymentProcessing.enabled,
                    data.pool.paymentProcessing.minimumPayment,
                    data.pool.paymentProcessing.payoutScheme,
                    data.pool.paymentProcessing.payoutSchemeConfig.factor
                );

                let networkStats = new NetworkStats(
                    data.pool.networkStats.networkHashRate,
                    data.pool.networkStats.networkDifficulty,
                    data.pool.networkStats.lastNetworkBlockTime,
                    //new Date(),
                    data.pool.networkStats.blockHeight,
                    data.pool.networkStats.connectedPeers
                );

                let topMiners = [];
                data.pool.topMiners.forEach(miner => {
                    topMiners.push(new TopMinerStats(miner.miner, miner.hashrate, miner.sharesPerSecond));
                });

                return new PoolStats(
                    data.pool.id,
                    data.pool.coin.type,
                    portInfos,
                    payment,
                    data.pool.clientConnectionTimeout,
                    data.pool.jobRebroadcastTimeout,
                    data.pool.blockRefreshInterval,
                    data.pool.poolFeePercent,
                    data.pool.poolStats.connectedMiners,
                    data.pool.poolStats.poolHashRate,
                    data.pool.poolStats.validSharesPerSecond,
                    networkStats,
                    topMiners
                );
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getMiners(): Observable<IMiner[]> {
        return this.http.get(`${environment.poolApi}pools/${environment.poolId}/miners`)
            .map((res: Response) => {
                const data = res.json();
                return data as IMiner[];
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}
