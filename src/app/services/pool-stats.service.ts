import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { PoolStats, PoolPortInfo, PoolPaymentProcessing, NetworkStats, TopMinerStats } from "../models/pool-stats";
import { environment } from "environments/environment";
import { IMiner } from "app/models/iminer";
import { IPoolPerformanceStat } from "app/models/ipoolperformancestat";
import { SiPipe } from 'app/services/various.pipe';

@Injectable()
export class PoolStatsService {
    constructor(private http: Http) {
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
                    SiPipe.prototype.transform(data.pool.networkStats.networkHashRate, 6, 'H/s'),
                    data.pool.networkStats.networkDifficulty,
                    data.pool.networkStats.lastNetworkBlockTime,
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
                    data.pool.poolStats.poolHashRate * environment.poolHashRateScale,
                    SiPipe.prototype.transform(data.pool.poolStats.poolHashRate * environment.poolHashRateScale, 6, 'H/s'),
                    data.pool.poolStats.validSharesPerSecond,
                    networkStats,
                    topMiners
                );
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getTopMiners(): Observable<IMiner[]> {
        return this.http.get(`${environment.poolApi}pools/${environment.poolId}/miners`)
            .map((res: Response) => {
                let data = res.json();
                data.forEach(miner => {
                    miner.hashrate *= environment.poolHashRateScale;
                    miner.hashrateFormatted = SiPipe.prototype.transform(miner.hashrate, 6, 'H/s');
                });
                return data as IMiner[];
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getPoolPerformance(): Observable<IPoolPerformanceStat[]> {
        return this.http.get(`${environment.poolApi}pools/${environment.poolId}/performance`)
        .map((res: Response) => {
            let data = res.json().stats;
            data.forEach(stat => {
                stat.poolHashRate *= environment.poolHashRateScale;
                stat.poolHashRateFormatted = SiPipe.prototype.transform(stat.poolHashRate, 6, 'H/s');
            });
            return data as IPoolPerformanceStat[];
        })
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
