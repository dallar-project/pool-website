export class MinerLookup {
    constructor(
        public address: string
    ) {}
}

export class MinerStats {
    constructor(
       public pendingShares: Number,
       public pendingBalance: Number,
       public totalPaid: Number,
       public lastPayment: Date,
       public performance: IMinerPerformanceStat,
       public performance24H: IMinerPerformanceStat[],
    ) {}

    static fromEmpty():MinerStats {
        return new MinerStats(
            0, 0, 0, new Date(), { created: new Date(), workers: [] }, []
        );
    }
}

export interface IMinerPerformanceStat {
    created: Date;
    workers: IMinerWorkerPerformanceStat[]
}

export interface IMinerWorkerPerformanceStat {
    hashrate: Number;
    sharesPerSecond: Number;
}