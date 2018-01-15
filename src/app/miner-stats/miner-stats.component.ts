import { Component } from "@angular/core";
import { PoolStatsService } from "app/services/pool-stats.service";
import { IMiner } from "app/models/iminer";
import { Observable } from "rxjs/Observable";

@Component({
    templateUrl: './miner-stats.component.html',
})

export class MinerStatsComponent {
    miners: Observable<IMiner[]>;

    constructor(private poolStatsService: PoolStatsService) {
        this.loadData();
    }

    loadData() {
        this.miners = this.poolStatsService.getMiners();
    }
}
