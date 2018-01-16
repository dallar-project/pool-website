export class PoolStats {
    constructor(
       public id: string,
       public coin: string,
       public ports: PoolPortInfo[],
       public payment: PoolPaymentProcessing,
       public clientConnectionTimeout: number,
       public jobRebroadcastTimeout: number,
       public blockRefreshInterval: number,
       public poolFeePercent: number,
       public connectedMiners: number,
       public hashRate: number,
       public hashRateFormatted: string,
       public validSharesPerSecond: number,
       public networkStats: NetworkStats,
       public topMiners: TopMinerStats[]
    ) {}

    static fromEmpty():PoolStats {
        return new PoolStats(
            '', '' , [] , new PoolPaymentProcessing(false, 0, '', 0), 0, 0, 0, 0, 0, 0, '', 0, new NetworkStats(0, '', 0, new Date(), 0, 0), []
        );
    }
}

export class PoolPortInfo {
    constructor(
        public name: string,
        public port: number,
        public difficulty: number,
        public minDifficulty: number,
        public maxDifficulty: number,
        public targetTime: number,
        public retargetTime: number,
        public variancePercent: number
    ) {}
}

export class PoolPaymentProcessing {
    constructor(
        public enabled: boolean,
        public minimumPayment: number,
        public payoutScheme: string,
        public payoutSchemeFactor: number,
    ) {}
}

export class NetworkStats {
    constructor(
        public hashRate: number,
        public hashRateFormatted: string,
        public difficulty: number,
        public lastBlockTime: Date,
        public blockHeight: number,
        public connectedPeers: number,
    ) {}
}

export class TopMinerStats {
    constructor(
        public miner: string,
        public hashrate: number,
        public sharesPerSecond: number
    ){}
}